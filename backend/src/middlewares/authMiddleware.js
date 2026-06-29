import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    // 1. Get the token from the cookies
    const token = req.cookies.token;

    // 2. If no token is found, send an unauthorized error
    if (!token) {
        return res.status(401).json({ message: 'Authentication failed: No token provided.' });
    }

    try {
        // 3. Verify the token using your JWT_SECRET
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // 4. If verification is successful, attach the userId to the request object
        req.userId = decodedToken.userId;

        // 5. Pass control to the next middleware or the actual route handler
        next();
    } catch (error) {
        // If verification fails (e.g., token is invalid or expired), send an error
        return res.status(401).json({ message: 'Authentication failed: Invalid token.' });
    }
};

export default authMiddleware;
