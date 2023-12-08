import type Page from "../../+page.svelte";
import { authHeader, locale, namespace, region, server } from "$lib/auth";

export async function POST({ request }: { request: Request}) {
    const data = await request.formData()
    const characterName = data.get('characterName') as string;
    
    //sanitize the input, remove spaces and special characters and numbers make it lowercase
    const characterNameSanitized = characterName.replace(/[^a-zA-Z]/g, '').toLowerCase();

    let characterData = {};

    const characterInfoData: {} | null = await getCharacterInfo(characterNameSanitized);
    const characterStatData: {} | null = await getCharacterStats(characterNameSanitized);
    
    if (characterStatData === null || characterInfoData === null) {
        const options: ResponseInit = {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 404,
        };
    
        return new Response(JSON.stringify({ message: "Not found", data: null }), options);        
    }

    const options: ResponseInit = {
        headers: {
            'Content-Type': 'application/json',
        },
        status: 200,
    };


    //combine the two objects
    characterData = {...characterInfoData, ...characterStatData};

    return new Response(JSON.stringify({ message: "Good!", data: characterData }), options);        
}

async function getCharacterStats(characterName: string) {
    const url = `https://${region}.api.blizzard.com/profile/wow/character/${server}/${characterName}/statistics`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': authHeader,
            'Battlenet-Namespace': 'profile' + namespace,
            'locale': locale
        } as any,
    });
    const data = await response.json();

    if ( response.status == 200) {
        return data;
    }
    
    return null;
}

async function getCharacterInfo(characterName: string) {
    const url = `https://${region}.api.blizzard.com/profile/wow/character/${server}/${characterName}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': authHeader,
            'Battlenet-Namespace': 'profile' + namespace,
            'locale': locale
        } as any,
    });
    const data = await response.json();

    if ( response.status == 200) {
        return data;
    }
    
    return null;
}

async function getRealms() {

    const response = await fetch('https://eu.api.blizzard.com/data/wow/search/realm', {
        method: 'GET',
        headers: {
            'Authorization': authHeader,
            'Battlenet-Namespace': 'static' + namespace,
            'locale': locale
        } as any,
    });
    if ( response.status !== 200) {
        console.log('error', response.status, response.statusText);
        
        return;
    }
    
    const data = await response.json();
    console.log(data.results);
}