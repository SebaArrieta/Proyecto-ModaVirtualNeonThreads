const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    const tipo = req.header('tipo')
    if (!token || !tipo) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token, 'secret');
        if(decoded.tipo != tipo) return res.status(401).json({ error: 'Access denied' });
        req.userId = decoded.userId;
        req.userTipo = decoded.tipo;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
 };

module.exports = verifyToken;