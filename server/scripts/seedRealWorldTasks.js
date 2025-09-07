const mongoose = require('mongoose');
const RealWorldTask = require('./models/RealWorldTask');

const realWorldTasks = [
  // Easy Tasks (50-150 Impact Points)
  {
    title: 'Plant 10 Native Saplings',
    description: 'Plant 10 native tree saplings in your local area with proper care plan',
    category: 'planting',
    difficulty: 'easy',
    points: 120,
    badge: {
      name: 'Green Thumb',
      icon: '🌱',
      description: 'Planted your first saplings and started your green journey'
    },
    requirements: [
      'Plant at least 10 native saplings',
      'Create care and watering schedule',
      'Take photos with GPS location',
      'Get permission from landowner if needed'
    ]
  },
  {
    title: 'Community Cleanup Drive',
    description: 'Organize a cleanup drive in your neighborhood involving 10+ people',
    category: 'cleaning',
    difficulty: 'easy',
    points: 100,
    badge: {
      name: 'Park Guardian',
      icon: '🧹',
      description: 'Dedicated to keeping public spaces clean and beautiful'
    },
    requirements: [
      'Organize team of minimum 10 people',
      'Clean for at least 3 hours',
      'Collect and segregate minimum 20kg waste',
      'Document before/after with team photos'
    ]
  },
  {
    title: 'Plastic-Free Week Challenge',
    description: 'Live completely plastic-free for one week and document the journey',
    category: 'conservation',
    difficulty: 'easy',
    points: 80,
    badge: {
      name: 'Plastic Warrior',
      icon: '🚫',
      description: 'Champion of plastic-free living and sustainable alternatives'
    },
    requirements: [
      'Document daily plastic alternatives used',
      'Calculate plastic waste avoided',
      'Share tips with 5+ people',
      'Create video diary of the week'
    ]
  },
  {
    title: 'School Energy Audit',
    description: 'Conduct comprehensive energy audit of your school and present findings',
    category: 'energy',
    difficulty: 'easy',
    points: 90,
    badge: {
      name: 'Energy Detective',
      icon: '🔍',
      description: 'Expert at identifying energy waste and efficiency opportunities'
    },
    requirements: [
      'Audit all major energy consuming areas',
      'Calculate potential savings',
      'Present findings to school administration',
      'Propose 5 actionable improvements'
    ]
  },

  // Medium Tasks (200-400 Impact Points)
  {
    title: 'Establish Community Food Forest',
    description: 'Create a sustainable food forest with 25+ edible plants for community use',
    category: 'planting',
    difficulty: 'medium',
    points: 350,
    badge: {
      name: 'Garden Architect',
      icon: '🏡',
      description: 'Created a thriving community space for sustainable living'
    },
    requirements: [
      'Plant minimum 25 edible/medicinal plants',
      'Involve at least 15 community members',
      'Create maintenance and harvesting plan',
      'Document 6-month growth progress'
    ]
  },
  {
    title: 'River/Lake Restoration Project',
    description: 'Lead restoration of polluted water body with community involvement',
    category: 'cleaning',
    difficulty: 'medium',
    points: 320,
    badge: {
      name: 'Water Protector',
      icon: '🌊',
      description: 'Guardian of our precious water bodies and marine life'
    },
    requirements: [
      'Organize team of minimum 25 people',
      'Remove minimum 100kg of waste',
      'Plant aquatic vegetation',
      'Coordinate with local authorities'
    ]
  },
  {
    title: 'Rainwater Harvesting Network',
    description: 'Install rainwater harvesting systems in 5+ homes/buildings',
    category: 'conservation',
    difficulty: 'medium',
    points: 380,
    badge: {
      name: 'Water Harvester',
      icon: '💧',
      description: 'Master of water conservation and sustainable resource management'
    },
    requirements: [
      'Install systems in minimum 5 locations',
      'Calculate total water saving capacity',
      'Train homeowners on maintenance',
      'Create replication guide for others'
    ]
  },
  {
    title: 'Organic Waste Composting Hub',
    description: 'Set up community composting system processing 50kg+ waste daily',
    category: 'conservation',
    difficulty: 'medium',
    points: 280,
    badge: {
      name: 'Compost Champion',
      icon: '🍂',
      description: 'Transformer of waste into valuable resources for soil health'
    },
    requirements: [
      'Process minimum 50kg organic waste daily',
      'Involve 20+ households',
      'Produce quality compost for distribution',
      'Train community on composting techniques'
    ]
  },
  {
    title: 'Renewable Energy Installation',
    description: 'Install solar/wind energy system for community building',
    category: 'energy',
    difficulty: 'medium',
    points: 400,
    badge: {
      name: 'Energy Pioneer',
      icon: '⚡',
      description: 'Leading the transition to clean, renewable energy sources'
    },
    requirements: [
      'Install minimum 3kW renewable energy system',
      'Calculate carbon footprint reduction',
      'Document energy generation for 3 months',
      'Share knowledge with 10+ people'
    ]
  },

  // Hard Tasks (500-800 Impact Points)
  {
    title: 'Reforest 2 Acres of Degraded Land',
    description: 'Restore degraded ecosystem by planting native forest on 2+ acres',
    category: 'planting',
    difficulty: 'hard',
    points: 700,
    badge: {
      name: 'Forest Regenerator',
      icon: '🌲',
      description: 'Legendary environmental warrior who brings forests back to life'
    },
    requirements: [
      'Plant minimum 500 native trees',
      'Ensure 85% survival rate after 1 year',
      'Create 10-year maintenance plan',
      'Involve local forest department',
      'Document biodiversity recovery'
    ]
  },
  {
    title: 'Community Solar Microgrid',
    description: 'Establish solar microgrid powering 20+ homes or community facility',
    category: 'energy',
    difficulty: 'hard',
    points: 800,
    badge: {
      name: 'Solar Pioneer',
      icon: '☀️',
      description: 'Renewable energy champion powering the future sustainably'
    },
    requirements: [
      'Install minimum 15kW solar capacity',
      'Power 20+ homes or major facility',
      'Calculate annual CO2 reduction',
      'Train 25+ people on renewable energy',
      'Create replication model'
    ]
  },
  {
    title: 'Zero Waste City District',
    description: 'Transform entire city district/ward into zero waste model',
    category: 'conservation',
    difficulty: 'hard',
    points: 650,
    badge: {
      name: 'Waste Warrior',
      icon: '♻️',
      description: 'Ultimate champion of circular economy and zero waste living'
    },
    requirements: [
      'Achieve 95% waste diversion from landfill',
      'Involve minimum 200 households',
      'Set up complete waste processing infrastructure',
      'Train 100+ people as waste ambassadors',
      'Get official recognition from city'
    ]
  },
  {
    title: 'Climate Action Movement',
    description: 'Launch city-wide climate action movement with measurable impact',
    category: 'awareness',
    difficulty: 'hard',
    points: 600,
    badge: {
      name: 'Eco Evangelist',
      icon: '📢',
      description: 'Inspiring voice for environmental change and sustainable future'
    },
    requirements: [
      'Reach minimum 5001 people',
      'Organize 10+ community events',
      'Achieve measurable behavior change',
      'Partner with local government/NGOs',
      'Create lasting institutional change'
    ]
  },
  {
    title: 'Wetland Ecosystem Restoration',
    description: 'Restore degraded wetland ecosystem with native species',
    category: 'conservation',
    difficulty: 'hard',
    points: 750,
    badge: {
      name: 'Ecosystem Guardian',
      icon: '🦆',
      description: 'Protector and restorer of critical ecosystem habitats'
    },
    requirements: [
      'Restore minimum 1 acre wetland area',
      'Plant 100+ native aquatic plants',
      'Document wildlife return over 1 year',
      'Create water quality monitoring system',
      'Involve local conservation groups'
    ]
  },
  {
    title: 'Sustainable Transportation Network',
    description: 'Establish bike-sharing or electric vehicle network in community',
    category: 'energy',
    difficulty: 'hard',
    points: 550,
    badge: {
      name: 'Mobility Revolutionary',
      icon: '🚲',
      description: 'Pioneer of sustainable transportation solutions'
    },
    requirements: [
      'Set up 10+ bike stations or 5+ EV charging points',
      'Register 100+ active users',
      'Calculate emissions reduction',
      'Create maintenance and expansion plan',
      'Partner with local authorities'
    ]
  }
];

// Impact Point Thresholds for Achievement Badges
const impactBadgeThresholds = [
  { points: 500, name: 'Earth Defender', icon: '🛡️', description: 'Committed environmental protector' },
  { points: 1000, name: 'Planet Guardian', icon: '🌍', description: 'Dedicated guardian of our planet' },
  { points: 2000, name: 'Climate Hero', icon: '🦸', description: 'Hero in the fight against climate change' },
  { points: 3500, name: 'Eco Legend', icon: '👑', description: 'Legendary environmental champion' },
  { points: 5001, name: 'Earth Savior', icon: '✨', description: 'Ultimate savior of our planet' }
];

const seedRealWorldTasks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greensphere');
    
    // Clear existing tasks
    await RealWorldTask.deleteMany({});
    
    // Insert new tasks
    await RealWorldTask.insertMany(realWorldTasks);
    
    console.log('Real-world tasks seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding real-world tasks:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedRealWorldTasks();
}

module.exports = { realWorldTasks, seedRealWorldTasks };