<script lang="ts">
	import type { Cards } from '@prisma/client';
	import { Tabs, Tab, TabContent } from 'carbon-components-svelte';
	import Card from './Card.svelte';
	import CardSkeleton from './CardSkeleton.svelte';

	let fetchCardPromiseEasy = fetchNewCard('easy');
	let fetchCardPromiseHard = fetchNewCard('hard');
	let fetchCardPromiseNew = fetchNewCard('new');
	let fetchCardPromiseAll = fetchNewCard('all');

	let fetchAllCardsPromise = fetchAllCards('everything');

	async function fetchNewCard(mode: 'new' | 'easy' | 'hard' | 'all' = 'new') {
		const url = '/api/auth/cards?mode=' + mode;
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			const responseData = await response.json();
			const data = responseData.card as Cards;

			return data;
		} else {

			throw new Error('Failed to fetch new card');
		}
	}

	async function fetchAllCards(mode: 'new' | 'easy' | 'hard' | 'all' | 'everything' = 'everything') {
		const url = '/api/auth/cards?mode=' + mode;
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			const responseData = await response.json();
			const data = responseData.card as Cards[];
			return data;
		} else {
			throw new Error('Failed to fetch new card');
		}
	}

	async function deleteCard(id: string) {
		const url = '/api/auth/cards?id=' + id;
		const response = await fetch(url, {
			method: 'DELETE'
		});

		if (response.ok) {
			fetchAllCardsPromise = fetchAllCards('everything');
		} else {
			console.error('Failed to delete card');
		}
	}

	async function cardPutResult(card:Card, result: 'easy' | 'medium' | 'hard') {
		const url = '/api/auth/cards';
		const cardId = card.id
		const knowledgeScore = card.knowledgeScore
		const repeats = card.repeats
		const data = { cardId, result, knowledgeScore, repeats};
		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		if (response.ok) {
						
		} else {
			console.error('Failed to put result');
		}
		
	}

	const cardFinish = async (card: Card, result: 'easy' | 'medium' | 'hard', mode: 'new' | 'easy' | 'hard' | 'all') => {

		await cardPutResult(card, result);
		newCard(mode);
	};

	const newCard = (mode: 'new' | 'easy' | 'hard' | 'all') => {

		if (mode == 'easy') {
			fetchCardPromiseEasy = fetchNewCard(mode);
		}
		if (mode == 'hard') {
			fetchCardPromiseHard = fetchNewCard(mode);
		}
		if (mode == 'new') {
			fetchCardPromiseNew = fetchNewCard(mode);
		}
		if (mode == 'all') {
			fetchCardPromiseAll = fetchNewCard(mode);
		}

	};
</script>

<div class="card h-100">
	<div class="card-body h-100">
		<div class="row justify-content-between h-100">
			<div class="col-12">
				<Tabs>
					<Tab label="All" />
					<Tab label="Easy" />
					<Tab label="Hard" />
					<Tab label="New" />
					<Tab label="Edit" />
					<svelte:fragment slot="content">
						<TabContent>
							{#await fetchCardPromiseAll}
								<CardSkeleton />
							{:then card}
								{#if card}
									<Card {card} cardFinished={cardFinish} mode="all" {newCard} />
								{:else}
									<p>No cards</p>
								{/if}
							{/await}
						</TabContent>
						<TabContent>
							{#await fetchCardPromiseEasy}
								<CardSkeleton />
							{:then card}
								{#if card}
									<Card {card} cardFinished={cardFinish} mode="easy" {newCard} />
								{:else}
									<p>No cards</p>
								{/if}
							{/await}
						</TabContent>
						<TabContent>
							{#await fetchCardPromiseHard}
								<CardSkeleton />
							{:then card}
								{#if card}
									<Card {card} cardFinished={cardFinish} mode="hard" {newCard} />
								{:else}
									<p>No cards</p>
								{/if}
							{/await}
						</TabContent>
						<TabContent>
							{#await fetchCardPromiseNew}
								<CardSkeleton />
							{:then card}
								{#if card}
									<Card {card} cardFinished={cardFinish} mode="new" {newCard} />
								{:else}
									<p>No cards</p>
								{/if}
							{/await}
						</TabContent>
						<TabContent>
							{#await fetchAllCardsPromise}
								<p>Loading...</p>
							{:then cards}
								{#if cards}
									<div class="cord-collection-list">
										{#each cards as card}
											<!-- edit cards here with delete possability -->
											<div class="card mb-2">
												<div class="card-body">
													<h5 class="card-title">{card.title}</h5>
													<p class="card-text">{card.definition}</p>
													<button class="btn btn-danger" on:click={() => deleteCard(card.id)}
														>Delete</button
													>
												</div>
											</div>
										{/each}
									</div>
								{:else}
									<p>No cards</p>
								{/if}
							{/await}
						</TabContent>
					</svelte:fragment>
				</Tabs>
			</div>
		</div>
	</div>
</div>
