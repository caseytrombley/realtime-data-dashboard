// index.js
import express from 'express'
import http from 'http'
import cors from 'cors'
import bodyParser from 'body-parser'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express4'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/use/ws'
import { execute, subscribe } from 'graphql'

import { schema } from './schema.js'
import { pubsub, ENERGY_USAGE_UPDATED } from './pubsub.js'

async function start() {
    const app = express()
    app.use(cors())
    app.use(bodyParser.json())

    // Create ApolloServer instance with schema and context providing pubsub
    const apolloServer = new ApolloServer({
        schema,
        context: () => ({ pubsub }),
    })
    await apolloServer.start()

    // Apply Apollo GraphQL middleware for HTTP endpoint
    app.use('/graphql', expressMiddleware(apolloServer))

    // Create HTTP server from Express app
    const httpServer = http.createServer(app)

    // Create WebSocket server for handling subscriptions
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    })

    // Use graphql-ws to handle subscriptions, passing context with pubsub
    useServer(
        {
            schema,
            execute,
            subscribe,
            context: () => ({ pubsub }),
            onConnect: () => console.log('Client connected via WebSocket'),
            onDisconnect: () => console.log('Client disconnected from WebSocket'),
        },
        wsServer
    )


    // Start the HTTP + WS server
    httpServer.listen(4000, () => {
        console.log('🚀 HTTP + WS server running at http://localhost:4000/graphql')
    })

    // Publish mock data every 5 seconds
    setInterval(() => {
        const data = { value: Math.random() * 100, timestamp: new Date().toISOString() }
        console.log('Published new data:', data)
        pubsub.publish(ENERGY_USAGE_UPDATED, { energyUsageUpdated: data })
    }, 5000)
}

start()
