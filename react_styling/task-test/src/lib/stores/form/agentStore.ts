import { writable } from 'svelte/store';
import type { FormStore } from '$lib/types';

// Fonction pour créer un nouvel état initial à chaque fois
const getInitialFormState = (): FormStore => ({
    errors: {},
    values: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        team: ''
    }
});

export const formStore = writable<FormStore>(getInitialFormState());

export function resetFormStore(): void {    
    formStore.set(getInitialFormState());
}

export const userSelectedStore = writable(null);

export function resetUserSelectedStore(): void {    
    userSelectedStore.set(null);
}