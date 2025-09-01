const Competition = require('../models/Competition');
const User = require('../models/User');

exports.getActiveCompetitions = async (req, res) => {
  try {
    const competitions = await Competition.find({ 
      status: { $in: ['upcoming', 'active'] },
      isActive: true 
    }).sort({ startDate: 1 });
    
    res.json(competitions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.joinCompetition = async (req, res) => {
  try {
    const { competitionId } = req.params;
    const userId = req.user.userId;
    
    const user = await User.findById(userId);
    const competition = await Competition.findById(competitionId);
    
    if (!competition) {
      return res.status(404).json({ error: 'Competition not found' });
    }
    
    const existingParticipant = competition.participants.find(
      p => p.user.toString() === userId
    );
    
    if (existingParticipant) {
      return res.status(400).json({ error: 'Already joined this competition' });
    }
    
    competition.participants.push({
      user: userId,
      school: user.school || 'Unknown School',
      points: user.points || 0
    });
    
    await competition.save();
    
    res.json({ message: 'Successfully joined competition' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCompetitionLeaderboard = async (req, res) => {
  try {
    const { competitionId } = req.params;
    
    const competition = await Competition.findById(competitionId)
      .populate('participants.user', 'name school points level');
    
    if (!competition) {
      return res.status(404).json({ error: 'Competition not found' });
    }
    
    // Group by school and calculate total points
    const schoolStats = {};
    const individualLeaderboard = [];
    
    competition.participants.forEach(participant => {
      const school = participant.school;
      const userPoints = participant.user.points || 0;
      
      if (!schoolStats[school]) {
        schoolStats[school] = { school, totalPoints: 0, studentCount: 0 };
      }
      
      schoolStats[school].totalPoints += userPoints;
      schoolStats[school].studentCount += 1;
      
      individualLeaderboard.push({
        name: participant.user.name,
        school: participant.school,
        points: userPoints,
        level: participant.user.level
      });
    });
    
    const schoolLeaderboard = Object.values(schoolStats)
      .sort((a, b) => b.totalPoints - a.totalPoints);
    
    individualLeaderboard.sort((a, b) => b.points - a.points);
    
    res.json({
      competition: {
        title: competition.title,
        status: competition.status,
        startDate: competition.startDate,
        endDate: competition.endDate
      },
      schoolLeaderboard: schoolLeaderboard.slice(0, 10),
      individualLeaderboard: individualLeaderboard.slice(0, 20)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCompetition = async (req, res) => {
  try {
    const { title, description, startDate, endDate, schools, prizes } = req.body;
    
    const competition = new Competition({
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      schools: schools || [],
      prizes: prizes || []
    });
    
    await competition.save();
    
    res.status(201).json({
      message: 'Competition created successfully',
      competition
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};