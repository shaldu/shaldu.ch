import type { Session } from "@auth/core/types";
import { writable, readable, type Writable } from "svelte/store";

type CustomSession = Session & {

}

export const sessionStore: Writable<CustomSession | null> = writable();
