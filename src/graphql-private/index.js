require("dotenv").config();
const { ApolloServer } = require('@apollo/server');
const { ApolloServerPluginLandingPageDisabled } = require('@apollo/server/plugin/disabled');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const express = require('express');
const http = require('http');
const cors = require('cors');
const { json } = require('body-parser');
const graphqlConfig = require('../config/graphql.config');
const { loadFilesSync } = require('@graphql-tools/load-files');

const _ = require('lodash');
const { GraphQLError } = require('graphql');

let contextRedis = null;
const graphqlServer = async (app, httpServer) => {

  const typeDefsFromFile = loadFilesSync('src/graphql-private/**/*.graphql');
  const resolversFromFile = loadFilesSync('src/graphql-private/**/*.{js,ts}');

  const pluginRegistry = [
    ApolloServerPluginDrainHttpServer({ httpServer })
  ];


  if (!graphqlConfig.private_landing_page_enable) {
    pluginRegistry.push(ApolloServerPluginLandingPageDisabled());
  }

  const server = new ApolloServer({
    typeDefs: typeDefsFromFile,
    resolvers: resolversFromFile,
    includeStacktraceInErrorResponses: false,
    plugins: pluginRegistry,
    formatError: (formattedError, error) => {
      return {
        error: formattedError.extensions.message,
        message: formattedError.message,
        code: formattedError.extensions.code,
      };
    },
  });
  await server.start();

  app.use(
    graphqlConfig.private_path, 
    cors(),
    json(),
    expressMiddleware(server, {
      
    })
  );

};
module.exports = graphqlServer;