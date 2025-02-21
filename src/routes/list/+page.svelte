<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<script>
	// @ts-nocheck
	import Papa from 'papaparse';
	import { onMount } from 'svelte';
	import { confetti } from '@neoconfetti/svelte';
	import Popover from '../Popover.svelte';
	import BezierEasing from 'bezier-easing';
	
	let { data } = $props();

	onMount(() => {
		const data = localStorage.getItem('csvData', null); // Replace 'key' with your key

		if (data) {
			csvData = JSON.parse(data)
		}
	});

	let preAnimation = $state(true);
	let fireConfetti = $state(false);
	let winningAnimation = $state(true);
	let csvData = $state(data.csvData || []);
	
	let totalDuration = $state(5);
	let totalFrame = $derived(totalDuration * 60);
	let totalRounds = $state(10)

	let containerData;
	let inAnimation = false;
	let ticketPool = []
	let winnerElement;

	let listData = $derived.by(() => {
		const navnList = csvData.map(item => item.name);
		
		csvData.forEach((entry) => {
			if (entry.name) {
				if (entry.amount) {
					for (let index = 0; index < entry.amount; index++) {
						ticketPool.push(entry.name)
					}
				} else {
					ticketPool.push(entry.name)
				}
			}
		})

		if (navnList.length === 0) {
			return [];
		}

		let data = [...navnList];
		while (data.length < 20) {
			data = data.concat(navnList);
		}

		return data;
	});

	function handleFileUpload(e) {
		const file = e.target.files[0]

		if (!file) {
			return;
		}

		const reader = new FileReader();
		reader.onload = (event) => {
			const csvText = event.target.result;

			Papa.parse(csvText, {
				header: true,
				skipEmptyLines: true,
				complete: (results) => {
						csvData = results.data;
						localStorage.setItem("csvData", JSON.stringify(csvData))
					},
					error: (error) => {
						console.error('Error parsing CSV:', error);
					}
				});
		};

		reader.readAsText(file);
	}

	function drawWinner() {
		return ticketPool[Math.floor(Math.random()*ticketPool.length)];
	}

	function start() {
		if (inAnimation) return;
		if (winnerElement) {
			winnerElement.classList.remove("animate__tada")
			winnerElement = null
		}

		inAnimation = true;
		fireConfetti = false;

		console.log(totalRounds);
		const container = document.querySelector(".slot-container")
		containerData = {
			element: container,
			uls: container.querySelectorAll("ul"),
			randomTransform: totalRounds * 100,
			currentTime: 0,
			increment: 1 / totalFrame,
		}

		preAnimation = false

		spin(containerData);
	}

	function setDataFromText() {
		const input = document.getElementById("text-data")
	}

	function spin(containerData) {
		const winner = drawWinner()
		
		const elements = Array.from(Array.from(containerData.uls)[0].querySelectorAll("li"))
		winnerElement = elements.find(el => el.dataset.name === winner)
		const winnerIndex = elements.indexOf(winnerElement) - 1

		const offset = 2 * 1 / elements.length
		containerData.randomTransform += (1 - winnerIndex / elements.length + offset) * 100;
		
		anim(containerData)
	}

	const easing = BezierEasing(.2,0,0,1);

	function anim(containerData) {
		const { currentTime, increment, randomTransform, uls } = containerData;

		if (currentTime * totalDuration >= totalDuration) {
			cancelAnimationFrame(containerData.frame);
			inAnimation = false;
			fireConfetti = true
			winnerElement.classList.add("animate__tada")
		} else {
			let bezier = easing(containerData.currentTime)
			let currentValue = 100 - (bezier * randomTransform % 100); 
			containerData.currentTime += containerData.increment;

			Array.from(uls).forEach((ul) => {
				ul.style.transform = `translateY(-${currentValue}%)`;
			});

			containerData.frame = requestAnimationFrame(() => anim(containerData));
		}
	}

	function applySettingsToStates(settings) {
		if (settings.length === 0) return
		totalDuration = settings.totalDuration
		winningAnimation = settings.winningAnimation
		totalRounds = settings.totalRounds
	}


	function applySettingsToForm(settings) {
		if (settings.length === 0) return
		document.getElementById('animationLengthInput').value = settings.totalDuration;
		document.getElementById('toggleWinningAnimation').checked = settings.winningAnimation;
		document.getElementById('totalRounds').value = settings.totalRounds;
	}

  	function getSettingsFromForm() {
		return {
			totalDuration: parseInt(document.getElementById('animationLengthInput').value, 10),
			totalRounds: parseInt(document.getElementById('totalRounds').value, 10),
			winningAnimation: document.getElementById('toggleWinningAnimation').checked,
		};
	}
</script>

<div class="grow flex flex-col justify-center overflow-hidden max-w-screen-lg mx-auto w-full">
	{#if listData.length > 0}
		<div class="slot-container" data-pre-animation={preAnimation} style="--count:{listData.length};">
			<div class="faded-container"></div>
			{#if listData.length > 0}
				<ul>
					{#each listData as navn}
						<li data-name={navn}>{navn}</li>
					{/each}
				</ul>
				<ul>
					{#each listData as navn}
						<li data-name={navn}>{navn}</li>
					{/each}
				</ul>
			{/if}
		</div>

		<div class="flex mt-8 justify-center">
			<button class="startButton" onclick={start}>
				SPIN <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M211.66,165.54C225.16,159.7,232,144.37,232,120s-6.84-39.7-20.34-45.55c-11.65-5-27.24-2.23-46.46,8.35,10.58-19.22,13.39-34.81,8.35-46.46C167.7,22.84,152.37,16,128,16S88.3,22.84,82.45,36.34c-5,11.65-2.23,27.24,8.35,46.45C71.58,72.22,56,69.4,44.34,74.45,30.84,80.3,24,95.63,24,120s6.84,39.7,20.34,45.54A31,31,0,0,0,56.8,168c9.6,0,21-3.62,34-10.79C80.22,176.41,77.41,192,82.45,203.65,88.3,217.15,103.63,224,128,224s39.7-6.85,45.55-20.35a32.24,32.24,0,0,0,2.34-15c10.45,16.23,19.64,34.48,24.35,53.33A8,8,0,0,0,208,248a8.13,8.13,0,0,0,1.95-.24,8,8,0,0,0,5.82-9.7c-6.94-27.76-22.27-53.8-37.86-74.79Q189.68,168,199.2,168A31,31,0,0,0,211.66,165.54Zm-6.37-76.4C214.14,93,216,108,216,120s-1.86,27-10.7,30.86c-8.36,3.63-23.52-1.31-42.68-13.91a243.4,243.4,0,0,1-22.54-17C158.49,104.37,190.4,82.68,205.29,89.14ZM97.14,42.7C101,33.86,116,32,128,32s27,1.86,30.86,10.7c3.63,8.36-1.31,23.52-13.91,42.68a243.4,243.4,0,0,1-17,22.54C112.37,89.51,90.69,57.59,97.14,42.7ZM50.71,150.86C41.86,147,40,132,40,120s1.86-27,10.7-30.86A15.64,15.64,0,0,1,57,88c8.75,0,21.34,5.17,36.4,15.07a243.4,243.4,0,0,1,22.54,17C97.51,135.62,65.59,157.32,50.71,150.86Zm108.15,46.43C155,206.14,140,208,128,208s-27-1.86-30.86-10.7c-3.63-8.36,1.31-23.52,13.91-42.68a243.4,243.4,0,0,1,17-22.54C143.63,150.49,165.31,182.41,158.86,197.29Z"></path></svg>
			</button>
		</div>
	{:else}
		<h1 class="text-left">Last opp eller skriv inn data</h1>
	
		<p class="my-2">Last opp CSV-fil</p>
		<div class="flex items-center justify-center w-full">
			<label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-main-800 rounded-lg cursor-pointer bg-main-50 hover:bg-main-100">
				<div class="flex flex-col items-center justify-center pt-5 pb-6">
					<svg class="w-8 h-8 mb-4 text-main-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
					</svg>
					<p class="mb-2 text-sm text-main-800"><span class="font-semibold">Klikk for å laste opp</span> eller dra og slipp</p>
					<p class="text-xs text-main-800">Last opp en CSV-fil som inneholder to kolonner: <i>name</i> og <i>amount</i></p>
				</div>
				<input id="dropzone-file" type="file" class="hidden" accept=".csv" 
				onchange={(event) => handleFileUpload(event)} />
			</label>
		</div> 

		<div class="inline-flex items-center justify-center w-full">
			<hr class="w-64 h-px my-8 bg-main-100 border-0 ">
			<span class="absolute px-3 font-medium text-main-50 -translate-x-1/2 bg-main-600 left-1/2">eller</span>
		</div>

		<p class="my-2">skriv inn data manuelt (Skill med komma)</p>
		<div class="flex">
			<input id="text-data" type="text" placeholder="Skriv navn her (f.eks. Ananas, Banan, Eple)" class="bg-main-50 border border-main-800 text-main-900 text-sm rounded-lg focus:ring-main-500 focus:border-main-500 block w-full p-2.5">
			<button type="button" onclick={setDataFromText} class="text-white bg-main-700 hover:bg-main-800 focus:ring-4 focus:ring-main-300 font-medium rounded-lg text-sm px-5 py-2.5 ml-1 focus:outline-none shrink-0 ">Sett data</button>
		</div>
	{/if}
</div>

<Popover name="list" applySettingsToStates={applySettingsToStates} getSettingsFromForm={getSettingsFromForm} applySettingsToForm={applySettingsToForm}>
	<label for="animationLengthInput" class="mb-2 text-sm font-medium text-gray-900 inline-block">Animation Length</label>
	<input id="animationLengthInput" type="number" min="2" max="15" bind:value={totalDuration}> 
	<label for="animationLengthInput" class="mb-2 text-sm font-medium text-gray-900 inline-block">(seconds)</label>
	<br>
	<label for="toggleWinningAnimation" class="mb-2 text-sm font-medium text-gray-900 inline-block">Enable Winning Animation</label>
	<input id="toggleWinningAnimation" type="checkbox" bind:checked={winningAnimation}>
	<br>
	<label for="totalRounds" class="mb-2 text-sm font-medium text-gray-900 inline-block">Antall runder</label>
	<input id="totalRounds" type="number" min="1" max="20" bind:value={totalRounds}> 
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
	.faded-container {
		position: absolute;
		inset: 0;

		&::after {
			z-index: 10;
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 30%;
			background-image: linear-gradient(to top, rgba(255, 255, 255, 0), var(--main-600) 90%);
		}

		&::before {
			z-index: 10;
			content: "";
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: 30%;
			background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), var(--main-600) 90%);
		}
	}
	
	.slot-container {
		--line-height: 150%;
		--font-size: 4rem;
		--li-count: 7;

		position: relative;
		width: 100%;
		overflow: hidden;
		color: var(--seconday-white);
		max-height: calc(6rem * var(--li-count));	
		display: flex;
		flex-direction: column;

		&::after {
			content: "";
			position: absolute;
			width: 100%;
			top: calc(50% - 3rem);
			border: 2px solid var(--main-700);
		}

		&::before {
			content: "";
			position: absolute;
			width: 100%;
			bottom: calc(50% - 3rem);
			border: 2px solid var(--main-700);
		}

		&[data-pre-animation="true"] ul {
			animation: scroll 1s linear infinite;
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
				line-height: var(--line-height);
				text-align: center;
			}
		}
	}

	:global(.animate__tada) {
		animation-name: tada;
		animation-duration: 1s;
		animation-iteration-count: 5;
	}


	@keyframes scroll {
		from {
			transform: translateY(-100%);
		}

		to {
			transform: translateY(0);
		}
	}


	@keyframes tada {
		0% {
			-webkit-transform: scaleX(1);
			transform: scaleX(1)
		}

		10%,20% {
			-webkit-transform: scale3d(.9,.9,.9) rotate(-3deg);
			transform: scale3d(.9,.9,.9) rotate(-3deg)
		}

		30%,50%,70%,90% {
			-webkit-transform: scale3d(1.1,1.1,1.1) rotate(3deg);
			transform: scale3d(1.1,1.1,1.1) rotate(3deg)
		}

		40%,60%,80% {
			-webkit-transform: scale3d(1.1,1.1,1.1) rotate(-3deg);
			transform: scale3d(1.1,1.1,1.1) rotate(-3deg)
		}

		to {
			-webkit-transform: scaleX(1);
			transform: scaleX(1)
		}
	}

</style>
