const sequelize = require('../config/database');
const User = require('../models/user');
const Guide = require('../models/guide');
const Tour = require('../models/tour');

// Test DB Connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

// Create example guide users
async function createGuideUsers() {
  const guideUsers = [
    {
      email: 'pierre.durand@example.com',
      password: 'password123',
      nom: 'Durand',
      prenom: 'Pierre',
      role: 'guide',
      profileImage: 'default-profile.png'
    },
    {
      email: 'marie.laurent@example.com',
      password: 'password123',
      nom: 'Laurent',
      prenom: 'Marie',
      role: 'guide',
      profileImage: 'default-profile.png'
    },
    {
      email: 'jean.bernard@example.com',
      password: 'password123',
      nom: 'Bernard',
      prenom: 'Jean',
      role: 'guide',
      profileImage: 'default-profile.png'
    },
    {
      email: 'sophie.martin@example.com',
      password: 'password123',
      nom: 'Martin',
      prenom: 'Sophie',
      role: 'guide',
      profileImage: 'default-profile.png'
    }
  ];

  const createdUsers = [];

  for (const userData of guideUsers) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email: userData.email } });
      
      if (existingUser) {
        console.log(`User ${userData.email} already exists, skipping creation.`);
        createdUsers.push(existingUser);
        continue;
      }

      // Let the User model hooks handle password hashing
      const user = await User.create(userData);
      
      console.log(`Created user: ${user.prenom} ${user.nom} (${user.email})`);
      createdUsers.push(user);
    } catch (error) {
      console.error(`Error creating user ${userData.email}:`, error);
    }
  }

  return createdUsers;
}

// Create guide profiles
async function createGuideProfiles(users) {
  const guideProfiles = [
    {
      title: 'Guide Expert de Paris',
      description: 'Guide passionné d\'histoire et d\'architecture, je vous ferai découvrir Paris comme vous ne l\'avez jamais vue. Plus de 10 ans d\'expérience.',
      location: 'Paris',
      specialites: JSON.stringify(['Histoire', 'Architecture', 'Gastronomie']),
      langues: JSON.stringify(['Français', 'Anglais', 'Espagnol']),
      price: 75.00
    },
    {
      title: 'Spécialiste de la Côte d\'Azur',
      description: 'Explorez les trésors cachés de la Côte d\'Azur avec une guide locale. Je vous ferai découvrir les plus belles plages et les villages pittoresques.',
      location: 'Nice',
      specialites: JSON.stringify(['Plages', 'Villages', 'Culture locale']),
      langues: JSON.stringify(['Français', 'Anglais', 'Italien']),
      price: 85.00
    },
    {
      title: 'Guide Aventure en Montagne',
      description: 'Passionné de montagne et d\'alpinisme, je vous emmène découvrir les plus beaux sommets des Alpes françaises. Des randonnées adaptées à tous les niveaux.',
      location: 'Chamonix',
      specialites: JSON.stringify(['Randonnée', 'Alpinisme', 'Nature']),
      langues: JSON.stringify(['Français', 'Anglais', 'Allemand']),
      price: 95.00
    },
    {
      title: 'Guide Gastronomique de Lyon',
      description: 'Une immersion dans la capitale gastronomique française. Découvrez les bouchons lyonnais, les marchés locaux et les secrets culinaires de Lyon.',
      location: 'Lyon',
      specialites: JSON.stringify(['Gastronomie', 'Vins', 'Marchés']),
      langues: JSON.stringify(['Français', 'Anglais']),
      price: 65.00
    }
  ];

  const createdGuides = [];

  for (let i = 0; i < users.length; i++) {
    try {
      // Check if guide profile already exists for this user
      const existingGuide = await Guide.findOne({ where: { user_id: users[i].user_id } });
      
      if (existingGuide) {
        console.log(`Guide profile for ${users[i].email} already exists, skipping creation.`);
        createdGuides.push(existingGuide);
        continue;
      }

      const guide = await Guide.create({
        ...guideProfiles[i],
        user_id: users[i].user_id
      });
      
      console.log(`Created guide profile for: ${users[i].prenom} ${users[i].nom}`);
      createdGuides.push(guide);
    } catch (error) {
      console.error(`Error creating guide profile for ${users[i].email}:`, error);
    }
  }

  return createdGuides;
}

// Create tours for each guide
async function createTours(guides) {
  const tourTemplates = [
    // Paris tours (for guide 0)
    [
      {
        title: 'Visite des Chefs-d\'œuvre du Louvre',
        description: 'Découvrez les plus célèbres œuvres d\'art du musée du Louvre lors d\'une visite guidée de 3 heures. De la Joconde aux antiquités égyptiennes, explorez les trésors de ce musée emblématique avec un guide expert.',
        location: 'Paris, Musée du Louvre',
        duration: 3,
        price: 60.00,
        maxParticipants: 8,
        date: '2025-05-15',
        meetingPoint: 'Entrée principale du Louvre, sous la pyramide',
        included: 'Billets d\'entrée, guide professionnel, écouteurs pour bien entendre le guide',
        notIncluded: 'Transport jusqu\'au musée, nourriture et boissons',
        requirements: 'Prévoir des chaussures confortables, une bouteille d\'eau',
        status: 'published'
      },
      {
        title: 'Paris by Night: Croisière sur la Seine',
        description: 'Vivez la magie de Paris illuminée lors d\'une croisière nocturne. Admirez les monuments parisiens depuis la Seine et profitez d\'un dîner gastronomique à bord.',
        location: 'Paris, Port de la Conférence',
        duration: 2.5,
        price: 85.00,
        maxParticipants: 12,
        date: '2025-05-20',
        meetingPoint: 'Port de la Conférence, près du Pont de l\'Alma',
        included: 'Croisière, dîner 3 plats, vin, commentaires guidés',
        notIncluded: 'Transport jusqu\'au point de départ, service de photos',
        requirements: 'Tenue élégante recommandée',
        status: 'published'
      }
    ],
    // Nice tours (for guide 1)
    [
      {
        title: 'Découverte de Nice et du Marché aux Fleurs',
        description: 'Explorez le charme méditerranéen de Nice à travers ses ruelles colorées du Vieux Nice et son célèbre marché aux fleurs. Terminez par une dégustation de spécialités niçoises.',
        location: 'Nice, Vieux Nice',
        duration: 3,
        price: 50.00,
        maxParticipants: 10,
        date: '2025-06-05',
        meetingPoint: 'Place Masséna, devant la fontaine du Soleil',
        included: 'Guide local, dégustations alimentaires, bouteille d\'eau',
        notIncluded: 'Transport, achats personnels',
        requirements: 'Chapeau et crème solaire en été',
        status: 'published'
      },
      {
        title: 'Excursion à Monaco et Monte-Carlo',
        description: 'Partez à la découverte de la principauté de Monaco. Visitez le fameux Casino de Monte-Carlo, admirez les yachts luxueux dans le port et explorez le Palais Princier.',
        location: 'Monaco (départ de Nice)',
        duration: 6,
        price: 120.00,
        maxParticipants: 8,
        date: '2025-06-10',
        meetingPoint: 'Gare de Nice Ville',
        included: 'Transport en minibus climatisé, guide, entrée au Palais Princier',
        notIncluded: 'Déjeuner, entrée au Casino, dépenses personnelles',
        requirements: 'Passeport ou carte d\'identité, tenue correcte pour le Casino',
        status: 'published'
      }
    ],
    // Chamonix tours (for guide 2)
    [
      {
        title: 'Randonnée panoramique du Mont-Blanc',
        description: 'Partez pour une randonnée inoubliable avec des vues spectaculaires sur le Mont-Blanc. Parcourez les sentiers alpins et découvrez la flore locale avec un guide expérimenté.',
        location: 'Chamonix, Aiguille du Midi',
        duration: 5,
        price: 75.00,
        maxParticipants: 6,
        date: '2025-07-12',
        meetingPoint: 'Office du tourisme de Chamonix',
        included: 'Guide de montagne, équipement de sécurité, snacks énergétiques',
        notIncluded: 'Remontées mécaniques, déjeuner, assurance personnelle',
        requirements: 'Bonne condition physique, chaussures de randonnée, vêtements chauds',
        status: 'published'
      },
      {
        title: 'Découverte de la Mer de Glace',
        description: 'Explorez le plus grand glacier de France. Montée en train panoramique, visite de la grotte de glace et explications sur l\'évolution des glaciers face au changement climatique.',
        location: 'Chamonix, Montenvers',
        duration: 4,
        price: 65.00,
        maxParticipants: 10,
        date: '2025-07-15',
        meetingPoint: 'Gare du Montenvers, Chamonix',
        included: 'Billet pour le train du Montenvers, entrée à la grotte de glace, guide',
        notIncluded: 'Transport jusqu\'à Chamonix, repas',
        requirements: 'Vêtements chauds, chaussures antidérapantes',
        status: 'published'
      }
    ],
    // Lyon tours (for guide 3)
    [
      {
        title: 'Tour Gastronomique des Bouchons Lyonnais',
        description: 'Immergez-vous dans la capitale gastronomique française à travers ses célèbres bouchons. Dégustez des plats traditionnels lyonnais et découvrez l\'histoire culinaire de la ville.',
        location: 'Lyon, Vieux Lyon',
        duration: 4,
        price: 85.00,
        maxParticipants: 8,
        date: '2025-05-25',
        meetingPoint: 'Place Saint-Jean, devant la cathédrale',
        included: 'Dégustations dans 3 bouchons différents, vin local, guide expert en gastronomie',
        notIncluded: 'Transport, pourboires',
        requirements: 'Informer à l\'avance des restrictions alimentaires',
        status: 'published'
      },
      {
        title: 'Visite des Traboules et de la Croix-Rousse',
        description: 'Explorez les passages secrets de Lyon et l\'histoire des canuts dans le quartier de la Croix-Rousse. Découvrez comment la soie a façonné l\'architecture et l\'identité de Lyon.',
        location: 'Lyon, La Croix-Rousse',
        duration: 3,
        price: 45.00,
        maxParticipants: 10,
        date: '2025-05-30',
        meetingPoint: 'Place des Terreaux, devant la fontaine Bartholdi',
        included: 'Guide local, visite d\'un atelier de soierie',
        notIncluded: 'Transport, repas, achats personnels',
        requirements: 'Chaussures confortables pour la montée des pentes',
        status: 'published'
      }
    ]
  ];

  const createdTours = [];

  for (let i = 0; i < guides.length; i++) {
    const guideId = guides[i].guide_id;
    const toursForGuide = tourTemplates[i];

    for (const tourData of toursForGuide) {
      try {
        // Check if similar tour already exists
        const existingTour = await Tour.findOne({ 
          where: { 
            guide_id: guideId,
            title: tourData.title
          } 
        });
        
        if (existingTour) {
          console.log(`Tour "${tourData.title}" already exists for guide ${guideId}, skipping creation.`);
          createdTours.push(existingTour);
          continue;
        }

        const tour = await Tour.create({
          ...tourData,
          guide_id: guideId
        });
        
        console.log(`Created tour: ${tour.title} for guide ${guideId}`);
        createdTours.push(tour);
      } catch (error) {
        console.error(`Error creating tour "${tourData.title}" for guide ${guideId}:`, error);
      }
    }
  }

  return createdTours;
}

// Main function to run the script
async function main() {
  try {
    await testConnection();
    
    console.log('==== Creating Guide Users ====');
    const users = await createGuideUsers();
    
    console.log('==== Creating Guide Profiles ====');
    const guides = await createGuideProfiles(users);
    
    console.log('==== Creating Tours ====');
    const tours = await createTours(guides);
    
    console.log('==== Summary ====');
    console.log(`Created ${users.length} guide users`);
    console.log(`Created ${guides.length} guide profiles`);
    console.log(`Created ${tours.length} tours`);
    
    console.log('Data population completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error in main execution:', error);
    process.exit(1);
  }
}

// Run the script
main();