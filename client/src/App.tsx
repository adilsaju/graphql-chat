import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, useMutation, useSubscription } from '@apollo/client';
import { useState, useEffect } from 'react';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
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
      sender
      content
    }
  }
`;

const SEND_MESSAGE_MUTATION = gql`
  mutation($roomId: ID!, $sender: String!, $content: String!) {
    sendMessage(roomId: $roomId, sender: $sender, content: $content) {
      id
      sender
      content
    }
  }
`;

const MESSAGE_SUBSCRIPTION = gql`
  subscription($roomId: ID!) {
    messageSent(roomId: $roomId) {
      id
      sender
      content
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(ROOMS_QUERY);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION);
  const { data: subscriptionData } = useSubscription(MESSAGE_SUBSCRIPTION, {
    variables: { roomId: selectedRoomId },
  });

  useEffect(() => {
    if (subscriptionData) {
      const newMessage = subscriptionData.messageSent;
      // Handle the newly received message as per your requirements
      console.log('New message:', newMessage);
    }
  }, [subscriptionData]);

  const handleSendMessage = async (sender: string, content: string) => {
    await sendMessage({ variables: { roomId: selectedRoomId, sender, content } });
  };

  const handleRoomSelection = (roomId: string) => {
    setSelectedRoomId(roomId);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Chat App</h1>
      <ul>
        {data.rooms.map((room: { id: string, room: string }) => (
          <li key={room.id} onClick={() => handleRoomSelection(room.id)}>
            {room.room}
          </li>
        ))}
      </ul>
      {selectedRoomId && (
        <>
          <MessageList roomId={selectedRoomId} />
          <SendMessageForm roomId={selectedRoomId} onSendMessage={handleSendMessage} />
        </>
      )}
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
      {data.messages.map((message: { id: string, sender: string, content: string }) => (
        <li key={message.id}>
          <strong>{message.sender}: </strong>
          {message.content}
        </li>
      ))}
    </ul>
  );
}

function SendMessageForm({ roomId, onSendMessage }: { roomId: string, onSendMessage: (sender: string, content: string) => void }) {
  const [sender, setSender] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSendMessage(sender, content);
    setSender('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={sender} onChange={(e) => setSender(e.target.value)} placeholder="Your Name" />
      <input type="text" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Your Message" />
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
