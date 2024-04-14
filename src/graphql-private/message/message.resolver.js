const set = require('lodash/set');
const get = require('lodash/get');
const uuid = require('uuidv1');

const mock = require('../../mock');
const MessageRepository = require('../../repository/message.repository');
const ChatroomRepository = require('../../repository/chatroom.repository');
const pubsub = require('../../lib/punsub');


const resolvers = {
    Query: {
        messages: async (parent, { roomName }) => {

            const list_message = await MessageRepository.getListMessageByRoomName(
                roomName
            );

            const msgs = get(mock, `rooms.${roomName}.messages`, list_message);

            return msgs;
        }
    },
    Mutation: {
        sendMessage: async (parent, dataRequest) => {

            if (!dataRequest?.roomName) {
                return {
                    successful: false,
                    message: "room_name_is_empty"
                };
            }

            const existChatroom = await ChatroomRepository.checkChatroom(
                dataRequest?.roomName
            );


            if (!existChatroom) {
                return {
                    successful: false,
                    message: "room_name_not_found"
                };
            }

            dataRequest.id = `${uuid()}`;
            dataRequest.body = dataRequest?.message
            dataRequest.created_at = new Date();
            dataRequest.created_by = null;
            dataRequest.updated_at = new Date();
            dataRequest.updated_by = null;
            dataRequest.deleted_at = null;
            dataRequest.deleted_by = null;
            dataRequest.version = 0;


            const existMessage = await MessageRepository.checkMessageId(
                dataRequest.id
            );

            if (existMessage) {
                return {
                    successful: false
                };
            }
            let messages = { id: dataRequest.id,roomName:dataRequest?.roomName, body: dataRequest?.message, image_url: dataRequest?.image_url ? dataRequest?.image_url : null, from: dataRequest?.from };
            const createMessage = await MessageRepository.createMessage(dataRequest);
    
            await pubsub.publish(`newMessage`, {
                newMessage: messages,
            });

            set(mock, `rooms.${dataRequest?.roomName}`, {
                messages: [
                    ...get(mock, `rooms.${dataRequest?.roomName}.messages`, []),
                    { id: dataRequest.id, body: dataRequest?.message, image_url: dataRequest?.image_url ? dataRequest?.image_url : null, from: dataRequest?.from }
                ]
            });

            return {
                successful: true,
                message: "success"
            };
        }
    }
};

module.exports = resolvers;
