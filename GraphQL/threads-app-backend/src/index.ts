// Import express (for creating HTTP server)
import express from 'express';
// Import ApolloServer (for setting up GraphQL server)
import { ApolloServer } from '@apollo/server';
// Import express middleware for integrating Apollo with Express
import { expressMiddleware } from '@as-integrations/express5';
import { prismaClient } from './lib/db';

async function init() {
    // Initialize an Express app
    const app = express();

    // Define the port number to run the server on, defaulting to 8000
    const PORT = Number(process.env.PORT) || 8000;

    // Enable Express to parse incoming JSON requests
    app.use(express.json());

    // Create a new Apollo GraphQL server instance
    const gqlServer = new ApolloServer({
        // Define the GraphQL schema using type definitions
        typeDefs: `
            type Query {
                hello: String
                say(name: String): String
            }
            type Mutation {
                createUser(firstName: String!, lastName: String!, email: String!, password : String!): Boolean
            }
        `,
        // Define resolver functions that execute the GraphQL queries
        resolvers: {
            Query: {
                // Resolver for the 'hello' query
                hello: () => `Hey there, I am a GraphQL Server`,
                say: (_, {name}: {name: String})=> `Hey ${name}, How are you ?`
            },
            Mutation: {
                createdUser: async(_, {firstName, lastName, email, password}: {firstName: string; lastName: string; email: string; password: string })=> {
                    await prismaClient.user.create({
                        data : {
                            email,
                            firstName,
                            lastName,
                            password,
                            salt: 'random_salt',
                        },
                    });
                    return true;
                }
            }
        },
    });

    // Start the Apollo Server (important before applying middleware)
    await gqlServer.start();

    // Create a simple GET route for the root path to verify server is working
    app.get("/", (req, res) => {
        res.json({ message: "Server is up and running" });
    });

    // Mount the GraphQL server at the '/graphql' endpoint using middleware
    app.use('/graphql', expressMiddleware(gqlServer));

    // Start the Express server and listen on the specified port
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
}

// Call the init function to start everything
init();
