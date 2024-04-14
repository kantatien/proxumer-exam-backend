
const uuid = require('uuidv1');
const ChatroomRepository = require('../../repository/chatroom.repository');

const createRoom = async (req, header) => {
    const request = req || {};
    const metadata = header || {};

    dataRequest = request;
    dataRequest.chatroom_id = `${uuid()}`;
    
    const existChatroom = await ChatroomRepository.checkChatroom(
        dataRequest?.roomName
    );

    if (existChatroom) {
        return {
            successful: false,
            message:"room_name_is_duplicate"
        };
    }
    dataRequest.created_at = new Date();
    dataRequest.created_by = null;
    dataRequest.updated_at = new Date();
    dataRequest.updated_by = null;
    dataRequest.deleted_at = null;
    dataRequest.deleted_by = null;
    dataRequest.version = 0;

    const createChatroom = await ChatroomRepository.createChatroom(dataRequest);

    return {
        successful: true,
        message:"success"
    };
}



const resolvers = {
    Mutation: {
        createRoom: async (_, req, header) => await createRoom(req, header),

    },
};

module.exports = resolvers;