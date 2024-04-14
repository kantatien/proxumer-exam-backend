const pubsub = require('../../lib/punsub');
const { withFilter } = require('graphql-subscriptions');


const resolvers = {
    Subscription: {
        newMessage: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('newMessage'),
                (payload, variables) => {
                    return (
                        payload.newMessage.roomName === variables.roomName
                    );
                },
            ),
        },
    },
};

module.exports = resolvers;
