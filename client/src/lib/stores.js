import { writable } from "svelte/store";

export const gameState = writable({
	scene: null,
});