const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ message: 'Unauthorized : No token provided' });

    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('JWT Verification Error :', error);
        return res.status(403).json({ message: "Forbidden:Invalid Token" });
    }
};
module.exports = authMiddleware;