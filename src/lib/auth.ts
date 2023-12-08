import { writable } from 'svelte/store';

export const guildName = 'caffeinated';
export const locale = 'en_GB';
export const server = 'crusader-strike';
export const serverId = 5828;
export const region = 'eu';
export const namespace = '-classic1x-' + region;
export const bearerToken = writable(null);
export let authHeader: string | null = '';


bearerToken.subscribe((value) => {
    authHeader = value ? `Bearer ${value}` : '';
});
