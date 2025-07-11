"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import express (for creating HTTP server)
const express_1 = __importDefault(require("express"));
// Import ApolloServer (for setting up GraphQL server)
const server_1 = require("@apollo/server");
// Import express middleware for integrating Apollo with Express
const express5_1 = require("@as-integrations/express5");
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        // Initialize an Express app
        const app = (0, express_1.default)();
        // Define the port number to run the server on, defaulting to 8000
        const PORT = Number(process.env.PORT) || 8000;
        // Enable Express to parse incoming JSON requests
        app.use(express_1.default.json());
        // Create a new Apollo GraphQL server instance
        const gqlServer = new server_1.ApolloServer({
            // Define the GraphQL schema using type definitions
            typeDefs: `
            type Query {
                hello: String
                say(name: String): String
            }
        `,
            // Define resolver functions that execute the GraphQL queries
            resolvers: {
                Query: {
                    // Resolver for the 'hello' query
                    hello: () => `Hey there, I am a GraphQL Server`,
                    say: (_, { name }) => `Hey ${name}, How are you ?`
                },
            },
        });
        // Start the Apollo Server (important before applying middleware)
        yield gqlServer.start();
        // Create a simple GET route for the root path to verify server is working
        app.get("/", (req, res) => {
            res.json({ message: "Server is up and running" });
        });
        // Mount the GraphQL server at the '/graphql' endpoint using middleware
        app.use('/graphql', (0, express5_1.expressMiddleware)(gqlServer));
        // Start the Express server and listen on the specified port
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    });
}
// Call the init function to start everything
init();
