import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
    
        if (!token) return res.status(401).json({ message: 'Unauthorized - No token provided' });

        const verified = jwt.verify(token, process.env.JWT_SECRET);

        if(!verified) return res.status(401).json({ message: 'Unauthorized- Invalid token' });

        const user = await UserModel.findById(verified.userId).select('-password');

        if(!user) return res.status(401).json({ message: 'User not found' });

        req.user = user;

        next();
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export default protectRoute;