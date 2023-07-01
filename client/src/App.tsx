import React, { useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useSubscription, useQuery } from '@apollo/client';

type Message = {
  id: string;
  content: string;
};

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

const MESSAGE_ADDED_SUBSCRIPTION = gql`
  subscription {
    messageAdded {
      id
      content
    }
  }
`;

function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  // useSubscription(MESSAGE_ADDED_SUBSCRIPTION, {
  //   onSubscriptionData: ({ subscriptionData }) => {
  //     const newMessage = subscriptionData?.data?.messageAdded;
  //     if (newMessage) {
  //       setMessages((prevMessages) => [...prevMessages, newMessage]);
  //     }
  //   },
  // });

  return (
    <div>
      <h1>Chat App</h1>
      <ul>
        {messages.map((message) => (
          <li key={message?.id}>{message?.content}</li>
        ))}
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
