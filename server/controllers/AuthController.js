import UserModel from "../models/UserModel.js";
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { 
            fullName, 
            username, 
            password, 
            confirmPassword, 
            gender 
        } = req.body;

        if(password !== confirmPassword) {
            return res.status(400).json({ message: 'Password does not match' });
        }

        const user = await UserModel.findOne({ username });
        if(user) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new UserModel({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === 'male' ? boyProfilePic : girlProfilePic
        });

        generateTokenAndSetCookie(res, newUser._id)

        await newUser.save();

        res.status(201).json({ 
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            profilePic: newUser.profilePic
         });
    } catch (error) {
        console.log('Error on signup', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UserModel.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || '');

        if(!user || !isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        generateTokenAndSetCookie(res, user._id);

        res.status(200).json({ 
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic
         });
    } catch (error) {
        console.log('Error on login', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie('jwt', '', {
            maxAge: 0,
        });
        res.status(200).json({ message: 'Logged out' });
    } catch (error) {
        console.log('Error on logout', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}