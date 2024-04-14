const ChatRoomModel = require('../model-nosql/chatroom.model');

const checkChatroom = async (roomName) => {
    const getChatroom = await ChatRoomModel.findOne(
        { roomName: roomName }
    );

    console.log(getChatroom)
    
    return getChatroom;
}

const createChatroom = async (data) => {
    try {

        const checkExistChatroom = await ChatRoomModel.findOne({
            "chatroom_id": data.chatroom_id
        });

        if (checkExistChatroom && checkExistChatroom.version >= data?.version) {
            console.log(`->[DB] > version=${checkExistChatroom.version} ${JSON.stringify(checkExistChatroom)}`);
            console.log(`->[KK] > version=${data?.version} ${JSON.stringify(data)}`);
            throw Error(`[message.process:createMessage] DB is newest version, see upper log`);
        }

        console.log(`->[KK] > version=${data?.version} ${JSON.stringify(data)}`);

        const chatroom = new ChatRoomModel(data);
        await chatroom.save();

        return chatroom;
    } catch (ex) {
        
        return ex;
    }
};


const ChatroomRepository = {
    checkChatroom,
    createChatroom,
};

module.exports = ChatroomRepository;