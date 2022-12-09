<script>
    import GameScreen from './GameScreen.svelte';
    import VotingScreen from './VotingScreen.svelte';
    import Scoreboard from './Scoreboard.svelte';
    import { gameState } from './stores';
    import { navigate } from 'svelte-navigator';

    
    if ($gameState.currentUser === null) window.location.href = `/lobby${window.location.hash}`;
</script>

{#if $gameState.scene === 1 }
    <GameScreen {gameState} />
{:else if $gameState.scene === 2}
    <VotingScreen />
{:else if $gameState.scene === 3}
    <Scoreboard />
{/if}
