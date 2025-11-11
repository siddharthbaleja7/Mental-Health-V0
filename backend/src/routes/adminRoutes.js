// const express = require('express');
// const User = require('../models/User');
// const router = express.Router();

// // Get all users with their assessments
// router.get('/users', async (req, res) => {
//     try {
//         const users = await User.find().select('-password'); // Exclude password field
//         res.json(users);
//     } catch (error) {
//         console.error('Error fetching users:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // Get assessment statistics
// router.get('/stats', async (req, res) => {
//     try {
//         const totalUsers = await User.countDocuments();
//         const usersWithAssessments = await User.countDocuments({
//             'assessments.0': { $exists: true }
//         });
        
//         const allAssessments = await User.aggregate([
//             { $unwind: '$assessments' },
//             { $group: {
//                 _id: null,
//                 averageRisk: { $avg: '$assessments.riskScore' },
//                 totalAssessments: { $sum: 1 },
//                 highRiskCount: { 
//                     $sum: { $cond: [{ $gte: ['$assessments.riskScore', 0.7] }, 1, 0] }
//                 }
//             }}
//         ]);

//         res.json({
//             totalUsers,
//             usersWithAssessments,
//             assessmentStats: allAssessments[0] || {
//                 averageRisk: 0,
//                 totalAssessments: 0,
//                 highRiskCount: 0
//             }
//         });
//     } catch (error) {
//         console.error('Error fetching stats:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // Get specific user's assessments
// router.get('/users/:userId/assessments', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.userId).select('-password');
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.json(user.assessments);
//     } catch (error) {
//         console.error('Error fetching user assessments:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// module.exports = router;
const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const isTeacher = require('../middleware/isTeacher'); // <-- Import our new middleware
const router = express.Router();

// @route   GET /api/admin/student-data
// @desc    Get all student data for the teacher dashboard
// @access  Private (Teacher Only)

// We chain both middlewares. User must be logged in AND be a teacher.
router.get('/student-data', auth, isTeacher, async (req, res) => {
    try {
        // Find all users with the role 'student'
        const students = await User.find({ role: 'student' })
                                   .select('-password') // Don't send passwords
                                   .sort({ username: 1 }); // Sort by name

        res.json(students);
    } catch (error) {
        console.error('Error fetching student data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;