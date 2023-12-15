import type { Session } from "@auth/core/types";
import { writable, readable, type Writable } from "svelte/store";


export const sessionStore: Writable<Session | null> = writable();
