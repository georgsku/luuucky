<script>
	import Footer from './Footer.svelte';
	import { onMount } from 'svelte';
	import '../app.css';

	let { children } = $props();

	let timer;

	onMount(() => {
		timer = setTimeout(addFadeOutClass, 3000);
		document.addEventListener('mousemove', resetTimer);
	});

	function addFadeOutClass() {
		document.querySelectorAll('[data-auto-hide="true"]').forEach(element => {
			element.classList.add('fadeOut');
			element.classList.remove('fadeIn');
		});
	}

	function addFadeInClass() {
		document.querySelectorAll('[data-auto-hide="true"]').forEach(element => {
			element.classList.add('fadeIn');
			element.classList.remove('fadeOut');
		});
	}

	function resetTimer() {
		clearTimeout(timer);
		addFadeInClass();
		timer = setTimeout(addFadeOutClass, 3000);
	}

</script>

<div class="app" >
	<main>
		{@render children()}
	</main>

	<Footer />
</div>

<style global>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100vw;
		height: 100vh;
		margin: 0 auto;
		box-sizing: border-box;
		position: relative;
		overflow: hidden;
	}

</style>
