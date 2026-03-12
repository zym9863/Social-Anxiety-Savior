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

<div class="pb-10">
	<header class="mb-8 brutal-border brutal-shadow bg-mint text-text-primary p-6 rounded-[var(--radius-card)]">
		<div class="flex items-center gap-3 mb-2">
			<div class="bg-white p-2 rounded-full brutal-border brutal-shadow transform rotate-6">
				<MessageCircle size={28} strokeWidth={2.5} class="text-mint" />
			</div>
			<h1 class="text-3xl font-black tracking-tight" style="text-shadow: 2px 2px 0px white;">回消息</h1>
		</div>
		<p class="font-bold text-sm border-t-2 border-text-primary/20 pt-2 mt-2">
			不知道怎么回？直接复制过来，帮你搞定！
		</p>
	</header>

	<div class="space-y-6">
		<MessageInput
			value={$inputMessage}
			onInput={setMessage}
			onClear={clearMessage}
		/>

		<div class="animate-in fade-in slide-in-from-bottom-2 delay-150">
			<ToneSelector
				{tones}
				selectedId={$selectedToneId}
				onSelect={selectTone}
			/>
		</div>
	</div>

	{#if $replyResults.length > 0}
		<div class="mt-10 space-y-4">
			<div class="inline-block bg-coral text-white font-black px-4 py-1.5 rounded-full brutal-border brutal-shadow transform -rotate-2 mb-2">
				试试这几句 👇
			</div>
			<div class="space-y-4">
			{#each $replyResults as reply, i (reply.text)}
				<ReplyCard
					text={reply.text}
					tip={reply.tip}
					index={i}
				/>
			{/each}
			</div>
		</div>
	{:else if $inputMessage.trim()}
		<div class="mt-10 p-6 brutal-border bg-white rounded-[var(--radius-card)] text-center brutal-shadow animate-pulse">
			<p class="text-xl font-black mb-1">🧠 疯狂思考中...</p>
			<p class="text-sm text-text-secondary">马上就有完美回复了</p>
		</div>
	{:else}
		<div class="mt-10 text-center">
			<div class="inline-block p-6 brutal-border bg-lavender/30 rounded-[var(--radius-card)] brutal-shadow rotate-2">
				<p class="text-lg font-bold mb-2">👈 把那条让你头秃的消息</p>
				<p class="font-medium text-text-secondary">直接粘贴到上面的框框里！</p>
			</div>
		</div>
	{/if}
</div>
