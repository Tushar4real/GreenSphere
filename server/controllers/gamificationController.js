const User = require('../models/User');
const Badge = require('../models/Badge');
const UserBadge = require('../models/UserBadge');
const Competition = require('../models/Competition');
const TaskSubmission = require('../models/TaskSubmission');

// Award points and check for badge achievements
const awardPoints = async (userId, points, ecoPoints = 0, activityType, activityId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    // Update streak and multiplier
    user.updateStreak();
    
    // Add points with multiplier
    const actualPoints = user.addPoints(points, false);
    const actualEcoPoints = user.addPoints(ecoPoints, true);
    
    await user.save();

    // Check for new badge achievements
    const newBadges = await checkBadgeAchievements(user, activityType, activityId);

    // Update competition progress if user is in active competitions
    await updateCompetitionProgress(user, actualPoints + actualEcoPoints, activityType, activityId);

    return {
      pointsAwarded: actualPoints,
      ecoPointsAwarded: actualEcoPoints,
      newLevel: user.level,
      newBadges,
      streakDays: user.streakDays,
      multiplier: user.streakMultiplier
    };
  } catch (error) {
    console.error('Error awarding points:', error);
    throw error;
  }
};

// Check and award badge achievements
const checkBadgeAchievements = async (user, activityType, activityId) => {
  try {
    const availableBadges = await Badge.find({ isActive: true });
    const userBadges = await UserBadge.find({ user: user._id }).populate('badge');
    const earnedBadgeIds = userBadges.map(ub => ub.badge._id.toString());
    
    const newBadges = [];
    
    // Prepare user stats for badge checking
    const userStats = {
      tasks_completed: user.totalTasksCompleted,
      lessons_completed: user.totalLessonsCompleted,
      quizzes_completed: user.totalQuizzesCompleted,
      points_earned: user.points,
      eco_points_earned: user.ecoPoints,
      streak_days: user.streakDays,
      trees_planted: user.treesPlanted,
      waste_collected: user.wasteCollected,
      energy_saved: user.energySaved,
      carbon_reduced: user.carbonFootprintReduced
    };

    for (const badge of availableBadges) {
      // Skip if already earned or not available
      if (earnedBadgeIds.includes(badge._id.toString()) || !badge.isAvailable()) {
        continue;
      }

      // Check if user meets criteria
      if (badge.checkCriteria(userStats)) {
        // Award badge
        const userBadge = new UserBadge({
          user: user._id,
          badge: badge._id,
          pointsAwarded: badge.points,
          achievementContext: {
            activityType,
            activityId,
            milestone: badge.description
          }
        });

        await userBadge.save();
        
        // Award badge points
        if (badge.points > 0) {
          user.points += badge.points;
        }
        
        // Update badge earned count
        badge.earnedCount += 1;
        await badge.save();
        
        newBadges.push({
          badge: badge,
          pointsAwarded: badge.points
        });
      }
    }

    if (newBadges.length > 0) {
      await user.save();
    }

    return newBadges;
  } catch (error) {
    console.error('Error checking badge achievements:', error);
    return [];
  }
};

// Update competition progress
const updateCompetitionProgress = async (user, points, activityType, activityId) => {
  try {
    const activeCompetitions = await Competition.find({
      status: 'active',
      'participants.user': user._id
    });

    for (const competition of activeCompetitions) {
      // Update participant points
      const participant = competition.participants.find(p => p.user.toString() === user._id.toString());
      if (participant) {
        participant.points += points;
        
        // Update activity-specific counters
        if (activityType === 'lesson_completed') participant.lessonsCompleted += 1;
        if (activityType === 'task_completed') participant.tasksCompleted += 1;
      }

      // Update school totals
      const school = competition.schools.find(s => s.name === user.school);
      if (school) {
        school.totalPoints += points;
        if (activityType === 'lesson_completed') school.lessonsCompleted += 1;
        if (activityType === 'task_completed') school.tasksCompleted += 1;
      }

      await competition.save();

      // Log activity
      const activity = new CompetitionActivity({
        competition: competition._id,
        user: user._id,
        school: user.school,
        activityType,
        activityId,
        pointsEarned: points
      });
      await activity.save();
    }
  } catch (error) {
    console.error('Error updating competition progress:', error);
  }
};

// Get user progress dashboard
const getUserProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const userBadges = await UserBadge.find({ user: req.user.id })
      .populate('badge')
      .sort({ earnedAt: -1 });

    // Calculate next level requirements
    const levelThresholds = [0, 50, 200, 400, 700, 1000, 1500, 2000];
    const currentLevel = user.levelNumber;
    const nextLevelPoints = levelThresholds[currentLevel] || 2000;
    const currentLevelPoints = levelThresholds[currentLevel - 1] || 0;
    const progressToNext = ((user.points + user.ecoPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;

    // Weekly progress
    user.resetWeeklyProgress();
    const weeklyGoalProgress = (user.weeklyProgress / user.weeklyGoal) * 100;

    res.json({
      user: {
        name: user.name,
        level: user.level,
        levelNumber: user.levelNumber,
        points: user.points,
        ecoPoints: user.ecoPoints,
        totalPoints: user.points + user.ecoPoints,
        streakDays: user.streakDays,
        longestStreak: user.longestStreak,
        streakMultiplier: user.streakMultiplier
      },
      progress: {
        nextLevel: nextLevelPoints,
        progressToNext: Math.min(100, Math.max(0, progressToNext)),
        weeklyGoal: user.weeklyGoal,
        weeklyProgress: user.weeklyProgress,
        weeklyGoalProgress: Math.min(100, weeklyGoalProgress)
      },
      badges: userBadges.map(ub => ({
        ...ub.badge.toObject(),
        earnedAt: ub.earnedAt,
        isNew: ub.isNew,
        pointsAwarded: ub.pointsAwarded
      })),
      impact: {
        treesPlanted: user.treesPlanted,
        wasteCollected: user.wasteCollected,
        energySaved: user.energySaved,
        carbonReduced: user.carbonFootprintReduced
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get available badges
const getAvailableBadges = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const userBadges = await UserBadge.find({ user: req.user.id });
    const earnedBadgeIds = userBadges.map(ub => ub.badge.toString());

    const badges = await Badge.find({ isActive: true }).sort({ order: 1, rarity: 1 });
    
    const badgesWithProgress = badges.map(badge => {
      const isEarned = earnedBadgeIds.includes(badge._id.toString());
      const isAvailable = badge.isAvailable();
      
      // Calculate progress for each criterion
      const criteriaProgress = badge.criteria.map(criterion => {
        const userValue = getUserStatValue(user, criterion.type);
        const progress = Math.min(100, (userValue / criterion.value) * 100);
        
        return {
          type: criterion.type,
          current: userValue,
          required: criterion.value,
          progress: Math.round(progress),
          description: criterion.description
        };
      });

      return {
        ...badge.toObject(),
        isEarned,
        isAvailable,
        criteriaProgress,
        canEarn: isAvailable && !isEarned
      };
    });

    res.json(badgesWithProgress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to get user stat value
const getUserStatValue = (user, statType) => {
  const statMap = {
    tasks_completed: user.totalTasksCompleted,
    lessons_completed: user.totalLessonsCompleted,
    quizzes_completed: user.totalQuizzesCompleted,
    points_earned: user.points,
    eco_points_earned: user.ecoPoints,
    streak_days: user.streakDays,
    trees_planted: user.treesPlanted,
    waste_collected: user.wasteCollected,
    energy_saved: user.energySaved,
    carbon_reduced: user.carbonFootprintReduced
  };
  
  return statMap[statType] || 0;
};

// Mark badges as viewed
const markBadgesViewed = async (req, res) => {
  try {
    await UserBadge.updateMany(
      { user: req.user.id, isNew: true },
      { isNew: false, viewedAt: new Date() }
    );
    
    res.json({ message: 'Badges marked as viewed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  awardPoints,
  checkBadgeAchievements,
  updateCompetitionProgress,
  getUserProgress,
  getAvailableBadges,
  markBadgesViewed
};