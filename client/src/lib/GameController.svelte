<script>
    import GameScreen from './GameScreen.svelte';
    import VotingScreen from './VotingScreen.svelte';
    import Scoreboard from './Scoreboard.svelte';
    import { gameState } from './stores';

    

</script>

{#if $gameState.scene === 1 }
<GameScreen />
{:else if $gameState.scene === 2}
<VotingScreen />
{:else if $gameState.scene === 3}
<Scoreboard />
{/if}