import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const header = req.header.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Unauthorized! Invalid headers!"
        });
    }

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.decode(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({error: "Invalid Token"});
    }
}

export default authMiddleware;