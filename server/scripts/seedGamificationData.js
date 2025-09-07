const mongoose = require('mongoose');
require('dotenv').config();

const { Badge } = require('../models/Badge');
const { RealWorldTask } = require('../models/RealWorldTask');
const { Competition } = require('../models/Competition');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedBadges = async () => {
  const badges = [
    // Learning Badges
    {
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '👶',
      category: 'lesson',
      criteria: [{ type: 'lessons_completed', value: 1 }],
      rarity: 'common',
      points: 10
    },
    {
      name: 'Knowledge Seeker',
      description: 'Complete 5 lessons',
      icon: '📚',
      category: 'lesson',
      criteria: [{ type: 'lessons_completed', value: 5 }],
      rarity: 'common',
      points: 25
    },
    {
      name: 'Eco Scholar',
      description: 'Complete 15 lessons',
      icon: '🎓',
      category: 'lesson',
      criteria: [{ type: 'lessons_completed', value: 15 }],
      rarity: 'rare',
      points: 50
    },

    // Task Badges
    {
      name: 'Action Taker',
      description: 'Complete your first real-world task',
      icon: '🌱',
      category: 'task',
      criteria: [{ type: 'tasks_completed', value: 1 }],
      rarity: 'common',
      points: 20
    },
    {
      name: 'Eco Warrior',
      description: 'Complete 10 real-world tasks',
      icon: '⚔️',
      category: 'task',
      criteria: [{ type: 'tasks_completed', value: 10 }],
      rarity: 'rare',
      points: 100
    },
    {
      name: 'Planet Guardian',
      description: 'Complete 25 real-world tasks',
      icon: '🛡️',
      category: 'task',
      criteria: [{ type: 'tasks_completed', value: 25 }],
      rarity: 'epic',
      points: 200
    },

    // Streak Badges
    {
      name: 'Consistent Learner',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      category: 'streak',
      criteria: [{ type: 'streak_days', value: 7 }],
      rarity: 'common',
      points: 30
    },
    {
      name: 'Dedication Master',
      description: 'Maintain a 30-day learning streak',
      icon: '💪',
      category: 'streak',
      criteria: [{ type: 'streak_days', value: 30 }],
      rarity: 'epic',
      points: 150
    },

    // Impact Badges
    {
      name: 'Tree Planter',
      description: 'Plant 10 trees through tasks',
      icon: '🌳',
      category: 'impact',
      criteria: [{ type: 'trees_planted', value: 10 }],
      rarity: 'rare',
      points: 75
    },
    {
      name: 'Waste Warrior',
      description: 'Collect 50kg of waste',
      icon: '♻️',
      category: 'impact',
      criteria: [{ type: 'waste_collected', value: 50 }],
      rarity: 'rare',
      points: 75
    },
    {
      name: 'Energy Saver',
      description: 'Save 100kWh of energy',
      icon: '⚡',
      category: 'impact',
      criteria: [{ type: 'energy_saved', value: 100 }],
      rarity: 'epic',
      points: 125
    },

    // Points Badges
    {
      name: 'Point Collector',
      description: 'Earn 500 total points',
      icon: '💎',
      category: 'special',
      criteria: [{ type: 'points_earned', value: 500 }],
      rarity: 'rare',
      points: 50
    },
    {
      name: 'Eco Champion',
      description: 'Earn 1000 eco points',
      icon: '🏆',
      category: 'special',
      criteria: [{ type: 'eco_points_earned', value: 1000 }],
      rarity: 'epic',
      points: 100
    }
  ];

  await Badge.deleteMany({});
  await Badge.insertMany(badges);
  console.log('✅ Badges seeded successfully');
};

const seedEnhancedTasks = async () => {
  const tasks = [
    {
      title: 'Plant a Tree',
      description: 'Plant a tree in your community and document its growth',
      category: 'planting',
      difficulty: 'easy',
      points: 50,
      ecoPoints: 100,
      impactMetrics: { treesPlanted: 1, carbonReduced: 22 },
      verificationRequired: true,
      photoRequired: true,
      locationRequired: true,
      badge: {
        name: 'Tree Planter',
        icon: '🌳',
        description: 'Planted a tree for the environment',
        rarity: 'common'
      },
      requirements: [
        'Choose appropriate location',
        'Use native species if possible',
        'Take before and after photos',
        'Record GPS location'
      ],
      estimatedTime: 60,
      verificationInstructions: 'Show clear photos of planting process and final result'
    },
    {
      title: 'Beach/Park Cleanup',
      description: 'Organize or participate in a local cleanup drive',
      category: 'cleaning',
      difficulty: 'medium',
      points: 75,
      ecoPoints: 150,
      impactMetrics: { wasteCollected: 5 },
      verificationRequired: true,
      photoRequired: true,
      badge: {
        name: 'Cleanup Hero',
        icon: '🧹',
        description: 'Made the environment cleaner',
        rarity: 'common'
      },
      requirements: [
        'Collect at least 5kg of waste',
        'Separate recyclables',
        'Document before/after state',
        'Involve at least 2 people'
      ],
      estimatedTime: 120
    },
    {
      title: 'Start Composting',
      description: 'Set up a composting system at home',
      category: 'recycling',
      difficulty: 'medium',
      points: 60,
      ecoPoints: 120,
      impactMetrics: { wasteCollected: 2, carbonReduced: 5 },
      verificationRequired: true,
      photoRequired: true,
      badge: {
        name: 'Compost Master',
        icon: '🌱',
        description: 'Turned waste into valuable compost',
        rarity: 'rare'
      },
      requirements: [
        'Set up proper composting bin',
        'Add organic waste regularly',
        'Monitor temperature and moisture',
        'Document process over 2 weeks'
      ],
      estimatedTime: 30
    },
    {
      title: 'Energy Audit',
      description: 'Conduct an energy audit of your home/school',
      category: 'energy',
      difficulty: 'hard',
      points: 100,
      ecoPoints: 200,
      impactMetrics: { energySaved: 50 },
      verificationRequired: true,
      photoRequired: true,
      badge: {
        name: 'Energy Detective',
        icon: '🔍',
        description: 'Identified energy saving opportunities',
        rarity: 'epic'
      },
      requirements: [
        'Check all electrical appliances',
        'Measure energy consumption',
        'Identify improvement areas',
        'Create action plan',
        'Implement at least 3 changes'
      ],
      estimatedTime: 180
    },
    {
      title: 'Water Conservation',
      description: 'Implement water-saving measures at home',
      category: 'water',
      difficulty: 'easy',
      points: 40,
      ecoPoints: 80,
      impactMetrics: { energySaved: 20 },
      verificationRequired: false,
      photoRequired: true,
      badge: {
        name: 'Water Guardian',
        icon: '💧',
        description: 'Protected our precious water resources',
        rarity: 'common'
      },
      requirements: [
        'Install water-saving devices',
        'Fix any leaks',
        'Monitor water usage',
        'Document savings'
      ],
      estimatedTime: 45
    }
  ];

  await RealWorldTask.deleteMany({});
  await RealWorldTask.insertMany(tasks);
  console.log('✅ Enhanced tasks seeded successfully');
};

const seedCompetitions = async () => {
  const competitions = [
    {
      title: 'Green Schools Challenge 2024',
      description: 'Inter-school environmental competition focusing on sustainability practices and real-world impact',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-03-31'),
      type: 'school',
      category: 'general',
      rules: [
        'All activities must be verified with photos',
        'Points are awarded based on environmental impact',
        'Schools compete based on total student participation',
        'Fair play and honesty are essential'
      ],
      pointsMultiplier: 1.5,
      allowedActivities: ['lessons', 'tasks', 'quizzes'],
      prizes: [
        {
          category: 'school',
          position: 1,
          title: 'Champion School',
          description: 'Trophy and ₹50,000 for environmental projects',
          badge: {
            name: 'School Champion',
            icon: '🏆',
            rarity: 'legendary'
          }
        },
        {
          category: 'individual',
          position: 1,
          title: 'Eco Champion',
          description: 'Certificate and eco-friendly prize package',
          badge: {
            name: 'Individual Champion',
            icon: '🥇',
            rarity: 'epic'
          }
        }
      ],
      isPublic: true,
      bannerImage: '/images/green-challenge-banner.jpg'
    },
    {
      title: 'Earth Day Special',
      description: 'Special Earth Day competition focusing on tree planting and waste reduction',
      startDate: new Date('2024-04-15'),
      endDate: new Date('2024-04-30'),
      type: 'individual',
      category: 'planting',
      rules: [
        'Focus on tree planting and waste collection',
        'Document all activities with photos',
        'Encourage community involvement'
      ],
      pointsMultiplier: 2.0,
      allowedActivities: ['tasks'],
      prizes: [
        {
          category: 'individual',
          position: 1,
          title: 'Earth Day Hero',
          description: 'Special recognition and eco-friendly gifts',
          badge: {
            name: 'Earth Day Hero',
            icon: '🌍',
            rarity: 'legendary'
          }
        }
      ],
      isSeasonalEvent: true,
      isPublic: true
    }
  ];

  await Competition.deleteMany({});
  await Competition.insertMany(competitions);
  console.log('✅ Competitions seeded successfully');
};

const seedAll = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Seeding gamification data...');
    await seedBadges();
    await seedEnhancedTasks();
    await seedCompetitions();
    
    console.log('✅ All gamification data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedAll();