const jwt = require('jsonwebtoken');

// This middleware verifies the "Subject" and their "Identity"
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) return res.status(401).json({ message: "Access Denied: No Token Provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid or Expired Token" });
        req.user = user; // This attaches the user's ID and Role to the request
        next();
    });
};

// This middleware enforces "Access Rights" (Who can access what)
// It satisfies Requirement 2: Access Control Model 
const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        // We check the role we stored in the JWT during Login
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Permission Denied: ${req.user.role}s cannot perform this action.` 
            });
        }
        next();
    };
};

module.exports = { authenticateToken, authorizeRole };