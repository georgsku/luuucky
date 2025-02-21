<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<script>
	// @ts-nocheck
	import { confetti } from '@neoconfetti/svelte';
	import Popover from '../Popover.svelte';

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


	function anim(containerIndex) {
		const containerData = slotContainers[containerIndex];
		if (!containerData) return;

		const { currentTime, increment, randomTransform, uls } = containerData;

		if (currentTime * totalDuration >= totalDuration) {
			cancelAnimationFrame(containerData.frame);
			inAnimation = false;
		} else {
			let currentValue = 100 - (bezier( containerData.currentTime, 0, 0 * randomTransform, 1 * randomTransform, randomTransform ) % 100); 
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

<div class="top-container flex justify-center overflow-hidden max-w-screen-lg mx-auto w-full">
	{#each [...Array(columnsCount).keys()] as number}
		<div class="slot-container" data-pre-animation={preAnimation} style="--row-count: {rowCount};">
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

<div class="flex justify-center mt-8">
	<button class="startButton" onclick={start}>
		SPIN <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M211.66,165.54C225.16,159.7,232,144.37,232,120s-6.84-39.7-20.34-45.55c-11.65-5-27.24-2.23-46.46,8.35,10.58-19.22,13.39-34.81,8.35-46.46C167.7,22.84,152.37,16,128,16S88.3,22.84,82.45,36.34c-5,11.65-2.23,27.24,8.35,46.45C71.58,72.22,56,69.4,44.34,74.45,30.84,80.3,24,95.63,24,120s6.84,39.7,20.34,45.54A31,31,0,0,0,56.8,168c9.6,0,21-3.62,34-10.79C80.22,176.41,77.41,192,82.45,203.65,88.3,217.15,103.63,224,128,224s39.7-6.85,45.55-20.35a32.24,32.24,0,0,0,2.34-15c10.45,16.23,19.64,34.48,24.35,53.33A8,8,0,0,0,208,248a8.13,8.13,0,0,0,1.95-.24,8,8,0,0,0,5.82-9.7c-6.94-27.76-22.27-53.8-37.86-74.79Q189.68,168,199.2,168A31,31,0,0,0,211.66,165.54Zm-6.37-76.4C214.14,93,216,108,216,120s-1.86,27-10.7,30.86c-8.36,3.63-23.52-1.31-42.68-13.91a243.4,243.4,0,0,1-22.54-17C158.49,104.37,190.4,82.68,205.29,89.14ZM97.14,42.7C101,33.86,116,32,128,32s27,1.86,30.86,10.7c3.63,8.36-1.31,23.52-13.91,42.68a243.4,243.4,0,0,1-17,22.54C112.37,89.51,90.69,57.59,97.14,42.7ZM50.71,150.86C41.86,147,40,132,40,120s1.86-27,10.7-30.86A15.64,15.64,0,0,1,57,88c8.75,0,21.34,5.17,36.4,15.07a243.4,243.4,0,0,1,22.54,17C97.51,135.62,65.59,157.32,50.71,150.86Zm108.15,46.43C155,206.14,140,208,128,208s-27-1.86-30.86-10.7c-3.63-8.36,1.31-23.52,13.91-42.68a243.4,243.4,0,0,1,17-22.54C143.63,150.49,165.31,182.41,158.86,197.29Z"></path></svg>
	</button>
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
	:global(.app[data-scale="1x"] .top-container) {
		--font-size: 5rem;

	}
	:global(.app[data-scale="2x"] .top-container) {
		--font-size: 7rem;

	}
	:global(.app[data-scale="3x"] .top-container) {
		--font-size: 10rem;
		max-width: 300px;
	}
	:global(.app[data-scale="1x"] .slot-container) {
		max-width: 200px;

	}
	:global(.app[data-scale="2x"] .slot-container) {
		max-width: 250px;

	}
	:global(.app[data-scale="3x"] .slot-container) {
		max-width: 300px;
	}

	.top-container {
		--font-size: 5rem;
		position: relative;

		&::after {
			z-index: 10;
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: calc(2 * var(--font-size));
			background-image: linear-gradient(to top, rgba(255, 255, 255, 0), var(--main-600) 90%);
		}

		&::before {
			z-index: 10;
			content: "";
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: calc(2 * var(--font-size));
			background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), var(--main-600) 90%);
		}
	}

	.slot-container {
        position: relative;
        width: 100%;
        overflow: hidden;
        color: var(--secondary-white);
        max-height: calc((calc(var(--font-size)/3) + var(--font-size)) * var(--row-count));	
		max-width: 200px;
        display: flex;
        flex-direction: column;

        &::after {
            content: "";
            position: absolute;
            width: 100%;
            top: calc(50% - calc((calc(var(--font-size) / 6) + var(--font-size)) / 2));
            border: 2px solid var(--main-700);
        }

        &::before {
            content: "";
            position: absolute;
            width: 100%;
            bottom: calc(50% - calc((calc(var(--font-size) / 6) + var(--font-size)) / 2));
            border: 2px solid var(--main-700);
        }

        ul {
            all: unset;
            display: flex;
            flex-direction: column;
            inset: 0;
            place-content: center start;
            list-style: none;

            li {
                font-size: var(--font-size);
                line-height: 1em;
                padding: calc(var(--font-size)/6) 0;
                text-align: center;
            }
        }

        &[data-pre-animation="true"] ul {
            animation: scroll 1s linear infinite;
        }
    }

    @keyframes scroll {
		from {
			transform: translateY(-100%);
		}

		to {
			transform: translateY(0);
		}
	}

</style>
