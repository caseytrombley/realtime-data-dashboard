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

    // ApolloServer setup
    const apolloServer = new ApolloServer({
        schema,
        context: () => ({ pubsub }),
    })
    await apolloServer.start()
    app.use('/graphql', expressMiddleware(apolloServer))

    const httpServer = http.createServer(app)

    // WebSocket server for subscriptions
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    })

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

    httpServer.listen(4000, () => {
        console.log('🚀 HTTP + WS server running at http://localhost:4000/graphql')
    })

    // -------- Mock Data Generator --------
    let currentValue = 15
    let highValueDuration = 0
    let inHighSpike = false
    let highSpikeRemaining = 0 // how many intervals to stay high

    const HIGH_THRESHOLD = 70
    const HIGH_DURATION_LIMIT = 3

    setInterval(() => {
        const roll = Math.random()

        if (inHighSpike) {
            // Stay high until counter runs out
            highSpikeRemaining--
            if (highSpikeRemaining <= 0) {
                inHighSpike = false
                currentValue = 15 + Math.random() * 5 // drop back to low range
                highValueDuration = 0
            } else {
                // Small jitter while high
                currentValue += Math.random() * 4 - 2
                highValueDuration++
            }
        } else if (currentValue < HIGH_THRESHOLD) {
            if (roll < 0.05) {
                // Start a sustained high spike for 3–6 intervals
                currentValue = 80 + Math.random() * 10
                inHighSpike = true
                highSpikeRemaining = Math.floor(3 + Math.random() * 3)
                highValueDuration = 1
            } else if (roll < 0.20) {
                // Mid spike (40–50), short lived
                currentValue = 40 + Math.random() * 10
                highValueDuration = 0
            } else {
                // Small jitter in normal range
                currentValue += Math.random() * 4 - 2
                currentValue = Math.max(10, Math.min(currentValue, 60))
            }
        }

        const alert = currentValue >= HIGH_THRESHOLD && highValueDuration >= HIGH_DURATION_LIMIT
        //const alert = true

        if (alert) {
            console.log('⚠️ ALERT: High energy usage sustained!')
        }

        const data = {
            value: Math.round(currentValue),
            timestamp: new Date().toISOString(),
            alert
        }

        console.log('Published new data:', data)
        pubsub.publish(ENERGY_USAGE_UPDATED, { energyUsageUpdated: data })

    }, 5000)
}

start()
