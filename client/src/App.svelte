<script>
  import { Router, Route, Link } from './../node_modules/svelte-navigator/';
  import NewGame from './lib/NewGame.svelte';
  import { io } from 'socket.io-client'
  import Lobby from './lib/Lobby.svelte';

  const socket = io('http://localhost:3000');

  socket.on("connect", () => {
    console.log(socket.connected); // true
  });

  let message;

  socket.on('chat-message', (msg) => {
    message = msg;
  });

</script>

<Router>

  <main>
    <Route path="/">
      <h1>Back to the Drawing Board</h1>
      <!-- <Link to="lobby">Create a game</Link> -->
      {#await socket}
      <p>Loading...</p>
      {:then socket}
      <NewGame socket={socket} />
      {/await}
      <Link to="rules">How to play</Link>
    </Route>

    <Route path="rules">
      <Link to="/">Back</Link>
    </Route>

    <Route path="lobby">
      <Lobby socket={socket}/>
    </Route>
  </main>
  
  <style>
    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
    }
    .logo:hover {
      filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.svelte:hover {
      filter: drop-shadow(0 0 2em #ff3e00aa);
    }
    .read-the-docs {
      color: #888;
    }
  </style>
</Router>
