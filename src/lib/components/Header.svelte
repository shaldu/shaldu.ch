<script lamg="ts">
	import { sessionStore } from '$lib/stores';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import {
		Header,
		HeaderNav,
		HeaderNavItem,
		HeaderNavMenu,
		SkipToContent
	} from 'carbon-components-svelte';

	let isSideNavOpen = false;

	$: sessionStore;
</script>

<Header company="" platformName="Shaldu" bind:isSideNavOpen>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderNav class="justify-content-end d-flex w-100 login-menu">
		{#if $sessionStore?.user}
			<!-- <HeaderNavItem href="/dashboard" text="Dashboard" />
			<HeaderNavItem href="/profile" text="Profile" /> -->
			<HeaderNavItem href="" on:click={() => signOut()} text="Logout" />
		{:else}
			<HeaderNavMenu text="Login">
				<HeaderNavItem on:click={() => signIn('github')} text="Sign In with Github" />
				<HeaderNavItem href="/" text="Sign In with Google" />
			</HeaderNavMenu>
		{/if}
	</HeaderNav>
</Header>
