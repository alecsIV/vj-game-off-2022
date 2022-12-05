import { readFileSync } from "fs";
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer( ( req, res ) => {
  if ( req.url !== "/" ) {
    res.writeHead( 404 );
    res.end( "Not found" );
    return;
  }
  // reload the file every time
  const content = readFileSync( "./index.html" );
  const length = Buffer.byteLength( content );

  res.writeHead( 200, {
    "Content-Type": "text/html",
    "Content-Length": length,
  } );
  res.end( content );
} );

const io = new Server( httpServer, {
  // Socket.IO options
  cors: {
    origin: [ 'http://127.0.0.1:5173', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://localhost:3000' ],
    credentials: true,
    methods: [ "GET", "POST" ],
  },
} );

let users = {};

io.on( "connection", ( socket ) => {
  console.log( `connect ${socket.id}` );

  socket.on( "disconnect", ( reason ) => {
    console.log( `disconnect ${socket.id} due to ${reason}` );
  } );

  /* @TODO:
  - show number of connected users
  - create different rooms with separate ids
  - set up the game session 
  - name the game state ( to run the different multiplayer games)
  */
 
  // socket.join('default room');

  socket.on( 'join-room', ( room, nickname, callback ) => {
    let err;
    if ( !users[ room ] ) users[ room ] = new Set();
    if ( users[ room ].has( nickname ) ) {
      err = 'User already exists';
      callback( {
        content: err,
        success: false,
        users: Array.from(users[room]),
        numUsers: users[ room ].size
      } )
      return;
    }

    users[ room ].add( nickname );

    socket.join( room );

    callback( {
      content: `${nickname} joined ${room}`,
      success: true,
      users: Array.from(users[room]),
      numUsers: users[ room ].size
    } );
    // socket.to('game1').emit('chat message', 'game 1');
    // console.log('joined room game 1');
    // io.to('game1').emit('chat-message');
    // cb({
    //     content: `Joined ${room}`,
    //     id: socket.id,
    // });

    //   socket.on('send-nickname', (nickname) => {
    //     socket.nickname = nickname;
    //     users.push(socket.nickname);
    //     console.log(users);
    // });
  } )
} );

httpServer.listen( 3000 );
