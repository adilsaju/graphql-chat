var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
const cors = require('cors')
const { ApolloServer, gql } = require('apollo-server-express');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mainRoute = require('./routes/mainRoute');

const {roomSchema, messageSchema}  = require('./models/chatModel')


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

//DATABASE SETUP
// mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useCreateIndex: true } )
mongoose.connect('mongodb://localhost/chatapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection 
db.on('error',(error)=>console.error(error))
db.once('open',()=>console.error('connected to database'))

// Define Mongoose models
const Room = mongoose.model('Room', roomSchema);
const Message = mongoose.model('Message', messageSchema);


// GraphQL schema
const typeDefs = gql`
  type Room {
    id: ID!
    room: String!
    employer: Employer
    technician: Technician
    job: Job
    room_created: String!
  }

  type Employer {
    id: ID!
    name: String!
  }

  type Technician {
    id: ID!
    name: String!
  }

  type Job {
    id: ID!
    title: String!
  }

  type Message {
    id: ID!
    room: Room!
    sender: User!
    message: String!
    date: String!
  }

  type User {
    id: ID!
    name: String!
  }

  type Query {
    rooms: [Room]
    room(id: ID!): Room
    messages(roomId: ID!): [Message]
  }

  type Mutation {
    createRoom(room: String!, employerId: ID, technicianId: ID, jobId: ID): Room
    sendMessage(roomId: ID!, senderId: ID!, message: String!): Message
  }
`;

// GraphQL resolvers
const resolvers = {
  Query: {
    rooms: () => Room.find(),
    room: (_, { id }) => Room.findById(id),
    messages: (_, { roomId }) => Message.find({ room_id: roomId }),
  },
  Mutation: {
    createRoom: (_, { room, employerId, technicianId, jobId }) => {
      const newRoom = new Room({
        room,
        employer_id: employerId,
        technician_id: technicianId,
        job_id: jobId,
      });
      return newRoom.save();
    },
    sendMessage: (_, { roomId, senderId, message }) => {
      const newMessage = new Message({
        room_id: roomId,
        sender_id: senderId,
        message,
      });
      return newMessage.save();
    },
  },
  Room: {
    employer: (parent) => Employer.findById(parent.employer_id),
    technician: (parent) => Technician.findById(parent.technician_id),
    job: (parent) => Job.findById(parent.job_id),
  },
  Message: {
    room: (parent) => Room.findById(parent.room_id),
    sender: (parent) => {
      if (parent.docModel === 'employer') {
        return Employer.findById(parent.sender_id);
      } else if (parent.docModel === 'technician') {
        return Technician.findById(parent.sender_id);
      }
    },
  },
};



app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use("/api/v1/", mainRoute)

app.use((req, res, next) => {
    res.status(404);
    res.send({
      error: '404 Page: Not found',
    });
  });




async function startServer() {
  // Create Apollo Server
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  // Mount Apollo Server on the Express app
  server.applyMiddleware({ app });

  // Start the server
  app.listen(3000, () => {
    console.log('Server started at http://localhost:3000');
  });
}
startServer();

// module.exports = app;