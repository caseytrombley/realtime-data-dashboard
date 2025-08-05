import express from 'express';
import http from 'http';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws';
import { PubSub } from 'graphql-subscriptions';

const ENERGY_USAGE_UPDATED = 'ENERGY_USAGE_UPDATED';

const typeDefs = /* GraphQL */ `
  type Query {
    hello: String
  }
  type EnergyUsage {
    value: Float
    timestamp: String
  }
  type Subscription {
    energyUsageUpdated: EnergyUsage
  }
`;

const pubsub = new PubSub();

const resolvers = {
    Query: {
        hello: () => 'Hello world',
    },
    Subscription: {
        energyUsageUpdated: {
            subscribe: () => pubsub.asyncIterator(ENERGY_USAGE_UPDATED),
        },
    },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

async function start() {
    const app = express();
    const httpServer = http.createServer(app);

    const server = new ApolloServer({
        schema,
    });
    await server.start();

    app.use(
        '/graphql',
        cors(),
        express.json(),
        expressMiddleware(server)
    );

    // Set up WebSocket server for subscriptions
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });

    useServer({ schema }, wsServer);

    httpServer.listen(4000, () => {
        console.log('🚀 Server ready at http://localhost:4000/graphql');
    });

    // Mock publishing some random data every 2 seconds
    setInterval(() => {
        pubsub.publish(ENERGY_USAGE_UPDATED, {
            energyUsageUpdated: {
                value: Math.random() * 100,
                timestamp: new Date().toISOString(),
            },
        });
    }, 2000);
}

start().catch((err) => {
    console.error(err);
    process.exit(1);
});
