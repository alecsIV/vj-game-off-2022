<script>
  export let socket;
  let nickname;
  const submitForm = () => {
    const id = window.location.hash.replace('#', '');
    console.log('socket', socket);
    socket.emit("join-room", id, nickname, response => {
      const { content, users, numUsers } = response;
      console.log(content);
      console.log('Logged users', users);
      console.log('Total users', numUsers);
    });
  };
</script>

<form on:submit|preventDefault={submitForm}>
  <label for="nickname" />
  <input id="nickname" type="text" bind:value={nickname}/>
  <button type="submit">Submit</button>
</form>
