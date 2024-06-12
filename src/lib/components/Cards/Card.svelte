<script lang="ts">
	import type { Cards } from "@prisma/client";
	import { Button } from "carbon-components-svelte";
    import Rotate from "carbon-icons-svelte/lib/Rotate.svelte";
	import { onMount } from "svelte";


    export let mode: "new" | "easy" | "hard" | "all" = "new";
    export let card: Cards;
    export let cardFinished: Function;
    export let newCard: Function;

    let parentElm: HTMLElement | null = null;

    let cardNormal: HTMLElement | null = null;
    let cardFlipped: HTMLElement | null = null;
    let rotaterRef: any | null = null;

    let isFlipped: boolean = false;

    onMount(() => {
        if (!parentElm) return;
        cardNormal = parentElm.querySelector('.card-1');
        cardFlipped = parentElm.querySelector('.card-2');
        rotaterRef = parentElm.querySelectorAll('.card .header > div');

        cardNormal?.addEventListener('click', (elm) => {
            
            cardNormal?.classList.toggle('show');
            cardFlipped?.classList.toggle('show');
            isFlipped = !isFlipped;
        });

        rotaterRef?.forEach((rotater:HTMLElement) => {
            rotater.addEventListener('click', () => {
                cardNormal?.classList.toggle('show');
                cardFlipped?.classList.toggle('show');
                isFlipped = !isFlipped;
            });
        });

    });

</script>

<div class="learncard-wrapper" bind:this={parentElm}>
    <div class="card show card-1">
        <div class="header">
            <div>
                <Rotate />
            </div>
        </div>
        <div class="content">
            <div class="content-text">
               <h4>{card.title}</h4>
            </div>
        </div>
        <div class="footer">
            
        </div>
    </div>
    <div class="card card-2">
        <div class="header">
            <div>
                <Rotate />
            </div>
        </div>
        <div class="content">
            <div class="content-text">
               <h4>{card.definition}</h4>
            </div>
        </div>
        <div class="footer">
            <div class="difficulty">
                <Button size="small" kind="secondary" on:click={cardFinished(card.id, 'easy', mode )} class="easy" >Easy</Button>
                <Button size="small" kind="secondary" on:click={cardFinished(card.id, 'medium', mode )} class="medium">Medium</Button>
                <Button size="small" kind="secondary" on:click={cardFinished(card.id, 'hard', mode )} class="hard">Hard</Button>                
            </div>
        </div>
    </div>
    {#if isFlipped }
        <Button on:click={newCard(mode)} kind="primary" class="new" >New card</Button>
    {/if}
</div>