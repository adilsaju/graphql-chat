import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

const GET_HELLO = gql`
  query {
    hello
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_HELLO);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Chat App</h1>
      <ul>
        <li>{data&&data.hello}</li>
      </ul>
    </div>
  );
}

function ApolloApp() {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
}

export default ApolloApp;
