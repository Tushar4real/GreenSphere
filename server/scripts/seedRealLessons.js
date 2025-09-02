const mongoose = require('mongoose');
const Lesson = require('./models/Lesson');
require('dotenv').config();

const realLessons = [
  // Climate Change Topic
  {
    title: "Understanding Climate Change",
    description: "Learn about the science behind climate change, its causes, and global impacts on our planet.",
    category: "climate",
    difficulty: "beginner",
    estimatedTime: 15,
    slides: [
      {
        title: "What is Climate Change?",
        content: "Climate change refers to long-term shifts in global temperatures and weather patterns. While climate variations are natural, human activities have been the main driver of climate change since the 1800s, primarily through burning fossil fuels like coal, oil, and gas.",
        imageUrl: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=800&h=400&fit=crop",
        quiz: {
          question: "What has been the main driver of climate change since the 1800s?",
          options: ["Natural variations", "Human activities", "Solar radiation", "Ocean currents"],
          correctAnswer: 1,
          points: 10
        }
      },
      {
        title: "The Greenhouse Effect",
        content: "The greenhouse effect is a natural process where certain gases in Earth's atmosphere trap heat from the sun. However, human activities have increased concentrations of these greenhouse gases, intensifying the effect and causing global warming.",
        imageUrl: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=400&fit=crop",
        quiz: {
          question: "Which gas is the most significant greenhouse gas produced by human activities?",
          options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
          correctAnswer: 2,
          points: 10
        }
      },
      {
        title: "Climate Change Impacts",
        content: "Climate change affects every aspect of our planet: rising sea levels, extreme weather events, changing precipitation patterns, ecosystem disruption, and threats to food security. These impacts disproportionately affect vulnerable communities worldwide.",
        imageUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=400&fit=crop",
        quiz: {
          question: "Which of the following is NOT a direct impact of climate change?",
          options: ["Rising sea levels", "Extreme weather events", "Increased biodiversity", "Food security threats"],
          correctAnswer: 2,
          points: 15
        }
      }
    ],
    totalPoints: 35,
    order: 1
  },
  {
    title: "Climate Solutions and Mitigation",
    description: "Explore practical solutions to combat climate change, from renewable energy to individual actions.",
    category: "climate",
    difficulty: "intermediate",
    estimatedTime: 20,
    slides: [
      {
        title: "Renewable Energy Revolution",
        content: "Transitioning from fossil fuels to renewable energy sources like solar, wind, and hydroelectric power is crucial for reducing greenhouse gas emissions. These technologies have become increasingly affordable and efficient.",
        imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=400&fit=crop",
        quiz: {
          question: "Which renewable energy source has seen the fastest cost reduction in recent years?",
          options: ["Hydroelectric", "Solar", "Wind", "Geothermal"],
          correctAnswer: 1,
          points: 10
        }
      },
      {
        title: "Carbon Capture and Storage",
        content: "Carbon capture and storage (CCS) technologies can capture CO2 emissions from industrial processes and power plants, then store them underground or use them to create useful products.",
        imageUrl: "https://images.unsplash.com/photo-1497436072909-f5e4be1dffea?w=800&h=400&fit=crop",
        quiz: {
          question: "What does CCS stand for?",
          options: ["Carbon Control System", "Climate Change Solution", "Carbon Capture and Storage", "Clean Coal Standard"],
          correctAnswer: 2,
          points: 10
        }
      }
    ],
    totalPoints: 20,
    order: 2
  },

  // Renewable Energy Topic
  {
    title: "Solar Energy Fundamentals",
    description: "Discover how solar energy works, its benefits, and applications in our daily lives.",
    category: "energy",
    difficulty: "beginner",
    estimatedTime: 18,
    slides: [
      {
        title: "How Solar Panels Work",
        content: "Solar panels convert sunlight into electricity using photovoltaic cells. When sunlight hits these cells, it knocks electrons loose, creating an electric current that can power homes and businesses.",
        imageUrl: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&h=400&fit=crop",
        quiz: {
          question: "What technology do solar panels use to convert sunlight into electricity?",
          options: ["Thermal conversion", "Photovoltaic cells", "Wind turbines", "Hydroelectric generators"],
          correctAnswer: 1,
          points: 10
        }
      },
      {
        title: "Benefits of Solar Energy",
        content: "Solar energy is clean, renewable, and increasingly affordable. It reduces electricity bills, decreases carbon footprint, and provides energy independence. Solar installations also create jobs and stimulate economic growth.",
        imageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=400&fit=crop",
        quiz: {
          question: "Which is NOT a benefit of solar energy?",
          options: ["Reduces electricity bills", "Creates air pollution", "Provides energy independence", "Creates jobs"],
          correctAnswer: 1,
          points: 10
        }
      }
    ],
    totalPoints: 20,
    order: 3
  },
  {
    title: "Wind Energy Systems",
    description: "Learn about wind energy technology, its advantages, and role in sustainable power generation.",
    category: "energy",
    difficulty: "intermediate",
    estimatedTime: 16,
    slides: [
      {
        title: "Wind Turbine Technology",
        content: "Modern wind turbines convert kinetic energy from moving air into electrical energy. They consist of rotor blades, a nacelle containing the generator, and a tower. Wind farms can be located on land or offshore.",
        imageUrl: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800&h=400&fit=crop",
        quiz: {
          question: "What type of energy do wind turbines convert into electricity?",
          options: ["Potential energy", "Thermal energy", "Kinetic energy", "Chemical energy"],
          correctAnswer: 2,
          points: 10
        }
      },
      {
        title: "Wind Energy Advantages",
        content: "Wind energy is one of the fastest-growing renewable energy sources. It produces no emissions during operation, has low operating costs, and can coexist with agriculture. Offshore wind farms have even greater potential.",
        imageUrl: "https://images.unsplash.com/photo-1548337138-e87d889cc369?w=800&h=400&fit=crop",
        quiz: {
          question: "Where can wind farms be located?",
          options: ["Only on land", "Only offshore", "Both land and offshore", "Only in deserts"],
          correctAnswer: 2,
          points: 10
        }
      }
    ],
    totalPoints: 20,
    order: 4
  },

  // Biodiversity Topic
  {
    title: "Biodiversity and Ecosystems",
    description: "Understand the importance of biodiversity and how ecosystems support all life on Earth.",
    category: "biodiversity",
    difficulty: "beginner",
    estimatedTime: 22,
    slides: [
      {
        title: "What is Biodiversity?",
        content: "Biodiversity encompasses the variety of life on Earth at all levels: genetic diversity within species, species diversity within ecosystems, and ecosystem diversity across landscapes. This diversity is essential for ecosystem stability and resilience.",
        imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop",
        quiz: {
          question: "How many levels of biodiversity are there?",
          options: ["Two", "Three", "Four", "Five"],
          correctAnswer: 1,
          points: 10
        }
      },
      {
        title: "Ecosystem Services",
        content: "Ecosystems provide essential services: provisioning services (food, water, timber), regulating services (climate regulation, water purification), cultural services (recreation, spiritual values), and supporting services (nutrient cycling, oxygen production).",
        imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=400&fit=crop",
        quiz: {
          question: "Which is an example of a regulating ecosystem service?",
          options: ["Food production", "Water purification", "Timber harvesting", "Recreation"],
          correctAnswer: 1,
          points: 10
        }
      },
      {
        title: "Threats to Biodiversity",
        content: "Major threats include habitat destruction, climate change, pollution, overexploitation, and invasive species. These threats are interconnected and often amplify each other's effects, leading to accelerated biodiversity loss.",
        imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop",
        quiz: {
          question: "Which is the primary threat to biodiversity globally?",
          options: ["Climate change", "Habitat destruction", "Pollution", "Invasive species"],
          correctAnswer: 1,
          points: 15
        }
      }
    ],
    totalPoints: 35,
    order: 5
  },
  {
    title: "Conservation Strategies",
    description: "Explore effective strategies for protecting and restoring biodiversity and ecosystems.",
    category: "biodiversity",
    difficulty: "intermediate",
    estimatedTime: 20,
    slides: [
      {
        title: "Protected Areas",
        content: "Protected areas like national parks, wildlife reserves, and marine protected areas are crucial for conserving biodiversity. They provide safe havens for species and preserve critical habitats and ecological processes.",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
        quiz: {
          question: "What is the primary purpose of protected areas?",
          options: ["Tourism revenue", "Resource extraction", "Biodiversity conservation", "Urban development"],
          correctAnswer: 2,
          points: 10
        }
      },
      {
        title: "Restoration Ecology",
        content: "Ecological restoration involves assisting the recovery of degraded ecosystems. This includes reforestation, wetland restoration, coral reef rehabilitation, and removing invasive species to restore natural balance.",
        imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop",
        quiz: {
          question: "Which activity is part of ecological restoration?",
          options: ["Building more roads", "Removing invasive species", "Increasing pollution", "Expanding cities"],
          correctAnswer: 1,
          points: 10
        }
      }
    ],
    totalPoints: 20,
    order: 6
  },

  // Water Conservation Topic
  {
    title: "Water Conservation Basics",
    description: "Learn about the importance of water conservation and practical ways to save water.",
    category: "water",
    difficulty: "beginner",
    estimatedTime: 14,
    slides: [
      {
        title: "The Water Crisis",
        content: "Despite Earth being covered by water, only 2.5% is freshwater, and less than 1% is accessible for human use. Growing populations, climate change, and pollution are creating water scarcity in many regions worldwide.",
        imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop",
        quiz: {
          question: "What percentage of Earth's water is accessible freshwater for human use?",
          options: ["Less than 1%", "2.5%", "10%", "25%"],
          correctAnswer: 0,
          points: 10
        }
      },
      {
        title: "Water Conservation Methods",
        content: "Simple actions can save significant amounts of water: fixing leaks, using water-efficient appliances, collecting rainwater, practicing xeriscaping (drought-resistant landscaping), and being mindful of daily water use.",
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop",
        quiz: {
          question: "What is xeriscaping?",
          options: ["Water recycling", "Drought-resistant landscaping", "Water filtration", "Irrigation systems"],
          correctAnswer: 1,
          points: 10
        }
      }
    ],
    totalPoints: 20,
    order: 7
  },
  {
    title: "Advanced Water Management",
    description: "Explore innovative technologies and systems for sustainable water management.",
    category: "water",
    difficulty: "intermediate",
    estimatedTime: 18,
    slides: [
      {
        title: "Rainwater Harvesting",
        content: "Rainwater harvesting systems collect and store rainwater for later use. This reduces demand on municipal water supplies, prevents flooding, and provides a sustainable water source for irrigation and non-potable uses.",
        imageUrl: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&h=400&fit=crop",
        quiz: {
          question: "What is a benefit of rainwater harvesting?",
          options: ["Increases water bills", "Reduces municipal water demand", "Creates more pollution", "Wastes energy"],
          correctAnswer: 1,
          points: 10
        }
      },
      {
        title: "Water Recycling and Reuse",
        content: "Greywater systems reuse water from sinks, showers, and washing machines for irrigation. Advanced treatment technologies can even purify wastewater to drinking water standards, creating a circular water economy.",
        imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=400&fit=crop",
        quiz: {
          question: "What is greywater?",
          options: ["Polluted river water", "Water from sinks and showers", "Drinking water", "Ocean water"],
          correctAnswer: 1,
          points: 10
        }
      }
    ],
    totalPoints: 20,
    order: 8
  }
];

const seedRealLessons = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greensphere');
    console.log('Connected to MongoDB');

    // Clear existing lessons
    await Lesson.deleteMany({});
    console.log('Cleared existing lessons');

    // Insert real lessons
    await Lesson.insertMany(realLessons);
    console.log(`Inserted ${realLessons.length} real lessons`);

    console.log('Real lessons seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding real lessons:', error);
    process.exit(1);
  }
};

seedRealLessons();