const MessageModel = require('../model-nosql/message.model');


const checkMessageId = async (id) => {
    const getMessage = await MessageModel.findOne({ id: id });

    return getMessage;
}


const createMessage = async (data) => {
    try {

        const checkExistMessage = await MessageModel.findOne({
            "id": data.id
        });

        if (checkExistMessage && checkExistMessage.version >= data?.version) {
            console.log(`->[DB] > version=${checkExistMessage.version} ${JSON.stringify(checkExistMessage)}`);
            console.log(`->[KK] > version=${data?.version} ${JSON.stringify(data)}`);
            throw Error(`[message.process:createMessage] DB is newest version, see upper log`);
        }

        console.log(`->[KK] > version=${data?.version} ${JSON.stringify(data)}`);

        const message = new MessageModel(data);
        await message.save();

        return message;
    } catch (ex) {
        
        return ex;
    }
};


const getListMessageByRoomName = async (roomName) => {
    const getListMessage = await MessageModel
        .find({
            $and: [
                { roomName: roomName },
                { deleted_at: null }
            ]
        })
        
    return getListMessage;
}



const MessageRepository = {
    checkMessageId,
    createMessage,
    getListMessageByRoomName,
};

module.exports = MessageRepository;