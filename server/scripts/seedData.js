const mongoose = require('mongoose');
const Lesson = require('./models/Lesson');
const Quiz = require('./models/Quiz');
const Task = require('./models/Task');
const Badge = require('./models/Badge');
const UserProgress = require('./models/UserProgress');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greensphere');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Lesson.deleteMany({}),
      Quiz.deleteMany({}),
      Task.deleteMany({}),
      Badge.deleteMany({})
    ]);

    // Seed Lessons
    const lessons = [
      {
        title: "Climate Change Basics",
        description: "Understanding the fundamentals of climate change and its global impact",
        category: "climate",
        difficulty: "beginner",
        estimatedTime: 15,
        slides: [
          {
            title: "What is Climate Change?",
            content: "Climate change refers to long-term shifts in global temperatures and weather patterns. While climate variations are natural, human activities have been the main driver since the 1800s.",
            imageUrl: "/images/climate-change-intro.jpg",
            quiz: {
              question: "What is the main driver of climate change since the 1800s?",
              options: ["Natural variations", "Human activities", "Solar radiation", "Ocean currents"],
              correctAnswer: 1,
              points: 10
            }
          },
          {
            title: "Greenhouse Effect",
            content: "The greenhouse effect is a natural process where certain gases trap heat in Earth's atmosphere. However, human activities have increased these gases, intensifying the effect.",
            imageUrl: "/images/greenhouse-effect.jpg",
            quiz: {
              question: "Which gas is the most significant greenhouse gas produced by human activities?",
              options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
              correctAnswer: 2,
              points: 10
            }
          }
        ],
        totalPoints: 20,
        order: 1
      },
      {
        title: "Renewable Energy Sources",
        description: "Explore clean energy alternatives that can help reduce carbon emissions",
        category: "energy",
        difficulty: "beginner",
        estimatedTime: 20,
        slides: [
          {
            title: "Solar Power",
            content: "Solar energy harnesses sunlight using photovoltaic cells or solar thermal systems. It's one of the fastest-growing renewable energy sources worldwide.",
            imageUrl: "/images/solar-power.jpg",
            quiz: {
              question: "What technology is used to convert sunlight directly into electricity?",
              options: ["Solar thermal", "Photovoltaic cells", "Wind turbines", "Hydroelectric"],
              correctAnswer: 1,
              points: 10
            }
          },
          {
            title: "Wind Energy",
            content: "Wind turbines convert kinetic energy from moving air into electrical energy. Wind farms can be located on land or offshore.",
            imageUrl: "/images/wind-energy.jpg",
            quiz: {
              question: "Where can wind farms be located?",
              options: ["Only on land", "Only offshore", "Both land and offshore", "Only in deserts"],
              correctAnswer: 2,
              points: 10
            }
          }
        ],
        totalPoints: 20,
        order: 2
      },
      {
        title: "Biodiversity Conservation",
        description: "Learn about protecting Earth's diverse ecosystems and species",
        category: "biodiversity",
        difficulty: "intermediate",
        estimatedTime: 25,
        slides: [
          {
            title: "What is Biodiversity?",
            content: "Biodiversity encompasses the variety of life on Earth, including genetic diversity, species diversity, and ecosystem diversity. It's crucial for ecosystem stability.",
            imageUrl: "/images/biodiversity.jpg",
            quiz: {
              question: "How many levels of biodiversity are there?",
              options: ["Two", "Three", "Four", "Five"],
              correctAnswer: 1,
              points: 15
            }
          }
        ],
        totalPoints: 15,
        order: 3
      }
    ];

    await Lesson.insertMany(lessons);
    console.log('Lessons seeded successfully');

    // Seed Quizzes
    const quizzes = [
      {
        title: "Environmental Awareness Quiz",
        description: "Test your knowledge about environmental issues and solutions",
        category: "sustainability",
        difficulty: "easy",
        timeLimit: 300,
        questions: [
          {
            question: "Which of the following is a renewable energy source?",
            type: "multiple-choice",
            options: ["Coal", "Solar", "Natural Gas", "Oil"],
            correctAnswer: 1,
            points: 10,
            explanation: "Solar energy is renewable because it comes from the sun, which is an inexhaustible source."
          },
          {
            question: "Recycling helps reduce waste and conserve natural resources.",
            type: "true-false",
            options: ["True", "False"],
            correctAnswer: 0,
            points: 10,
            explanation: "Recycling reduces the need for raw materials and decreases landfill waste."
          },
          {
            question: "You find a plastic bottle on the beach. What's the best action?",
            type: "scenario",
            options: ["Leave it there", "Pick it up and recycle it", "Bury it in sand", "Throw it in the ocean"],
            correctAnswer: 1,
            points: 15,
            explanation: "Picking up litter and properly recycling it helps protect marine life and keeps beaches clean."
          }
        ],
        totalPoints: 35,
        order: 1
      },
      {
        title: "Climate Action Challenge",
        description: "Advanced quiz on climate change mitigation strategies",
        category: "climate",
        difficulty: "medium",
        timeLimit: 450,
        questions: [
          {
            question: "What is the Paris Agreement's main goal?",
            type: "multiple-choice",
            options: [
              "Eliminate all fossil fuels by 2030",
              "Limit global warming to well below 2°C",
              "Plant 1 billion trees worldwide",
              "Ban single-use plastics globally"
            ],
            correctAnswer: 1,
            points: 20,
            explanation: "The Paris Agreement aims to limit global warming to well below 2°C above pre-industrial levels."
          },
          {
            question: "Carbon footprint refers only to CO2 emissions from transportation.",
            type: "true-false",
            options: ["True", "False"],
            correctAnswer: 1,
            points: 15,
            explanation: "Carbon footprint includes all greenhouse gas emissions from various activities, not just transportation."
          }
        ],
        totalPoints: 35,
        order: 2
      }
    ];

    await Quiz.insertMany(quizzes);
    console.log('Quizzes seeded successfully');

    // Seed Tasks
    const tasks = [
      {
        title: "Plant a Tree",
        description: "Plant a tree in your garden, school, or community area. Take a photo with the planted sapling.",
        category: "nature",
        points: 50,
        difficulty: "easy",
        requiresProof: true,
        proofType: "photo"
      },
      {
        title: "Plastic-Free Day",
        description: "Spend an entire day without using any single-use plastic items. Document your alternatives.",
        category: "waste",
        points: 30,
        difficulty: "medium",
        requiresProof: true,
        proofType: "photo"
      },
      {
        title: "Energy Audit",
        description: "Conduct an energy audit of your home. List 5 ways to reduce energy consumption.",
        category: "energy",
        points: 40,
        difficulty: "medium",
        requiresProof: true,
        proofType: "text"
      },
      {
        title: "Water Conservation",
        description: "Implement water-saving measures at home for a week. Track your water usage reduction.",
        category: "water",
        points: 35,
        difficulty: "easy",
        requiresProof: true,
        proofType: "photo"
      },
      {
        title: "Eco-Friendly Transportation",
        description: "Use only eco-friendly transportation (walking, cycling, public transport) for 3 days.",
        category: "transport",
        points: 45,
        difficulty: "medium",
        requiresProof: true,
        proofType: "photo"
      },
      {
        title: "Community Clean-Up",
        description: "Organize or participate in a community clean-up drive. Document the before and after.",
        category: "waste",
        points: 60,
        difficulty: "hard",
        requiresProof: true,
        proofType: "photo"
      }
    ];

    await Task.insertMany(tasks);
    console.log('Tasks seeded successfully');

    // Seed Badges
    const badges = [
      {
        name: "First Steps",
        description: "Complete your first eco-task",
        icon: "🌱",
        color: "#28A745",
        category: "task",
        criteria: {
          type: "tasks_completed",
          value: 1,
          description: "Complete 1 task"
        },
        rarity: "common",
        order: 1
      },
      {
        name: "Task Master",
        description: "Complete 5 eco-tasks",
        icon: "🎯",
        color: "#20C997",
        category: "task",
        criteria: {
          type: "tasks_completed",
          value: 5,
          description: "Complete 5 tasks"
        },
        rarity: "rare",
        order: 2
      },
      {
        name: "Quiz Whiz",
        description: "Score 100% on any quiz",
        icon: "🧠",
        color: "#FFC107",
        category: "quiz",
        criteria: {
          type: "perfect_quiz",
          value: 1,
          description: "Score 100% on a quiz"
        },
        rarity: "rare",
        order: 3
      },
      {
        name: "Point Collector",
        description: "Earn 100 points",
        icon: "💎",
        color: "#6F42C1",
        category: "special",
        criteria: {
          type: "points_earned",
          value: 100,
          description: "Earn 100 total points"
        },
        rarity: "epic",
        order: 4
      },
      {
        name: "Eco Warrior",
        description: "Reach Planet Saver level",
        icon: "🌍",
        color: "#FD7E14",
        category: "special",
        criteria: {
          type: "points_earned",
          value: 601,
          description: "Reach Planet Saver level (601+ points)"
        },
        rarity: "legendary",
        order: 5
      },
      {
        name: "Streak Master",
        description: "Maintain a 7-day activity streak",
        icon: "🔥",
        color: "#DC3545",
        category: "streak",
        criteria: {
          type: "streak_days",
          value: 7,
          description: "Stay active for 7 consecutive days"
        },
        rarity: "epic",
        order: 6
      }
    ];

    await Badge.insertMany(badges);
    console.log('Badges seeded successfully');

    console.log('All demo data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();