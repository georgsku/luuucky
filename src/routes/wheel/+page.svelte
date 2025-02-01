<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<script>
	// @ts-nocheck
	import { confetti } from '@neoconfetti/svelte';
	import { onMount } from 'svelte';
	import Popover from '../Popover.svelte';

	let animation;
	let previousEndDegree = 0;

	let headline = $state("")
	let sectorCount = $state(12);
	let animationLength = $state(5);
	let animationRounds = $state(5);
	let showLabels = $state(true);
	let winningAnimation = $state(true);
	let highlightRed = $state(false);
	
	let showConfetti = $state(false);
	let winnerNumber = $state(0);

	onMount(() => {
		document.addEventListener("keydown", (event) => {
			if (event.key === "Enter") {
				event.preventDefault();
				spin();
			}
		})
	});


	function findSector(angle) {
		const chunkSize = 360 / sectorCount; 
		return (sectorCount - Math.floor((angle - chunkSize/2) / chunkSize) % sectorCount); 
	}

	function spin() {
  		const wheel = document.querySelector('.wheel>ul');

		showConfetti = false
		if (animation) {
			animation.cancel();
		}

		const number = Math.random()
		const randomAdditionalDegrees = number * 360 + 360*animationRounds;
		const newEndDegree = previousEndDegree + randomAdditionalDegrees;
		winnerNumber = findSector((newEndDegree - 90)%360)

		if (wheel) {

			animation = wheel.animate([
				{ transform: `rotate(${previousEndDegree}deg)` },
				{ transform: `rotate(${newEndDegree}deg)` }
			], {
				duration: animationLength * 1000,
				direction: 'normal',
				easing: 'cubic-bezier(0.285, 0.000, 0.175, 1.000)',
				fill: 'forwards',
				iterations: 1
			});
			
			previousEndDegree = newEndDegree;
		}

		setTimeout(() => {
			showConfetti = true
		}, animationLength * 1000 + 200)
	}

	function applySettingsToStates(settings) {
		headline = settings.headline
		sectorCount = settings.sections
		animationRounds = settings.animationRounds
		animationLength = settings.animationLength
		showLabels = settings.showLabels
		highlightRed = settings.highlightRed
		winningAnimation = settings.winningAnimation
	}


	function applySettingsToForm(settings) {
		document.getElementById('headlineInput').value = settings.headline;
		document.getElementById('sectionsInput').value = settings.sections;
		document.getElementById('speedInput').value = settings.animationRounds;
		document.getElementById('lengthInput').value = settings.animationLength;
		document.getElementById('toggleLabels').checked = settings.showLabels;
		document.getElementById('toggleRedSection').checked = settings.highlightRed;
		document.getElementById('toggleWinningAnimation').checked = settings.winningAnimation;
	}

  	function getSettingsFromForm() {
		return {
			headline: parseInt(document.getElementById('headlineInput').value, 10),
			sections: parseInt(document.getElementById('sectionsInput').value, 10),
			animationRounds: parseInt(document.getElementById('speedInput').value, 10),
			animationLength: parseInt(document.getElementById('lengthInput').value, 10),
			showLabels: document.getElementById('toggleLabels').checked,
			highlightRed: document.getElementById('toggleRedSection').checked,
			winningAnimation: document.getElementById('toggleWinningAnimation').checked,
		};
	}
</script>

<div class="max-w-screen-xl m-auto" >
	{#if headline}
		<h1 class="uppercase font-bold text-5xl mb-10">{headline}</h1>
	{/if}
	<div class="wheel" style="--_items: {sectorCount};">
		<ul>
			{#each Array.from({ length: sectorCount }) as _, index}
				<li style="--_idx:{index + 1};" class="{index === 0 && highlightRed ? "red" : "" }">
					{#if showLabels }
						{index + 1}
					{/if}
				</li>
			{/each}
		</ul>
		<div class="wheel-border"></div>
		<svg class="wheel-pin" width="135" height="143" viewBox="0 0 135 143" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M73.2237 20.8654C52.0018 20.843 34.7427 38.7732 34.627 60.8847C34.6151 67.5073 36.1807 74.0376 39.1942 79.9349L70.7619 139.949C70.9475 140.329 71.2346 140.651 71.5916 140.879C71.9485 141.107 72.3615 141.232 72.7848 141.24C73.2358 141.242 73.678 141.116 74.0609 140.878C74.4437 140.64 74.7517 140.298 74.9496 139.893L106.97 80.2533C109.959 74.3349 111.566 67.8151 111.668 61.1855C111.7 39.0202 94.4761 21.0258 73.2237 20.8654Z" fill="black" fill-opacity="0.22"/>
			<path d="M73.2473 15.0671C66.5883 15.0354 60.0355 16.736 54.2322 20.0018C48.429 23.2676 43.5747 27.9864 40.1461 33.6949C36.7174 39.4035 34.8321 45.9055 34.6753 52.5627C34.5186 59.2199 36.0957 65.8035 39.2519 71.6671L70.7695 129.157C70.9344 129.554 71.2167 129.89 71.5783 130.121C71.94 130.351 72.3637 130.466 72.7925 130.449C73.2306 130.449 73.6615 130.338 74.0453 130.126C74.4291 129.915 74.7533 129.61 74.9877 129.24L106.998 71.8473C109.998 66.2234 111.596 59.9585 111.656 53.5848C111.661 43.3867 107.619 33.6033 100.418 26.382C93.2172 19.1606 83.4453 15.0912 73.2473 15.0671Z" fill="#333"/>
			<path d="M65.0051 45.6344C64.4628 46.9404 64.2255 48.3529 64.3113 49.7644C64.397 51.176 64.8034 52.5494 65.4998 53.7803L66.8394 55.5845C67.3622 56.0561 67.9178 56.49 68.5019 56.8831C69.7463 57.6654 71.167 58.1236 72.634 58.2157C74.0426 58.2558 75.4416 57.9718 76.7231 57.3856C77.7215 56.9976 78.6267 56.4029 79.3793 55.6406L80.1397 54.8211C81.0379 53.7001 81.6409 52.372 81.8939 50.958C82.1611 49.5536 82.0655 48.1041 81.6161 46.747C81.2914 45.3206 80.5513 44.0224 79.4892 43.0165C78.4921 42.002 77.2563 41.254 75.8952 40.8409C74.4999 40.3713 73.0056 40.2766 71.5622 40.5663C70.1499 40.7573 68.8228 41.3519 67.7403 42.2789L66.9494 42.9604C66.183 43.7594 65.5289 44.6589 65.0051 45.6344Z" fill="#CCCCCC"/>
		</svg>
			
		<button onclick={spin}>SPIN</button>
	</div>
</div>

{#if winningAnimation && showConfetti}
	<div
		style="position: absolute; left: 50%; top: 30%"
		use:confetti={{
			particleCount: undefined,
			force: 0.7,
			stageWidth: window.innerWidth,
			stageHeight: window.innerHeight,
			colors: ['#ff3e00', '#40b3ff', '#676778']
		}}
	></div>
{/if}

<Popover name="luckyWheel" applySettingsToStates={applySettingsToStates} getSettingsFromForm={getSettingsFromForm} applySettingsToForm={applySettingsToForm} >
	<label>Headline</label>
	<input id="headlineInput" type="text" bind:value={headline}>
	<br>
	<label>Sections</label>
	<input id="sectionsInput" type="number" min="4" bind:value={sectorCount}>
	<br>
	<label>Animation rounds</label>
	<input id="speedInput" type="number" min="1" max="10" bind:value={animationRounds}>
	<br>
	<label>Animation Length</label>
	<input id="lengthInput" type="number" min="1" max="10" bind:value={animationLength}> (seconds)
	<br>
	<label>Show Labels in Wheel</label>
	<input id="toggleLabels" type="checkbox" bind:checked={showLabels}>
	<br>
	<label>Highlight Red Section</label>
	<input id="toggleRedSection" type="checkbox" bind:checked={highlightRed}>
	<br>
	<label>Enable Winning Animation</label>
	<input id="toggleWinningAnimation" type="checkbox" bind:checked={winningAnimation}>
</Popover>


<style>
	:global(.app[data-scale="1x"] .wheel) {
		width: 40vmin;
	}
	:global(.app[data-scale="2x"] .wheel) {
		width: 60vmin;
	}
	:global(.app[data-scale="3x"] .wheel) {
		width: 80vmin;
	}

	.wheel {
		all: unset;
		aspect-ratio: 1 / 1;
		container-type: inline-size;
		direction: ltr;
		display: grid;
		position: relative;
		width: 40vmin;
		margin: auto;
		
		& > * { position: absolute; }

		.wheel-border {
			border: 10px solid var(--main-900);
			inset: 0;
			border-radius: 9999px;
		}

		.wheel-pin {
			height: 5rem;
			position: absolute;
			top: 0;
			left: 50%;
			transform: translate(-50%, -50%);
		}

		button {
			aspect-ratio: 1 / 1;
			color: var(--red);
			background: hsla(0, 0%, 100%, 0.8);
			border: 0;
			border-radius: 50%;
			cursor: pointer;
			font-size: 5cqi;
			place-self: center;
			width: 20cqi;
		}

		ul {
			all: unset;
			clip-path: inset(0 0 0 0 round 50%);
			display: grid;
			inset: 0;
			place-content: center start;

			li {
				align-content: center;
				aspect-ratio: 1 / calc(2 * tan(180deg / var(--_items)));
				background: hsl(calc(360deg / var(--_items) * calc(var(--_idx))), 100%, 75%);
				clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
				display: grid;
				font-size: 5cqi;
				grid-area: 1 / -1;
				padding-left: 1ch;
				rotate: calc(360deg / var(--_items) * calc(var(--_idx) - 1));
				transform-origin: center right;
				user-select: none;
				width: 50cqi;

				&:nth-child(even) {background: var(--main-700);}
				&:nth-child(odd) {background: var(--secondary-white); color: var(--main-700);}

				&.red {
					background: var(--red);
					color: white;
				}
			}
		}
	}
</style>
