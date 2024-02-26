import { writable } from 'svelte/store';


export async function updateLastUrl() {
    const url = new URL(window.location.href);
    const requestUrl = '/api/auth/account';
    const data = {
        url: url.toString()
    };

    await fetch(requestUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then((response) => response.json())
        .then((data) => {
            // console.log('Success:', data);
        })
        .catch((error) => {
            // console.error('Error:', error);
        });
}