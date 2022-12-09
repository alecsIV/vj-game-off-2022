import { writable } from "svelte/store";

export const gameState = writable({
	scene: null,
	players: [],
	round: 0,
	currentUser: null
});
