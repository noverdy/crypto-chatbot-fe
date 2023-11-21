<script lang="ts">
	export let type: string;
	export let message: string;
</script>

<div class="flex items-start {type === 'user' ? 'justify-end' : 'justify-start'} text-black">
	{#if type === 'bot'}
		<img src="/bot.png" alt="Bot" class="w-6 mr-2" />
	{/if}
	<div
		class="bg-neutral-200/60 px-4 py-3 rounded-lg {type === 'user'
			? 'ml-96 rounded-tr-none'
			: 'mr-96 rounded-tl-none'}"
	>
		{message}
	</div>
	{#if type === 'user'}
		<img src="/user.png" alt="Bot" class="w-6 ml-2" />
	{/if}
</div>
