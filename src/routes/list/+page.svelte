<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>


<script>
	// @ts-nocheck
	import "../slots.scss"
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

		document.addEventListener("keydown", (event) => {
			if (event.key === "Enter") {
				event.preventDefault();
				start();
			}
		})
	});

	let preAnimation = $state(true);
	let fireConfetti = $state(false);
	let winningAnimation = $state(true);
	let csvData = $state(data.csvData || []);
	
	let totalDuration = $state(5);
	let totalFrame = $derived(totalDuration * 60);
	let totalRounds = $state(10)
	let totalRows = $state(7)

	let containerData;
	let inAnimation = false;
	let ticketPool = []
	let winner;

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
		if (winner) {
			Array.from(document.querySelectorAll(`li[data-name=${winner}]`)).forEach(el => {
				el.classList.remove("animate__tada")
			})
			winner = null
		}

		inAnimation = true;
		fireConfetti = false;

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
		winner = drawWinner()
		
		const elements = Array.from(Array.from(containerData.uls)[0].querySelectorAll("li"))
		const winnerElement = elements.find(el => el.dataset.name === winner)
		const winnerIndex = elements.indexOf(winnerElement) - 1
		const offset = (Math.floor(totalRows / 2) - 1)/ elements.length

		containerData.randomTransform += (1 - winnerIndex / elements.length + offset) * 100;
		
		anim(containerData)
	}

	const easing = BezierEasing(.2,0,0,1);

	function anim(containerData) {
		const { currentTime, increment, randomTransform, uls } = containerData;

		if (currentTime * totalDuration >= totalDuration) {
			cancelAnimationFrame(containerData.frame);
			inAnimation = false;
			
			if (winningAnimation) {
				fireConfetti = true
				
				Array.from(document.querySelectorAll(`li[data-name=${winner}]`)).forEach(el => {
					el.classList.add("animate__tada")
				})
			}
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
		totalDuration = settings.totalDuration || 5
		winningAnimation = settings.winningAnimation || true
		totalRounds = settings.totalRounds || 10
		totalRows = settings.totalRows || 7
	}


	function applySettingsToForm(settings) {
		if (settings.length === 0) return
		document.getElementById('animationLengthInput').value = settings.totalDuration;
		document.getElementById('toggleWinningAnimation').checked = settings.winningAnimation;
		document.getElementById('totalRounds').value = settings.totalRounds;
		document.getElementById('totalRows').value = settings.totalRows;
	}

  	function getSettingsFromForm() {
		return {
			totalDuration: parseInt(document.getElementById('animationLengthInput').value, 10),
			totalRounds: parseInt(document.getElementById('totalRounds').value, 10),
			totalRows: parseInt(document.getElementById('totalRows').value, 10),
			winningAnimation: document.getElementById('toggleWinningAnimation').checked,
		};
	}
</script>

<div class="list grow flex flex-col justify-center overflow-hidden max-w-screen-2xl	mx-auto w-full max-h-[100vh]">
	{#if listData.length > 0}
		<div class="overflow-hidden flex flex-col justify-center w-fit m-auto">
			<div class="slot-container" data-pre-animation={preAnimation} style="--li-count:{totalRows};">
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
	<br>
	<label for="totalRows" class="mb-2 text-sm font-medium text-gray-900 inline-block">Antall rader</label>
	<input id="totalRows" type="number" min="1" max="11" step="2" bind:value={totalRows}> 
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
	:global(.app[data-scale="1x"] .list) {
		--font-size: 4rem;
	}
	:global(.app[data-scale="2x"] .list) {
		--font-size: 5.5rem;
	}
	:global(.app[data-scale="3x"] .list) {
		--font-size: 7rem;
	}

	.list {
		--font-size: 4rem;

		li {
			padding: 0 3rem;
			min-width: 400px;
		}
	}

</style>
