<script>
  export let socket;
  const submitForm = () => {
    const id = window.location.hash.replace('#', '');
    console.log('id', id);
    socket.emit("join-room", id, response => {
      const { content } = response;
      console.log(content);
    });
  };
</script>

<form on:submit|preventDefault={submitForm}>
  <label for="nickname" />
  <input id="nickname" type="text" />
  <button type="submit">Submit</button>
</form>
