// This middleware runs *after* the 'auth' middleware
function isTeacher(req, res, next) {
  // req.user is attached by the 'auth' middleware
  if (req.user && req.user.role === 'teacher') {
    next(); // User is a teacher, allow access
  } else {
    res.status(403).json({ message: 'Forbidden: Access denied. Teacher role required.' });
  }
}

module.exports = isTeacher;