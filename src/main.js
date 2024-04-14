const express = require('express');
const http = require('http');
const graphqlConfig = require('../src/config/graphql.config');
const graphqlServerPrivate = require('./graphql-private/index');
const graphqlWebSocketServer = require('./ws/index');
const modelNoSql = require('./model-nosql');

class Main {
    constructor(onReady) {
        this.onReady = onReady || function () { };
    }

    async start() {
        try {


            let expressApp = null;
            let httpServer = null;

            expressApp = express();
            httpServer = http.createServer(expressApp);

            expressApp.get('/', (req, res, next) => {
                res.send("");
            });

            console.log(`\t\t== GraphQL`);

            if (graphqlConfig.private_enable) {
                await graphqlServerPrivate(expressApp, httpServer);
            }

            await graphqlWebSocketServer(expressApp, httpServer);

            await new Promise((resolve) => httpServer.listen({ port:  graphqlConfig.port  }, resolve));

            console.log(`\t\t[✓] GraphQL server is started`);

            console.log();
            console.log(`\t\t== MongoDB`);
            await modelNoSql.connect();
            // await modelNoSql.example(); //Add example collection
            console.log(`\t\t[✓] MongoDB model-nosql is ready`);
            console.log();

            this.onReady();
        } catch (ex) {
            console.log(ex.stack);
        }
    }
}

module.exports = Main;