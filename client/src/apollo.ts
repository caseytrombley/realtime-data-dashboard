// src/apollo.ts
import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client/core'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'

// HTTP link for queries & mutations
const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql',
})

// WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(
    createClient({
        url: 'ws://localhost:4000/graphql',
    })
)

// Route subscriptions to wsLink, the rest to httpLink
const link = split(
    ({ query }) => {
        const def = getMainDefinition(query)
        return (
            def.kind === 'OperationDefinition' && def.operation === 'subscription'
        )
    },
    wsLink,
    httpLink
)

// Apollo Client instance
export const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache(),
})
