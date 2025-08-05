import { createApp, h, provide } from 'vue'
import './style.css'
import App from './App.vue'
import {
    ApolloClient,
    InMemoryCache,
    split,
    HttpLink,
} from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'

// HTTP connection to the API
const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql',
})

// WebSocket connection for subscriptions
const wsLink = new GraphQLWsLink(
    createClient({
        url: 'ws://localhost:4000/graphql',
    })
)

// Split links so that subscriptions go through wsLink
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query)
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        )
    },
    wsLink,
    httpLink
)

// Apollo client setup
const apolloClient = new ApolloClient({
    link: splitLink, // <-- use splitLink instead of just httpLink
    cache: new InMemoryCache(),
})

// Create Vue app
const app = createApp({
    setup() {
        provide(DefaultApolloClient, apolloClient)
    },
    render: () => h(App),
})

app.mount('#app')
