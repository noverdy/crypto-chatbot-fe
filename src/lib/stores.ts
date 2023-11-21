import { persisted } from 'svelte-local-storage-store';

interface Message {
	type: string;
	message: string;
}

export const messages = persisted<Message[]>('messages', [
	{
		type: 'bot',
		message: 'Hello! Start chatting by writing your message below.'
	}
]);
