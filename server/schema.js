// schema.js
import { GraphQLID, GraphQLObjectType, GraphQLSchema, GraphQLFloat, GraphQLString, GraphQLBoolean } from 'graphql'

import { pubsub, ENERGY_USAGE_UPDATED } from './pubsub.js'

const EnergyUsageType = new GraphQLObjectType({
    name: 'EnergyUsage',
    fields: {
        id: { type: GraphQLID },
        timestamp: { type: GraphQLString },
        value: { type: GraphQLFloat },
        alert: { type: GraphQLBoolean },
    },
})

export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            hello: {
                type: GraphQLString,
                resolve: () => 'Hello world!',
            },
        },
    }),
    subscription: new GraphQLObjectType({
        name: 'Subscription',
        fields: {
            energyUsageUpdated: {
                type: EnergyUsageType,
                subscribe: () => pubsub.asyncIterableIterator(ENERGY_USAGE_UPDATED),
            },
        },
    }),
})
