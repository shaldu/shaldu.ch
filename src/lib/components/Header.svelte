<script lang="ts">
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

	function redirectHome() {
		window.location.href = '/';
	}

</script>

<Header on:click={redirectHome} bind:isSideNavOpen>
	<span slot="platform">☁︎</span>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderNav class="w-100 main-nivagtion-bar">
		{#if $sessionStore?.user}
			<div class="main-navigation-bar-left">
				<HeaderNavItem href="/" text="Home" />
				<HeaderNavItem href="/cards" text="Cards" />
				<HeaderNavItem href="/alphabet" text="Alphabet" />
			</div>
			<div class="main-navigation-bar-right">
				{#if $sessionStore?.user?.image}
					<HeaderNavItem class="mini-user-profile-wrapper" href="/profile">
						<div class="mini-user-profile">
							<!-- <span><strong>{$sessionStore?.user?.name}</strong></span> -->
							<img src={$sessionStore?.user?.image} alt="avatar" class="avatar" />
						</div>
					</HeaderNavItem>
				{/if}

				<HeaderNavItem href="" on:click={() => signOut()} text="Logout" />
			</div>
		{:else}
			<div class="main-navigation-bar-left"></div>
			<div class="main-navigation-bar-right">
				<HeaderNavMenu text="Login">
					<HeaderNavItem on:click={() => signIn('github')} text="Sign In with Github" />
					<!-- <HeaderNavItem href="/" text="Sign In with Google" /> -->
				</HeaderNavMenu>
			</div>
		{/if}
	</HeaderNav>
</Header>
