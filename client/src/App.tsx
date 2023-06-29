import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});

const ROOMS_QUERY = gql`
  query {
    rooms {
      id
      room
    }
  }
`;

const MESSAGES_QUERY = gql`
  query($roomId: ID!) {
    messages(roomId: $roomId) {
      id
      sender {
        id
        name
      }
      message
      date
    }
  }
`;

const SEND_MESSAGE_MUTATION = gql`
  mutation($roomId: ID!, $senderId: ID!, $message: String!) {
    sendMessage(roomId: $roomId, senderId: $senderId, message: $message) {
      id
      sender {
        id
        name
      }
      message
      date
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(ROOMS_QUERY);
  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION);

  const handleSendMessage = async (roomId:string, senderId:string, message:string) => {
    await sendMessage({ variables: { roomId, senderId, message } });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Chat App</h1>
      <ul>
        {data.rooms.map((room:{ id: string, room: string }) => (
          <li key={room.id}>
            {room.room}
            <MessageList roomId={room.id} />
            <SendMessageForm roomId={room.id} onSendMessage={handleSendMessage} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function MessageList({ roomId }: { roomId: string }) {
  const { loading, error, data } = useQuery(MESSAGES_QUERY, {
    variables: { roomId },
  });

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.messages.map((message:  { id: string, sender: { name: string }, message: string }) => (
        <li key={message.id}>
          <strong>{message.sender.name}: </strong>
          {message.message}
        </li>
      ))}
    </ul>
  );
}

function SendMessageForm({ roomId, onSendMessage }: { roomId: string, onSendMessage: (roomId: string, senderId: string, message: string) => void }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSendMessage(roomId, 'sender-id', message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button type="submit">Send</button>
    </form>
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
