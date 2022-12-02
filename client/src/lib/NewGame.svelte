<script>

  export let socket; 
  function createGame() {
    const id = generateId(6);
    window.location.href += `lobby#${id}`;
    socket.emit("join-room", id);
  }

    // dec2hex :: Integer -> String
    // i.e. 0-255 -> '00'-'ff'
    function dec2hex(dec) {
      return dec.toString(16).padStart(2, "0");
    }

    // generateId :: Integer -> String
    function generateId(len) {
      var arr = new Uint8Array((len || 40) / 2);
      window.crypto.getRandomValues(arr);
      return Array.from(arr, dec2hex).join("");
    }

</script>

<button class="new-game__button" on:click={createGame}
  >> Create a new game
</button>
