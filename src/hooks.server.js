
import { bearerToken } from '$lib/auth';
import { CLIENT_ID } from '$env/static/private';
import { CLIENT_SECRET } from '$env/static/private';

// Function to fetch the bearer token from the API
async function fetchBearerToken() {
    try {

        const response = await fetch('https://eu.battle.net/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
            },
            body: 'grant_type=client_credentials',
        });
        // console.log(response);
        if (response.ok) {
            const data = await response.json();
            bearerToken.set(data.access_token);
        } else {
            console.error('Failed to fetch bearer token');
        }
    } catch (error) {
        console.error('Error fetching bearer token:', error);
    }
}

// Call the fetchBearerToken function to retrieve the bearer token
fetchBearerToken();

// rerun fetchBearerToken every 24h
setInterval(fetchBearerToken, 1000 * 60 * 60 * 24);