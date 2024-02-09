import ConversationModel from "../models/ConversationModel.js";
import MessageModel from "../models/MessageModel.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await ConversationModel.findOne({
            participants: { $all: [senderId, receiverId]},
        })

        if(!conversation){
            conversation = await ConversationModel.create({
                participants: [senderId, receiverId],
            })
        }

        const newMessage = new MessageModel({
            senderId,
            receiverId,
            message,
        });

        if(newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()]);


        res.status(201).json(newMessage)
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId}  = req.params;
        const senderId = req.user._id;

        const conversation = await ConversationModel.findOne({
            participants: { $all: [senderId, userToChatId]},
        }).populate('messages');

        if(!conversation) {
            return res.status(200).json([]);
        }

        const messages = conversation.messages;

        res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}