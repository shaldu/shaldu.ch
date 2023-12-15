<script lamg="ts">
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
	import { sessionStore } from '$lib/stores';

	$: sessionStore
	
</script>

<h1>SvelteKit Auth Example</h1>
<p>
	{#if $sessionStore }
		{#if $sessionStore.user?.image}
			<picture>
				<img width="50px" src="{$sessionStore.user.image}" alt="">				
			</picture>
		{/if}
		<span class="signedInText">
			<small>Signed in as</small><br />
			<strong>{$sessionStore.user?.name ?? 'User'}</strong>
		</span>
		<button on:click={() => signOut()} class="button">Sign out</button>
	{:else}
		<span class="notSignedInText">You are not signed in</span>
		<button on:click={() => signIn('github')}>Sign In with GitHub</button>
	{/if}
</p>
