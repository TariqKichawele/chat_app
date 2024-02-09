import UserModel from '../models/UserModel.js';

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const filteredUsers = await UserModel.find({
             _id: { $ne: loggedInUserId } 
        }).select('-password');

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}