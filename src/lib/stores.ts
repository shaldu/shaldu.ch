import type { Session } from "@auth/core/types";
import { writable, readable, type Writable } from "svelte/store";

export type CustomSession = Session & {
    account: {
        id: string;
        githubId: string;
        lastUrl: string;
    };
}

export const sessionStore: Writable<CustomSession | null> = writable();
export const collectionIdStore: Writable<string | null | undefined> = writable();
export const pdfFileIdsStore: Writable<string[] | null | undefined> = writable();
export const selectedPdfFileIdStore: Writable<string | null | undefined> = writable();
