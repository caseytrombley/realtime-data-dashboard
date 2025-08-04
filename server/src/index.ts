import { ApolloServer, gql } from 'apollo-server';

// Define the schema
const typeDefs = gql`
  type Thermostat {
    id: ID!
    temperature: Float!
    target: Float!
    mode: String!
  }

  type EnergyUsage {
    timestamp: String!
    kilowatts: Float!
  }

  type Query {
    hello: String!
    thermostats: [Thermostat!]!
    energyUsage: [EnergyUsage!]!
  }
`;

// Mock resolver functions
const resolvers = {
    Query: {
        thermostats: () => [
            { id: "1", temperature: 72.5, target: 74, mode: "cool" },
            { id: "2", temperature: 68.2, target: 70, mode: "heat" }
        ],
        energyUsage: () => {
            const now = Date.now();
            return [
                { timestamp: new Date(now).toISOString(), kilowatts: Math.random() * 5 },
                { timestamp: new Date(now - 60000).toISOString(), kilowatts: Math.random() * 5 },
                { timestamp: new Date(now - 120000).toISOString(), kilowatts: Math.random() * 5 }
            ];
        }

    }
};

// Create the server
const server = new ApolloServer({ typeDefs, resolvers });

// Start listening
server.listen({ port: 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
