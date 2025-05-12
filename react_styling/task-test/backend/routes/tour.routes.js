const express = require('express');
const router = express.Router();
const Tour = require('../models/tour');
const Guide = require('../models/guide');
const User = require('../models/user');
const Booking = require('../models/booking'); // Add Booking model import
const { authenticateJWT } = require('../middlewares/auth');
const { sequelize } = require('../models');
const { Op } = require('sequelize');

// =================== FIXED ROUTE ORDER =================== //
// IMPORTANT: All specific routes with fixed paths must come before parameter routes like /:id
// This ensures Express matches the specific route instead of treating it as a parameter

// Get all tours for admin dashboard
router.get('/', async (req, res) => {
  try {
    const tours = await Tour.findAll({
      include: [
        {
          model: Guide,
          include: [
            {
              model: User,
              attributes: ['prenom', 'nom', 'email']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(tours);
  } catch (error) {
    console.error('Error fetching tours:', error);
    res.status(500).json({ message: 'Error fetching tours', error: error.message });
  }
});

// Get total tour count for admin dashboard
router.get('/count', async (req, res) => {
  try {
    const count = await Tour.count();
    res.json({ count });
  } catch (error) {
    console.error('Error counting tours:', error);
    res.status(500).json({ message: 'Error counting tours', error: error.message });
  }
});

// Get public tour details for published tours (MOVED TO TOP FOR PROPER ROUTING)
router.get('/public/:id', async (req, res) => {
  try {
    const tour = await Tour.findByPk(req.params.id, {
      include: [
        {
          model: Guide,
          include: [
            {
              model: User,
              attributes: ['prenom', 'nom', 'profileImage']
            }
          ]
        }
      ]
    });

    if (!tour) {
      return res.status(404).json({ message: 'Tour non trouvé' });
    }

    // Only allow viewing published tours
    if (tour.status !== 'published') {
      return res.status(404).json({ message: 'Tour non disponible' });
    }

    res.json({ tour });
  } catch (error) {
    console.error('Erreur récupération tour:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du tour' });
  }
});

// Get all published tours
router.get('/all', async (req, res) => {
  try {
    const tours = await Tour.findAll({
      include: [
        {
          model: Guide,
          attributes: ['title', 'location', 'price', 'user_id'],
        }
      ],
      order: [['date', 'DESC']]
    });
    res.json(tours);
  } catch (error) {
    console.error('Erreur lors de la récupération de tous les tours:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des tours.' });
  }
});

// Get pending booking requests for guide
router.get('/booking-requests', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    // Find the guide
    const guide = await Guide.findOne({ 
      where: { user_id: userId }
    });
    
    if (!guide) {
      return res.status(404).json({ message: 'Guide not found' });
    }
    
    // Find all tours by this guide
    const tours = await Tour.findAll({
      where: { guide_id: guide.guide_id }
    });
    
    if (tours.length === 0) {
      return res.json({ bookingRequests: [] });
    }
    
    // Get tour IDs
    const tourIds = tours.map(tour => tour.tour_id);
    
    // Find all pending bookings for these tours
    const bookingRequests = await Booking.findAll({
      where: { approval_status: 'pending' },
      include: [{
        model: Tour,
        where: { tour_id: tourIds },
        include: [{
          model: Guide,
          include: [{
            model: User,
            attributes: ['prenom', 'nom', 'email', 'profileImage']
          }]
        }]
      }, {
        model: User,
        attributes: ['user_id', 'prenom', 'nom', 'email', 'profileImage']
      }],
      order: [['booking_date', 'DESC']] // Changed from createdAt to booking_date
    });
    
    res.json({ bookingRequests });
  } catch (error) {
    console.error('Error fetching booking requests:', error);
    res.status(500).json({ 
      message: 'Error fetching booking requests',
      error: error.message 
    });
  }
});

// Get user's bookings with detailed status information
router.get('/my-bookings', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const bookings = await Booking.findAll({
      where: { user_id: userId },
      include: [{
        model: Tour,
        include: [{
          model: Guide,
          include: [{
            model: User,
            attributes: ['prenom', 'nom', 'email', 'profileImage']
          }]
        }]
      }],
      order: [['booking_date', 'ASC']]
    });
    
    // Format the bookings to include more detailed status information
    const formattedBookings = bookings.map(booking => {
      const bookingData = booking.toJSON();
      
      // Add a human-readable status
      let statusMessage = '';
      
      if (booking.approval_status === 'pending') {
        statusMessage = 'En attente d\'approbation par le guide';
      } else if (booking.approval_status === 'approved') {
        if (booking.status === 'confirmed') {
          statusMessage = 'Réservation confirmée';
        } else if (booking.status === 'completed') {
          statusMessage = 'Tour terminé';
        } else if (booking.status === 'cancelled') {
          statusMessage = 'Réservation annulée';
        }
      } else if (booking.approval_status === 'rejected') {
        statusMessage = 'Réservation rejetée par le guide';
      }
      
      return {
        ...bookingData,
        statusMessage
      };
    });
    
    res.json({
      bookings: formattedBookings,
      statusCounts: {
        pending: bookings.filter(b => b.approval_status === 'pending').length,
        approved: bookings.filter(b => b.approval_status === 'approved').length,
        rejected: bookings.filter(b => b.approval_status === 'rejected').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
        total: bookings.length
      }
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ 
      message: 'Error fetching bookings',
      error: error.message 
    });
  }
});

// Get user's upcoming tours (agenda view)
router.get('/my-agenda', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const today = new Date();
    
    const bookings = await Booking.findAll({
      where: { 
        user_id: userId,
        approval_status: 'approved',
        status: 'confirmed',
        booking_date: {
          [Op.gte]: today
        }
      },
      include: [{
        model: Tour,
        include: [{
          model: Guide,
          include: [{
            model: User,
            attributes: ['prenom', 'nom', 'email', 'profileImage']
          }]
        }]
      }],
      order: [['booking_date', 'ASC']]
    });
    
    // Group tours by month for better organization
    const toursByMonth = {};
    
    bookings.forEach(booking => {
      const date = new Date(booking.booking_date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthName = date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
      
      if (!toursByMonth[monthKey]) {
        toursByMonth[monthKey] = {
          name: monthName,
          tours: []
        };
      }
      
      toursByMonth[monthKey].tours.push(booking);
    });
    
    res.json({
      agenda: Object.values(toursByMonth),
      upcomingToursCount: bookings.length
    });
  } catch (error) {
    console.error('Error fetching agenda:', error);
    res.status(500).json({ 
      message: 'Error fetching agenda',
      error: error.message 
    });
  }
});

// Get guide's booking statistics per tour
router.get('/guide-stats', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    // Find the guide
    const guide = await Guide.findOne({ 
      where: { user_id: userId }
    });
    
    if (!guide) {
      return res.status(404).json({ message: 'Guide not found' });
    }
    
    // Find all tours by this guide
    const tours = await Tour.findAll({
      where: { guide_id: guide.guide_id },
      attributes: [
        'tour_id', 
        'title', 
        'location', 
        'date', 
        'maxParticipants', 
        'price',
        'status'
      ]
    });
    
    if (tours.length === 0) {
      return res.json({ tours: [] });
    }
    
    // Get tour IDs
    const tourIds = tours.map(tour => tour.tour_id);
    
    // Get bookings for these tours
    const bookings = await Booking.findAll({
      where: { tour_id: tourIds },
      attributes: [
        'tour_id',
        'status',
        'approval_status',
        'booking_date',
        'participants',
        [sequelize.fn('COUNT', sequelize.col('booking_id')), 'bookingCount'],
        [sequelize.fn('SUM', sequelize.col('participants')), 'totalParticipants']
      ],
      group: ['tour_id', 'status', 'approval_status'],
      raw: true
    });
    
    // Organize data by tour
    const tourStats = tours.map(tour => {
      const tourData = tour.toJSON();
      
      // Filter bookings for this tour
      const tourBookings = bookings.filter(b => b.tour_id === tour.tour_id);
      
      // Calculate statistics
      const pendingCount = tourBookings.filter(b => b.approval_status === 'pending')
        .reduce((sum, b) => sum + parseInt(b.bookingCount), 0);
        
      const approvedCount = tourBookings.filter(b => b.approval_status === 'approved')
        .reduce((sum, b) => sum + parseInt(b.bookingCount), 0);
        
      const totalParticipants = tourBookings.reduce((sum, b) => sum + (parseInt(b.totalParticipants) || 0), 0);
      
      const availableSpots = tour.maxParticipants ? (tour.maxParticipants - totalParticipants) : null;
      
      return {
        ...tourData,
        stats: {
          pendingBookings: pendingCount,
          approvedBookings: approvedCount,
          totalBookings: pendingCount + approvedCount,
          totalParticipants,
          availableSpots,
          isFullyBooked: availableSpots !== null ? availableSpots <= 0 : false,
          estimatedRevenue: approvedCount * parseFloat(tour.price || 0)
        }
      };
    });
    
    res.json({ 
      tours: tourStats,
      summary: {
        totalTours: tours.length,
        publishedTours: tours.filter(t => t.status === 'published').length,
        totalBookings: bookings.reduce((sum, b) => sum + parseInt(b.bookingCount), 0),
        totalParticipants: bookings.reduce((sum, b) => sum + (parseInt(b.totalParticipants) || 0), 0)
      }
    });
  } catch (error) {
    console.error('Error fetching guide statistics:', error);
    res.status(500).json({ 
      message: 'Error fetching guide statistics',
      error: error.message 
    });
  }
});

// Get guide's received bookings
router.get('/guide-bookings', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    // Find the guide
    const guide = await Guide.findOne({ 
      where: { user_id: userId }
    });
    
    if (!guide) {
      return res.status(404).json({ message: 'Guide not found' });
    }
    
    // Find all tours by this guide
    const tours = await Tour.findAll({
      where: { guide_id: guide.guide_id }
    });
    
    if (tours.length === 0) {
      return res.json([]);
    }
    
    // Get tour IDs
    const tourIds = tours.map(tour => tour.tour_id);
    
    // Find all bookings for these tours
    const bookings = await Booking.findAll({
      include: [{
        model: Tour,
        where: { tour_id: tourIds },
        include: [{
          model: Guide,
          include: [{
            model: User,
            attributes: ['prenom', 'nom', 'email', 'profileImage']
          }]
        }]
      }, {
        model: User,
        attributes: ['user_id', 'prenom', 'nom', 'email', 'profileImage']
      }],
      order: [['booking_date', 'ASC']]
    });
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching guide bookings:', error);
    res.status(500).json({ 
      message: 'Error fetching guide bookings',
      error: error.message 
    });
  }
});

// Get all published tours by current guide
router.get('/my-published', authenticateJWT, async (req, res) => {
  try {
    // Find the guide ID for the current user
    const guide = await Guide.findOne({ 
      where: { user_id: req.user.user_id }
    });
    
    if (!guide) {
      return res.status(404).json({ message: 'Guide non trouvé' });
    }
    
    // Get all published tours for this guide
    const tours = await Tour.findAll({
      where: { 
        guide_id: guide.guide_id,
        status: 'published'
      },
      order: [['createdAt', 'DESC']]
    });

    res.json({ tours });
  } catch (error) {
    console.error('Erreur récupération tours publiés:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des tours publiés' });
  }
});

// Create (publish) a new tour
router.post('/publish', authenticateJWT, async (req, res) => {
  try {
    // First verify user is a guide
    const guide = await Guide.findOne({ 
      where: { user_id: req.user.user_id }
    });
    
    if (!guide) {
      return res.status(403).json({ message: 'Vous devez être un guide pour publier un tour' });
    }
    
    const {
      title,
      description,
      location,
      duration,
      price,
      maxParticipants,
      date,
      meetingPoint,
      included,
      notIncluded,
      requirements
    } = req.body;

    // Create the tour
    const tour = await Tour.create({
      guide_id: guide.guide_id,
      title,
      description,
      location,
      duration,
      price,
      maxParticipants,
      date,
      meetingPoint,
      included,
      notIncluded,
      requirements,
      status: 'published' // New status for published tours
    });

    res.status(201).json({
      message: 'Tour publié avec succès',
      tour
    });
  } catch (error) {
    console.error('Erreur publication tour:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la publication du tour',
      error: error.message 
    });
  }
});

// Book a tour
router.post('/book/:id', authenticateJWT, async (req, res) => {
  try {
    const tourId = req.params.id;
    const userId = req.user.user_id;
    
    // Find the tour
    const tour = await Tour.findByPk(tourId);
    
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    
    if (tour.status !== 'published') {
      return res.status(400).json({ message: 'This tour is not available for booking' });
    }
    
    const { date, time, participants, special_requirements, contact_info, payment_info, pricing } = req.body;
    
    // If date is missing, use the tour's date
    const finalBookingDate = date || tour.date;
    
    if (!finalBookingDate) {
      return res.status(400).json({ 
        message: 'Booking date is required',
        receivedData: req.body
      });
    }
    
    // Generate a booking reference
    const bookingReference = `TB-${Math.floor(Math.random() * 1000000)}`;
    
    // Create the booking with pending approval status - exclude timestamp fields
    const booking = await Booking.create({
      tour_id: tourId,
      user_id: userId,
      booking_date: finalBookingDate,
      booking_time: time || '10:00',
      participants: participants || 1,
      special_requirements: special_requirements || '',
      contact_info: contact_info || {},
      payment_info: payment_info || {},
      pricing: pricing || {},
      booking_reference: bookingReference,
      approval_status: 'pending', // Set status to pending initially
      status: 'confirmed'
    });
    
    res.status(201).json({
      message: 'Booking request submitted successfully, waiting for guide approval',
      bookingReference,
      booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ 
      message: 'Error creating booking',
      error: error.message 
    });
  }
});

// Cancel a booking
router.put('/cancel/:id', authenticateJWT, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.user_id;
    
    const booking = await Booking.findByPk(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if the booking belongs to the user
    if (booking.user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }
    
    // Check if the booking can be cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'This booking is already cancelled' });
    }
    
    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed booking' });
    }
    
    // Update booking status
    booking.status = 'cancelled';
    await booking.save();
    
    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ 
      message: 'Error cancelling booking',
      error: error.message 
    });
  }
});

// Update a published tour
router.put('/update/:id', authenticateJWT, async (req, res) => {
  try {
    const tourId = req.params.id;
    
    // Find the tour
    const tour = await Tour.findByPk(tourId);
    
    if (!tour) {
      return res.status(404).json({ message: 'Tour non trouvé' });
    }
    
    // Find the guide ID for the current user
    const guide = await Guide.findOne({ 
      where: { user_id: req.user.user_id }
    });
    
    if (!guide) {
      return res.status(403).json({ message: 'Vous devez être un guide pour modifier un tour' });
    }
    
    // Check if the tour belongs to this guide
    if (tour.guide_id !== guide.guide_id) {
      return res.status(403).json({ message: 'Vous ne pouvez modifier que vos propres tours' });
    }
    
    // Fields that can be updated
    const {
      title,
      description,
      location,
      duration,
      price,
      maxParticipants,
      date,
      meetingPoint,
      included,
      notIncluded,
      requirements
    } = req.body;
    
    // Update the tour with new values
    await tour.update({
      title: title || tour.title,
      description: description || tour.description,
      location: location || tour.location,
      duration: duration || tour.duration,
      price: price || tour.price,
      maxParticipants: maxParticipants || tour.maxParticipants,
      date: date || tour.date,
      meetingPoint: meetingPoint || tour.meetingPoint,
      included: included || tour.included,
      notIncluded: notIncluded || tour.notIncluded,
      requirements: requirements || tour.requirements
    });
    
    res.json({
      message: 'Tour mis à jour avec succès',
      tour
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du tour:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour du tour',
      error: error.message 
    });
  }
});

// Approve a booking request
router.put('/booking/:id/approve', authenticateJWT, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.user_id;
    const { notes } = req.body;
    
    // Find the booking
    const booking = await Booking.findByPk(bookingId, {
      include: [{
        model: Tour,
        include: [{ model: Guide }]
      }]
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if the user is the guide for this tour
    const guide = await Guide.findOne({ where: { user_id: userId } });
    
    if (!guide) {
      return res.status(403).json({ message: 'You must be a guide to approve bookings' });
    }
    
    if (booking.Tour.guide_id !== guide.guide_id) {
      return res.status(403).json({ message: 'You can only approve bookings for your own tours' });
    }
    
    // Check if the booking can be approved
    if (booking.approval_status !== 'pending') {
      return res.status(400).json({ message: 'This booking is no longer pending approval' });
    }
    
    // Update booking status
    booking.approval_status = 'approved';
    if (notes) {
      booking.guide_notes = notes;
    }
    await booking.save();
    
    res.json({
      message: 'Booking approved successfully',
      booking
    });
  } catch (error) {
    console.error('Error approving booking:', error);
    res.status(500).json({ 
      message: 'Error approving booking',
      error: error.message 
    });
  }
});

// Reject a booking request
router.put('/booking/:id/reject', authenticateJWT, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.user_id;
    const { reason } = req.body;
    
    // Find the booking
    const booking = await Booking.findByPk(bookingId, {
      include: [{
        model: Tour,
        include: [{ model: Guide }]
      }]
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if the user is the guide for this tour
    const guide = await Guide.findOne({ where: { user_id: userId } });
    
    if (!guide) {
      return res.status(403).json({ message: 'You must be a guide to reject bookings' });
    }
    
    if (booking.Tour.guide_id !== guide.guide_id) {
      return res.status(403).json({ message: 'You can only reject bookings for your own tours' });
    }
    
    // Check if the booking can be rejected
    if (booking.approval_status !== 'pending') {
      return res.status(400).json({ message: 'This booking is no longer pending approval' });
    }
    
    // Update booking status
    booking.approval_status = 'rejected';
    booking.guide_notes = reason || 'Rejected by guide';
    booking.status = 'cancelled'; // Also mark the booking as cancelled
    await booking.save();
    
    res.json({
      message: 'Booking rejected successfully',
      booking
    });
  } catch (error) {
    console.error('Error rejecting booking:', error);
    res.status(500).json({ 
      message: 'Error rejecting booking',
      error: error.message 
    });
  }
});

// ============= PARAMETER ROUTES LAST ============= //
// These routes use parameters and should come after all specific routes

// Get tour details
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const tour = await Tour.findByPk(req.params.id, {
      include: [
        {
          model: Guide,
          attributes: ['title', 'description', 'location', 'price']
        },
        {
          model: User,
          as: 'TourClient', // Updated to match the new alias in models/index.js
          attributes: ['nom', 'prenom', 'email', 'profileImage']
        }
      ]
    });

    if (!tour) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    // Check if user is authorized to view this tour
    if (tour.client_id !== req.user.user_id && 
        tour.guide.user_id !== req.user.user_id) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    res.json({ tour });
  } catch (error) {
    console.error('Erreur récupération tour:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la réservation' });
  }
});

// Update tour status
router.put('/:id/status', authenticateJWT, async (req, res) => {
  try {
    const { status } = req.body;
    const tour = await Tour.findByPk(req.params.id);

    if (!tour) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    const guide = await Guide.findOne({ 
      where: { user_id: req.user.user_id }
    });
    
    if (!guide || guide.guide_id !== tour.guide_id) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    tour.status = status;
    await tour.save();

    return res.json({
      message: 'Statut de la réservation mis à jour avec succès',
      tour
    });
  } catch (error) {
    console.error('[Update Tour Status] Error:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut' });
  }
});

// Cancel tour
router.put('/:id/cancel', async (req, res) => {
  try {
    const { reason } = req.body;
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    if (tour.client.toString() !== req.user.id && 
        tour.guide.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    if (tour.status === 'completed' || tour.status === 'cancelled') {
      return res.status(400).json({ message: 'Cette réservation ne peut pas être annulée' });
    }

    tour.status = 'cancelled';
    await tour.save();

    // Update guide availability
    const guide = await Guide.findById(tour.guide);
    const availability = guide.availability.find(
      a => a.date.toDateString() === tour.date.toDateString()
    );
    if (availability) {
      const timeSlot = availability.timeSlots.find(
        slot => slot.startTime === tour.startTime && slot.endTime === tour.endTime
      );
      if (timeSlot) {
        timeSlot.isBooked = false;
        await guide.save();
      }
    }
    return res.json({
      message: 'Réservation annulée avec succès',
      tour
    });
  } catch (error) {
    console.error('[Cancel Tour] Error:', error);
    return res.status(500).json({ message: 'Erreur lors de l\'annulation de la réservation' });
  }
});

// Delete tour by ID - for admin functionality
router.delete('/:id', async (req, res) => {
  try {
    const tourId = req.params.id;
    
    // Find the tour
    const tour = await Tour.findByPk(tourId);
    
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    
    // Delete the tour
    await tour.destroy();
    
    res.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('Error deleting tour:', error);
    res.status(500).json({ message: 'Error deleting tour', error: error.message });
  }
});

module.exports = router;
