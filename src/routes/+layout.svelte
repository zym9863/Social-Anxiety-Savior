<script lang="ts">
	import '../app.css';
	import NavBar from '$lib/components/NavBar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>社恐拯救者</title>
	<meta name="description" content="帮助社交焦虑人群应对日常社交场景" />
	<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="min-h-svh bg-warm-bg text-text-primary font-sans selection:bg-coral selection:text-white">
	<div class="fixed inset-0 pointer-events-none opacity-20" style="background-image: radial-gradient(#1A1A1A 1px, transparent 1px); background-size: 24px 24px;"></div>
	<main class="relative z-10 max-w-lg mx-auto px-4 pt-8 pb-32">
		{@render children()}
	</main>
	<NavBar />
</div>
