import React from 'react';
import './App.css';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
  cache: new InMemoryCache(),
});

// Define the GraphQL query using gql
const GET_TODOS = gql`
  query GetTodos {
    getTodos {
      id
      title
      completed
    }
  }
`;

function Todos() {
  const { loading, error, data } = useQuery(GET_TODOS);

  if (loading) return <p>Loading todos...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.getTodos.slice(0, 10).map((todo) => (
        <li key={todo.id}>
          <strong>{todo.title}</strong> - {todo.completed ? '✅ Done' : '❌ Not Done'}
        </li>
      ))}
    </ul>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <h2>GraphQL Todos</h2>
          <Todos />
        </header>
      </div>
    </ApolloProvider>
  );
}

export default App;
