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
    let score: any | null = null;

    let isFlipped: boolean = false;



    onMount(() => {
        function valueToColor(value: number) {
            if (value < 0) value = 0;
            if (value > 100) value = 100;

            // Calculate red and green components
            let red = Math.round(255 - (value * 2.55));
            let green = Math.round(value * 2.55);

            // Return the color in RGB format
            return `rgb(${red}, ${green}, 0)`;
        }
        
        if (!parentElm) return;
        cardNormal = parentElm.querySelector('.card-1');
        cardFlipped = parentElm.querySelector('.card-2');
        rotaterRef = parentElm.querySelectorAll('.card .header > div');
        score = parentElm.querySelectorAll('.card .header .score');

        score.forEach((score:HTMLElement) => {
            //calculate the score color from 0 - 100 red to green
            if (card.knowledgeScore <= 0) return;
            score.style.color = valueToColor(card.knowledgeScore);
        });

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
                {#if card.knowledgeScore <= 0}
                    <span class="isnew">NEW</span>
                {:else}
                    <span class="score">{card.knowledgeScore} %</span>
                {/if}
            </div>
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
            <div class="difficulty"></div>
        </div>
    </div>
    <div class="card card-2">
        <div class="header">
            <div>
                {#if card.knowledgeScore <= 0}
                    <span class="isnew">NEW</span>
                {:else}
                    <span class="score">{card.knowledgeScore} %</span>
                {/if}
            </div>
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
                <Button size="small" kind="secondary" on:click={cardFinished(card, 'easy', mode )} class="easy" >Easy</Button>
                <Button size="small" kind="secondary" on:click={cardFinished(card, 'medium', mode )} class="medium">Medium</Button>
                <Button size="small" kind="secondary" on:click={cardFinished(card, 'hard', mode )} class="hard">Hard</Button>                
            </div>
        </div>
    </div>
 
    <Button on:click={newCard(mode)} kind="primary" class="new" >New card</Button>

</div>