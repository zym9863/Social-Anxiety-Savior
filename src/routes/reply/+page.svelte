<script lang="ts">
	import MessageInput from '$lib/components/MessageInput.svelte';
	import ToneSelector from '$lib/components/ToneSelector.svelte';
	import ReplyCard from '$lib/components/ReplyCard.svelte';
	import {
		tones,
		inputMessage,
		selectedToneId,
		replyResults,
		setMessage,
		selectTone,
		clearMessage
	} from '$lib/stores/replyStore';
	import { MessageCircle } from 'lucide-svelte';
</script>

<div>
	<header class="mb-6">
		<div class="flex items-center gap-2 mb-1">
			<MessageCircle size={24} class="text-coral" />
			<h1 class="text-xl font-bold">回消息</h1>
		</div>
		<p class="text-sm text-text-secondary">粘贴收到的消息，帮你想好怎么回</p>
	</header>

	<MessageInput
		value={$inputMessage}
		onInput={setMessage}
		onClear={clearMessage}
	/>

	<div class="mt-4">
		<ToneSelector
			{tones}
			selectedId={$selectedToneId}
			onSelect={selectTone}
		/>
	</div>

	{#if $replyResults.length > 0}
		<div class="space-y-3 mt-4">
			<p class="text-sm text-text-secondary font-medium">
				试试这样回复
			</p>
			{#each $replyResults as reply, i (reply.text)}
				<ReplyCard
					text={reply.text}
					tip={reply.tip}
					index={i}
				/>
			{/each}
		</div>
	{:else if $inputMessage.trim()}
		<div class="mt-8 text-center text-text-light text-sm">
			<p>正在思考怎么回复...</p>
		</div>
	{:else}
		<div class="mt-8 text-center text-text-light text-sm">
			<p>把别人发给你的消息粘贴到上面</p>
			<p class="mt-1">我来帮你想想怎么回复</p>
		</div>
	{/if}
</div>
