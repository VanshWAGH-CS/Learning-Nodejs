const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const { json } = require('body-parser');
const axios = require('axios'); // ✅ Import axios
const playground = require('graphql-playground-middleware-express').default;

async function startServer() {
    const app = express();

    const typeDefs = `
        type Todo {
            id: ID!
            title: String!
            completed: Boolean
        }

        type Query {
            getTodos: [Todo]
        }
    `;

    const resolvers = {
        Query: {
            // ✅ Proper async resolver function
            getTodos: async () => {
                const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
                return response.data;
            }
        }
    };

    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();

    app.use(cors());
    app.use(json());
    app.use('/graphql', expressMiddleware(server));
    app.get('/playground', playground({ endpoint: '/graphql' }));

    app.listen(8000, () => {
        console.log('🚀 GraphQL endpoint: http://localhost:8000/graphql');
        console.log('🧪 Playground UI:   http://localhost:8000/playground');
    });
}

startServer();
