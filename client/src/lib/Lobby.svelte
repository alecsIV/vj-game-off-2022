<script>
  import { gameState } from "./stores";
  import { useNavigate } from "svelte-navigator";

  export let socket;

  let nickname;
  let success;
  let err = null;
  console.log("lobby");
  const navigate = useNavigate();
  const id = window.location.hash.replace("#", "");

  const submitForm = () => {
    console.log("socket", socket);
    socket.emit("join-room", id, nickname, (response) => {
      const { content, users, numUsers } = response;
      success = response.success;
      console.log(content);
      console.log("Logged users", users);
      console.log("Total users", numUsers);
      if (success) {
        $gameState.players = users;
        $gameState.currentUser = nickname;
        err = null;
      } else {
        err = content;
      }
    });
  };

  const startGame = () => {
    $gameState.scene = 1;
    console.log("gamestate scene", $gameState.scene);
    navigate(`/game#${id}`);
  };
</script>

<form on:submit|preventDefault={submitForm}>
  <label for="nickname" />
  <input id="nickname" type="text" bind:value={nickname} />
  <button type="submit">Submit</button>
  <button
    class={success ? "show" : "hidden"}
    on:click|preventDefault={startGame}>Start game</button
  >
  {#if err}
    <p class="error-msg">{err}</p>
  {/if}
</form>

<style>
  .show {
    display: block;
  }

  .hidden {
    display: none;
  }
</style>
