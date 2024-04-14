
require("dotenv").config();

const { ApolloServer } = require('@apollo/server');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const { json } = require('body-parser');
const { loadFilesSync } = require('@graphql-tools/load-files');



let contextRedis = null;
const graphqlWebSocketServer = async (app, httpServer) => {

    const typeDefsFromFile = loadFilesSync('src/ws/**/*.graphql');
    const resolversFromFile = loadFilesSync('src/ws/**/*.{js,ts}');

    const schema = makeExecutableSchema({
        typeDefs: typeDefsFromFile,
        resolvers: resolversFromFile
    });


    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/subscriptions',
    });

    const serverCleanup = useServer({ schema }, wsServer);

    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });

    await server.start();

    app.use(
        '/subscriptions',
        cors(),
        json(),
        expressMiddleware(server, {
            
        })
      );

};
module.exports = graphqlWebSocketServer;