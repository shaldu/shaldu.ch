import { authHeader } from "$lib/auth";

export async function load({ cookies }) {

    if (authHeader === null || authHeader === '') return {'loading': true};  
    return {'loading': false}

}