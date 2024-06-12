<script lang="ts">
	import type { Cards } from '@prisma/client';
	import { Tabs, Tab, TabContent } from 'carbon-components-svelte';
	import Card from './Card.svelte';
	import CardSkeleton from './CardSkeleton.svelte';

	let fetchCardPromiseEasy = fetchNewCard('easy');
	let fetchCardPromiseHard = fetchNewCard('hard');

	let fetchAllCardsPromise = fetchAllCards('all');

	async function fetchNewCard(mode: 'new' | 'easy' | 'hard' | 'all' = 'new') {
		const url = '/api/auth/cards?mode=' + mode;
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			const data = (await response.json()) as Cards;
			return data;
		} else {
			throw new Error('Failed to fetch new card');
		}
	}

	async function fetchAllCards(mode: 'new' | 'easy' | 'hard' | 'all' = 'all') {
		const url = '/api/auth/cards?mode=' + mode;
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			const data = (await response.json()) as Cards[];
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
			fetchAllCardsPromise = fetchAllCards('all');
		} else {
			console.error('Failed to delete card');
		}
	}

	async function cardPutResult(cardId:string, result: 'easy' | 'medium' | 'hard') {
		const url = '/api/auth/cards';
		const data = { cardId, result };
		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		if (response.ok) {
			console.log('Result put');			
		} else {
			console.error('Failed to put result');
		}
		
	}

	const cardFinish = async (cardId: string, result: 'easy' | 'medium' | 'hard', mode: 'new' | 'easy' | 'hard' | 'all') => {

		await cardPutResult(cardId, result);
		newCard(mode);
	};

	const newCard = (mode: 'new' | 'easy' | 'hard' | 'all') => {
		if (mode == 'easy') {
			fetchCardPromiseEasy = fetchNewCard(mode);
		}
		if (mode == 'hard') {
			fetchCardPromiseHard = fetchNewCard(mode);
		}

	};
</script>

<div class="card h-100">
	<div class="card-body h-100">
		<div class="row justify-content-between h-100">
			<div class="col-12">
				<Tabs>
					<Tab label="Easy" />
					<Tab label="Hard" />
					<Tab label="New" />
					<Tab label="All" />
					<svelte:fragment slot="content">
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
							{#await fetchCardPromiseEasy}
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
