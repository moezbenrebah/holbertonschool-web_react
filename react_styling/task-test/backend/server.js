const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Load models
const StressEntry = require('./models/StressEntry');
const BreathingSession = require('./models/BreathingSession');
const MeditationSession = require('./models/MeditationSession');

// Load env vars
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Connect to MongoDB
let isConnected = false;
(async () => {
  isConnected = await connectDB();
  console.log(`MongoDB connection status: ${isConnected ? 'Connected' : 'Not connected'}`);
})();

// Add a route to check MongoDB connection status
app.get('/api/status', (req, res) => {
  res.json({
    server: 'running',
    mongoDbConnection: isConnected ? 'connected' : 'disconnected'
  });
});

// Log MongoDB connection status every minute
setInterval(() => {
  console.log(`MongoDB connection status: ${isConnected ? 'Connected' : 'Not connected'}`);
  if (!isConnected) {
    // Try to reconnect
    (async () => {
      console.log('Attempting to reconnect to MongoDB...');
      isConnected = await connectDB();
    })();
  }
}, 60000);

// Simple route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Mindflow API is running',
    mongoDBConnected: isConnected
  });
});
// ====== AUTH ROUTES =========================================
app.use('/api/auth', require('./routes/auth'));

// ====== STRESS ROUTES ====================================
app.get('/api/stress', async (req, res) => {
  try {
    const userId = req.query.userId || req.header('x-user-id');
    
    if (!userId) {
      return res.status(400).json({ msg: 'User ID is required' });
    }
    
    if (!isConnected) {
      console.log('MongoDB not connected, returning empty array');
      return res.json([]);
    }
    
    const entries = await StressEntry.find({ userId }).sort({ timestamp: -1 });
    console.log(`Found ${entries.length} stress entries for user ${userId}`);
    
    res.json(entries);
  } catch (err) {
    console.error('Error fetching stress entries:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/stress', async (req, res) => {
  try {
    const { userId, date, timestamp, level, factors, journal } = req.body;
    
    if (!userId || !date || level === undefined) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }
    
    if (!isConnected) {
      console.log('MongoDB not connected, returning mock response');
      return res.json({ ...req.body, _id: 'mock-id-' + Date.now() });
    }
    
    const newEntry = new StressEntry({
      userId,
      date,
      timestamp,
      level,
      factors: factors || [],
      journal: journal || ''
    });
    
    const savedEntry = await newEntry.save();
    console.log(`Saved new stress entry with ID: ${savedEntry._id}`);
    
    res.json(savedEntry);
  } catch (err) {
    console.error('Error saving stress entry:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/stress/:id', async (req, res) => {
  try {
    if (!isConnected) {
      console.log('MongoDB not connected, returning mock response');
      return res.json({ ...req.body, _id: req.params.id });
    }
    
    const updatedEntry = await StressEntry.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    if (!updatedEntry) {
      return res.status(404).json({ msg: 'Entry not found' });
    }
    
    res.json(updatedEntry);
  } catch (err) {
    console.error('Error updating stress entry:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/stress/:id', async (req, res) => {
  try {
    if (!isConnected) {
      console.log('MongoDB not connected, returning mock response');
      return res.json({ msg: 'Entry deleted', id: req.params.id });
    }
    
    const entry = await StressEntry.findById(req.params.id);
    
    if (!entry) {
      return res.status(404).json({ msg: 'Entry not found' });
    }
    
    await entry.deleteOne();
    res.json({ msg: 'Entry deleted', id: req.params.id });
  } catch (err) {
    console.error('Error deleting stress entry:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ====== BREATHING ROUTES =========================================

// Discover user ID based on browser fingerprint or other criteria
app.get('/api/breathing/discover-user', async (req, res) => {
  try {
    if (!isConnected) {
      return res.json({ userId: null });
    }
    
    // Here you would normally use a browser fingerprint
    // For simplicity, we'll just return the first userId in the database
    const userIds = await BreathingSession.distinct('userId');
    
    if (userIds.length > 0) {
      return res.json({ userId: userIds[0] });
    }
    
    return res.json({ userId: null });
  } catch (err) {
    console.error('Error discovering user ID:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Add a debugging endpoint to get all breathing sessions
app.get('/api/breathing/all', async (req, res) => {
  try {
    if (!isConnected) {
      return res.status(500).json({ msg: 'MongoDB not connected' });
    }
    
    // Get all breathing sessions in the database
    const sessions = await BreathingSession.find({}).sort({ timestamp: -1 });
    console.log(`Found ${sessions.length} total breathing sessions in the database`);
    
    res.json(sessions);
  } catch (err) {
    console.error('Error getting all breathing sessions:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get all breathing sessions for a user
app.get('/api/breathing', async (req, res) => {
  try {
    const userId = req.query.userId || req.header('x-user-id');
    
    console.log(`GET /api/breathing - Requested for userId: "${userId}"`);
    
    if (!userId) {
      console.log('GET /api/breathing - No userId provided');
      return res.status(400).json({ msg: 'User ID is required' });
    }
    
    if (!isConnected) {
      console.log('GET /api/breathing - MongoDB not connected, returning empty array');
      return res.json([]);
    }
    
    // Get all users in the database for debugging
    const allUsers = await BreathingSession.distinct('userId');
    console.log('GET /api/breathing - All userIds in database:', allUsers);
    
    // Get sessions for this user
    const sessions = await BreathingSession.find({ userId }).sort({ timestamp: -1 });
    console.log(`GET /api/breathing - Found ${sessions.length} sessions for userId "${userId}"`);
    
    // For debugging - check if we'd find any sessions with a substring match
    if (sessions.length === 0 && userId) {
      const partialSessions = await BreathingSession.find({ 
        userId: { $regex: userId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } 
      });
      
      if (partialSessions.length > 0) {
        console.log(`GET /api/breathing - Found ${partialSessions.length} sessions with partial userId match`);
        console.log('GET /api/breathing - First partial match:', partialSessions[0]);
      }
    }
    
    res.json(sessions);
  } catch (err) {
    console.error('GET /api/breathing - Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/breathing', async (req, res) => {
  try {
    const { userId, exerciseId, exerciseName, date, timestamp, duration, completed } = req.body;
    
    if (!userId || !exerciseId || !date || !timestamp) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }
    
    if (!isConnected) {
      console.log('MongoDB not connected, returning mock response');
      return res.json({ ...req.body, _id: 'mock-id-' + Date.now() });
    }
    
    const newSession = new BreathingSession({
      userId,
      exerciseId,
      exerciseName,
      date,
      timestamp,
      duration: duration || 0,
      completed: completed !== undefined ? completed : false
    });
    
    const savedSession = await newSession.save();
    console.log(`Saved new breathing session with ID: ${savedSession._id}`);
    
    res.json(savedSession);
  } catch (err) {
    console.error('Error saving breathing session:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/breathing/:id', async (req, res) => {
  try {
    if (!isConnected) {
      console.log('MongoDB not connected, returning mock response');
      return res.json({ ...req.body, _id: req.params.id });
    }
    
    let session;
    
    // Check if id is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      session = await BreathingSession.findById(req.params.id);
    } else {
      // If not a valid ObjectId, try to find by client-generated ID field if stored
      session = await BreathingSession.findOne({ 
        $or: [
          { id: req.params.id },
          { clientId: req.params.id }
        ]
      });
    }
    
    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }
    
    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== '_id' && key !== 'id') { // Don't overwrite IDs
        session[key] = req.body[key];
      }
    });
    
    const updatedSession = await session.save();
    res.json(updatedSession);
  } catch (err) {
    console.error('Error updating breathing session:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/breathing/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`DELETE /api/breathing/${id}`);
    
    if (!isConnected) {
      console.log('MongoDB not connected, returning mock response');
      return res.json({ msg: 'Session deleted', id });
    }
    
    let deletedSession;
    
    // First try with MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      deletedSession = await BreathingSession.findByIdAndDelete(id);
    }
    
    // If not found or not a valid ObjectId, try with client ID field
    if (!deletedSession) {
      // Try to find by any field that might contain the ID
      deletedSession = await BreathingSession.findOneAndDelete({
        $or: [
          { id: id },
          { clientId: id }
        ]
      });
    }
    
    if (!deletedSession) {
      console.log(`Session not found with ID: ${id}`);
      return res.status(404).json({ error: 'Session not found' });
    }
    
    console.log(`Successfully deleted session with ID: ${id}`);
    res.json({ 
      msg: 'Session deleted successfully', 
      id,
      deletedSession 
    });
  } catch (err) {
    console.error(`Error deleting breathing session ${req.params.id}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// ====== MEDITATION ROUTES ======
app.get('/api/meditation', async (req, res) => {
  try {
    const userId = req.query.userId || req.header('x-user-id');
    
    if (!userId) {
      return res.status(400).json({ msg: 'User ID is required' });
    }
    
    console.log(`GET /api/meditation for user ${userId}`);
    
    if (!isConnected) {
      console.log('MongoDB not connected, returning empty array');
      return res.json([]);
    }
    
    const sessions = await MeditationSession.find({ userId }).sort({ completedAt: -1 });
    console.log(`Found ${sessions.length} meditation sessions for user ${userId}`);
    
    res.json(sessions);
  } catch (err) {
    console.error('Error fetching meditation sessions:', err.message);
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/meditation', async (req, res) => {
  try {
    const { userId, technique, startedAt, completedAt, duration, completed } = req.body;
    
    if (!userId || !technique || !completedAt || duration === undefined) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }
    
    if (!isConnected) {
      console.log('MongoDB not connected, returning mock response');
      return res.json({ ...req.body, _id: 'mock-id-' + Date.now() });
    }
    
    const newSession = new MeditationSession({
      userId,
      technique,
      startedAt,
      completedAt,
      duration,
      completed: completed !== undefined ? completed : true
    });
    
    const savedSession = await newSession.save();
    console.log(`Saved new meditation session with ID: ${savedSession._id}`);
    
    res.json(savedSession);
  } catch (err) {
    console.error('Error saving meditation session:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/meditation/:id', async (req, res) => {
  try {
    if (!isConnected) {
      console.log('MongoDB not connected, returning mock response');
      return res.json({ msg: 'Session deleted', id: req.params.id });
    }
    
    const session = await MeditationSession.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }
    
    await session.deleteOne();
    res.json({ msg: 'Session deleted', id: req.params.id });
  } catch (err) {
    console.error('Error deleting meditation session:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));