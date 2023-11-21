<script lang="ts">
	export let data: {
		derivedKey: string;
		publicKey: string;
	};

	import CryptoJS from 'crypto-js';
	import ChatBubble from '$lib/components/ChatBubble.svelte';
	import { messages } from '$lib/stores';
	import { onMount } from 'svelte';

	let message = '';
	let active = true;

	let chatbox: HTMLDivElement;

	onMount(() => {
		scrollToBottom();
	});

	function scrollToBottom() {
		setTimeout(() => {
			chatbox.scrollTo({
				top: chatbox.scrollHeight,
				behavior: 'smooth'
			});
		}, 200);
	}

	function resetChat() {
		messages.set([]);
	}

	function sendChat() {
		messages.update((curr) => [
			...curr,
			{
				type: 'user',
				message: message.trim()
			}
		]);
		active = false;
		scrollToBottom();

		const encrypted = CryptoJS.AES.encrypt(message, CryptoJS.enc.Hex.parse(data.derivedKey), {
			mode: CryptoJS.mode.ECB,
			format: CryptoJS.format.Hex
		}).ciphertext.toString();
		message = '';

		fetch(`${import.meta.env.VITE_API_URL}/respond`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				public_key: data.publicKey,
				message: encrypted
			})
		})
			.then((res) => res.json())
			.then((res) => {
				const message = res.response as string;
				const decrypted = CryptoJS.AES.decrypt(message, CryptoJS.enc.Hex.parse(data.derivedKey), {
					mode: CryptoJS.mode.ECB,
					format: CryptoJS.format.Hex
				});

				messages.update((curr) => [
					...curr,
					{
						type: 'bot',
						message: decrypted.toString(CryptoJS.enc.Utf8)
					}
				]);
				active = true;
				scrollToBottom();
			});
	}
</script>

<div class="h-full p-10">
	<div class="h-full flex rounded-xl overflow-hidden text-white shadow">
		<content class="bg-violet-950 py-8 flex flex-col w-96">
			<div class="grow flex flex-col items-center font-bold">
				<img src="/user.png" draggable="false" alt="User" class="w-20 mb-2" />
				<p>User</p>
			</div>
			<div class="flex px-8 justify-between">
				<a href="/">← Back</a>
				<button on:click={resetChat}>Reset</button>
			</div>
		</content>
		<content class="bg-violet-500/50 w-full backdrop-blur p-8 flex flex-col">
			<div class="grow flex flex-col gap-6 overflow-y-auto mb-2" bind:this={chatbox}>
				{#each $messages as chat}
					<ChatBubble {...chat} />
				{/each}
			</div>
			<form
				on:submit|preventDefault={sendChat}
				class="bg-violet-950 px-4 rounded-md border-transparent focus-within:border-violet-400 border-2 flex items-center {!active &&
					'animate-pulse'}"
			>
				<input
					disabled={!active}
					bind:value={message}
					type="text"
					placeholder={active ? 'Send a message...' : 'Please wait...'}
					class="bg-transparent py-4 outline-none grow"
					required
				/>
				<button type="submit" class="ml-2" disabled={!active}>
					<img src={active ? '/send.png' : 'loading.png'} alt="Send message" class="w-5 invert" />
				</button>
			</form>
		</content>
	</div>
</div>
