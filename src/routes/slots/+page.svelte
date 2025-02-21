<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>



<script>
	// @ts-nocheck
	import { confetti } from '@neoconfetti/svelte';
	import { onMount } from 'svelte';
	import Popover from '../Popover.svelte';
	import BezierEasing from 'bezier-easing';

	import "../slots.scss"

	onMount(() => {
		document.addEventListener("keydown", (event) => {
			if (event.key === "Enter") {
				event.preventDefault();
				start();
			}
		})
	});

	let fireConfetti = $state(false);
	let winningAnimation = $state(true);
	let preAnimation = $state(true);
	
	let columnsCount = $state(3)
	let rowCount = $state(5)
	let totalDuration = $state(5);
	let totalFrame = $derived(totalDuration * 60)
	
	let slotContainers = []; // Store data for each slot container
	let inAnimation = false;

	function initializeContainers() {
		const containers = document.querySelectorAll(".slot-container");
		slotContainers = Array.from(containers).map((container, index) => {
			return {
				element: container,
				uls: container.querySelectorAll("ul"),
				randomTransform: 1000,
				currentTime: 0,
				increment: 1 / totalFrame,
			};
		});
	}

	function start() {
		if (inAnimation) return;
		inAnimation = true;

		initializeContainers()
		preAnimation = false

		slotContainers.forEach((_, index) => {
			setTimeout(() => {
				spin(index);
			}, index * 500); 
		});
	}


	function spin(containerIndex) {
		const containerData = slotContainers[containerIndex];

		if (!containerData) return;
		const random = Math.floor(Math.random() * 10) / 10;
		containerData.randomTransform += random * 100;

		anim(containerIndex);
	}

	const bezier = (t, initial, p1, p2, final) => {
		return (1 - t) * (1 - t) * (1 - t) * initial + 3 * (1 - t) * (1 - t) * t * p1 + 3 * (1 - t) * t * t * p2 + t * t * t * final;
	};

	const easing = BezierEasing(0.2, 0, 0.6, 1)

	function anim(containerIndex) {
		const containerData = slotContainers[containerIndex];
		if (!containerData) return;

		const { currentTime, increment, randomTransform, uls } = containerData;

		if (currentTime * totalDuration >= totalDuration) {
			cancelAnimationFrame(containerData.frame);
			inAnimation = false;
		} else {
			let bezier = easing(containerData.currentTime)
			let currentValue = 100 - (bezier * randomTransform % 100); 

			containerData.currentTime += containerData.increment;

			Array.from(uls).forEach((ul) => {
				ul.style.transform = `translateY(-${currentValue}%)`;
			});

			containerData.frame = requestAnimationFrame(() => anim(containerIndex));
		}
	}

	function applySettingsToStates(settings) {
		if (settings.length === 0) return
		columnsCount = settings.columnsCount
		totalDuration = settings.totalDuration
		winningAnimation = settings.winningAnimation
	}


	function applySettingsToForm(settings) {
		if (settings.length === 0) return
		document.getElementById('columnsCountInput').value = settings.columnsCount;
		document.getElementById('animationLengthInput').value = settings.totalDuration;
		document.getElementById('toggleWinningAnimation').value = settings.winningAnimation;
	}

  	function getSettingsFromForm() {
		return {
			columnsCount: parseInt(document.getElementById('columnsCountInput').value, 10),
			totalDuration: parseInt(document.getElementById('animationLengthInput').value, 10),
			winningAnimation: document.getElementById('toggleWinningAnimation').checked,
		};
	}
</script>

<div class="slots flex justify-center items-center overflow-hidden max-w-screen-xl mx-auto w-full max-h-[100vh]">
	<span class="faded-container"></span>
	{#each [...Array(columnsCount).keys()] as number}
		<div class="slot-container" data-pre-animation={preAnimation} style="--li-count: {rowCount};">
			<ul>
				{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as number}
				<li>{number}</li>
				{/each}
			</ul>
			<ul>
				{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as number}
				<li>{number}</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>

<Popover name="slots" applySettingsToStates={applySettingsToStates} getSettingsFromForm={getSettingsFromForm} applySettingsToForm={applySettingsToForm}>
	<label>Slots</label>
	<input id="columnsCountInput" type="number" min="1" max="6" bind:value={columnsCount}>
	<br>
	<label>Row count</label>
	<input id="columnsCountInput" type="number" min="1" step="2" max="9" bind:value={rowCount}>
	<br>
	<label>Animation Length</label>
	<input id="animationLengthInput" type="number" min="2" max="15" bind:value={totalDuration}> (seconds)
	<br>
	<label>Enable Winning Animation</label>
	<input id="toggleWinningAnimation" type="checkbox" bind:checked={winningAnimation}>
</Popover>

{#if fireConfetti && winningAnimation}
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

<style>
	:global(.app[data-scale="1x"] .slots) {
		--font-size: 5rem;
	}

	:global(.app[data-scale="2x"] .slots) {
		--font-size: 7rem;
	}

	:global(.app[data-scale="3x"] .slots) {
		--font-size: 10rem;
	}

	:global(.app[data-scale="1x"] .slots .slot-container) {
		max-width: 200px;

	}
	:global(.app[data-scale="2x"] .slots .slot-container) {
		max-width: 250px;

	}
	:global(.app[data-scale="3x"] .slots .slot-container) {
		max-width: 300px;
	}

	.slots {
		--font-size: 5rem;
		position: relative;

		.slot-container {
			overflow: hidden;
			max-width: 200px;

			&[data-pre-animation="true"] ul {
				animation: scroll 1s linear infinite;
			}
		}
	}

</style>
