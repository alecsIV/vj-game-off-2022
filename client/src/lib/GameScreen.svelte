<script>
  import {onMount} from 'svelte';
  export let gameState;
  // import { gameState } from './stores';
  let drawingBoardContainer;
  $gameState.round = 1;

  function DrawingBoard(opts) {
    console.log('opts', opts);
    // this function is based on:
    //  - https://dev.to/javascriptacademy/create-a-drawing-app-using-javascript-and-canvas-2an1
    //  - https://bencentra.com/code/2014/12/05/html5-canvas-touch-events.html
    if (!opts.container) {
      throw Error("ERROR: the given container element was not found!");
      return;
    }

    // add UI to page
    this.container = opts.container;
    this.container.innerHTML = `
        <style>
          .canvas-container { height: 100%; margin:  6px; }

          .canvas-container canvas { border:  1px solid #222; }

          .toolbar {
              display: inline-block;
              padding: 6px;
              padding-top: 12px;
              background-color: #202020;
              width:  100%;
              box-sizing: border-box;
          }

          .toolbar * {
              display: inline-block;
              margin-bottom: 6px;
              margin-right: 1rem;
              vertical-align: middle;
          }

          .toolbar label {
              font-size: 12px;
              min-width: 2rem;
              width: 2rem;
          }

          .toolbar button {
              background-color: #1565c0;
              border: none;
              border-radius: 4px;
              color:white;
              padding: 2px;
              width: 2.6rem;
          }

          .toolbar input {
              width: 2rem;
              height: 1.6rem;
          }
          .toolbar input[type=color] {
              height: 30px;
          }
        </style>
        <div class="toolbar">
          <label for="stroke">Stroke</label>
          <input id="stroke" name='stroke' type="color">
          <label for="lineWidth">Line Width</label>
          <input id="lineWidth" name='lineWidth' type="number" value="5">
          <button id="undo">Undo</button>
          <button id="clear">Clear</button>
        </div>
        <div class="canvas-container">
          <canvas></canvas>
        </div>`;

    // grab UI elements
    this.canvas = this.container.querySelector("canvas");
    this.toolbar = this.container.querySelector(".toolbar");

    // setup the canvas
    this.margin = 8;
    this.ctx = this.canvas.getContext("2d", {
      willReadFrequently: true,
      imageSmoothingQuality: "high",
    });
    this.canvasOffsetX = this.canvas.offsetLeft;
    this.canvasOffsetY = this.canvas.offsetTop;
    this.canvas.width = window.innerWidth - this.canvasOffsetX - this.margin;
    this.canvas.height = window.innerHeight - this.canvasOffsetY - this.margin;
    this.isPainting = false;
    this.lineWidth = 5;
    this.startX;
    this.startY;
    this.history = [];
    this.index = 0;

    // main drawing function
    this.render = (e) => {
      requestAnimationFrame(() => {
        if (!this.isPainting) return;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = "round";
        if (e.touches && e.touches[0]) {
          this.ctx.lineTo(
            e.touches[0].clientX - this.canvasOffsetX,
            e.touches[0].clientY - this.canvasOffsetY
          );
        } else {
          this.ctx.lineTo(
            e.clientX - this.canvasOffsetX,
            e.clientY - this.canvasOffsetY
          );
        }
        this.ctx.stroke();
      });
    };

    // enable undo/redo
    this.saveHistory = () => {
      if (!(this.index < this.history.length)) {
        this.history.push(
          this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        );
      }
      this.index += 1;
    };

    this.getFromHistory = () => {
      this.index = this.index === 0 ? 0 : this.index - 1;
      try {
        this.ctx.putImageData(this.history[this.index - 1], 0, 0);
        this.history.pop();
      } catch (err) {}
    };

    // add event listeners
    this.canvas.addEventListener("mousedown", (e) => {
      this.isPainting = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
    });

    this.canvas.addEventListener("mouseup", (e) => {
      this.isPainting = false;
      this.ctx.stroke();
      this.ctx.beginPath();
      this.saveHistory();
    });

    this.canvas.addEventListener("mousemove", this.render);

    // support touch events
    this.canvas.addEventListener(
      "touchstart",
      (e) => {
        this.isPainting = true;
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
        const mouseEvent = new MouseEvent("mousedown", {
          clientX: this.startX,
          clientY: this.startY,
        });
        this.canvas.dispatchEvent(mouseEvent);
      },
      { passive: true }
    );

    this.canvas.addEventListener(
      "touchend",
      (e) => {
        this.isPainting = false;
        this.ctx.stroke();
        this.ctx.beginPath();
        this.canvas.dispatchEvent(new MouseEvent("mouseup", {}));
      },
      { passive: true }
    );

    this.canvas.addEventListener("touchmove", this.render, { passive: true });

    // enable toolbar events
    this.toolbar.addEventListener("click", (e) => {
      if (e.target.id === "clear") {
        this.history.push(
          this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        );
        this.index += 1;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      if (e.target.id === "undo") {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.getFromHistory();
      }
    });

    this.toolbar.addEventListener("change", (e) => {
      if (e.target.id === "stroke") this.ctx.strokeStyle = e.target.value;
      if (e.target.id === "lineWidth") this.lineWidth = e.target.value;
    });

    // resize canvas on screen change
    window.addEventListener("resize", (e) => {
      requestAnimationFrame(() => {
        const img = this.ctx.getImageData(
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
        this.canvas.width =
          window.innerWidth - this.canvasOffsetX - this.margin;
        this.canvas.height =
          window.innerHeight - this.canvasOffsetY - this.margin;
        // Redraw everything after resizing the window
        this.ctx.putImageData(img, 0, 0);
      });
    });

    return this;
  }

  // Usage:
  //
  // const db1 = new DrawingBoard({
  //   container: document.querySelector('.some-elem'),
  // });

  onMount(() => {
    new DrawingBoard({container: drawingBoardContainer});
  });

</script>

<h1>Round: {$gameState.round}</h1>
<h2>Current user: {$gameState.currentUser}</h2>

  <div id={$gameState.currentUser} class="drawing-board" bind:this={drawingBoardContainer}/>
