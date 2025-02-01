<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<script>
	// @ts-nocheck
	import { onMount } from 'svelte';

	let numbers = $state([]);
	let currentBook = $state("");
	let currentNumber = $state(0);
	let inGame = $state(false);
	let gameType = $state("books");
	let logOpen = $state(false);

	let book_limit;
	let books;

	let limit;
	let from;

	onMount(() => {
		document.addEventListener('keyup', e => {
			if(e.code == 'Space') { e.preventDefault(); next(); return false; }
			if(e.code == 'Enter') { e.preventDefault(); next(); return false; }	 
		});
	});

	function setGameType(e) {
		gameType = e.target.dataset.type
	}

	function start() {
		if (gameType === "books") {
			startBooks()
		} else {
			startNumeral()
		}
	}
	
	function startBooks() {
		books = parseInt(document.getElementById("books").value)
		book_limit = parseInt(document.getElementById("book_limit").value)

		if(books == 0 || book_limit == 0){
			//document.querySelector(".details").prepend("<p class='info wrong-range'>" + __('Woops! Invalid range...')  + "</p>")	
		} else {
			inGame = true
			next()
		}
	}

	function startNumeral() {
		from = parseInt(document.getElementById("from").value)
		limit = parseInt(document.getElementById("limit").value)

		if(from >= limit){
			//document.querySelector(".details").prepend("<p class='info wrong-range'>" + __('Woops! Invalid range...') + "</p>")	
		} else {
			inGame = true
			next()
		}
	}

	function nextBook() {
		currentBook = Math.floor(Math.random()*books) + 1
		currentNumber = Math.floor(Math.random()*book_limit) + 1
		numbers.push({book: currentBook, number: currentNumber})
	}

	function nextNumeral() {
		if(numbers.length > limit - from){
			return false
		} 

		let number = drawNumber()
		while (numbers.includes(number)) {
			number = drawNumber()
		}

		numbers.push(number)
		currentNumber = number
	}

	function drawNumber() {
		return Math.floor(Math.random() * (limit - from + 1) + from)
	}

	function next() {
		if (gameType === "books") {
			nextBook()
		} else {
			nextNumeral()
		}
	}

	function toggleLog() {
		logOpen = !logOpen
	}

	function exitGame() {
		inGame = false
	}

</script>

<div class="screen">
	{#if inGame }
		<svg id="exit-game" class="h-12 w-12 cursor-pointer" xmlns="http://www.w3.org/2000/svg" onclick={exitGame} width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>

		<div class="grid place-items-center" onclick={next}>
			<div id="number">
				{#if gameType === "books" }
					<span class='book-nr uppercase' title="Bok">{currentBook}</span> 
					<span class='ticket-nr uppercase' title="Nummer">{currentNumber}</span>
				{:else}
					<span class='uppercase' title="Nummer">{currentNumber}</span>
				{/if}

			</div>
		</div>

		<div id="log" data-open={logOpen ? "true" : "false" }>
			<div id="log-trigger" onclick={toggleLog}>Logg</div>
			<div class="wrap">
				{#if gameType === "books" }
					{#each numbers as log}
						B{log.book}&nbspT{log.number}<span>&nbsp;-&nbsp;</span>
					{/each}
				{:else}
					{#each numbers as num}
						{num}<span>&nbsp;-&nbsp;</span>
					{/each}
				{/if}
			</div>
		</div>

	{:else}
		<div class="grow flex flex-col justify-center overflow-hidden">
			<p class="text-3xl uppercase text-[#666] font-extralight mt-4" data-game-type={gameType}><a data-type="books" onclick={setGameType}>Bøker</a> eller <a data-type="numeral" onclick={setGameType}>bare tall?</a></p>

			<div class="options mt-2 text-4xl">
				<div class="inline-flex">
					{#if gameType === "books" }
						<label>Bøker</label>
						<input type="text" name="books" id="books" value="10" autocomplete="off">
					{:else}
						<label>Fra</label>
						<input type="text" name="from" id="from" value="1" autocomplete="off">
					{/if}

				</div>
				<div class="inline-flex">
					{#if gameType === "books" }
						<label>Med</label>
						<input type="text" name="book_limit" id="book_limit" value="100" autocomplete="off">
						<label>Nummer</label>
					{:else}
						<label>Til</label>
						<input type="text" name="limit" id="limit" value="100" autocomplete="off">
					{/if}

				</div>
			</div>

			<button class="draw-button" onclick={start}>DRAW</button>
		</div>
	{/if}
</div>

<style>

	:global(.app[data-scale="1x"] #number) {
		font-size: 20vw;
	}
	:global(.app[data-scale="2x"] #number) {
		font-size: 30vw;
	}
	:global(.app[data-scale="3x"] #number) {
		font-size: 40vw;
	}

	.screen {
		color: white;
		font-size: 1em;
		max-width: 1300px;
		margin: auto;
		text-align: left;
	}

	#exit-game {
		position: absolute;
		top: 1em;
		right: 1em;
		z-index: 150;
	}

	[data-game-type="books"] a[data-type="numeral"] {
		color: var(--secondary-white);
		text-decoration: underline;
		cursor: pointer;
	}
	[data-game-type="books"] a[data-type="books"] {
		pointer-events: none;
	}

	[data-game-type="numeral"] a[data-type="books"] {
		color: var(--secondary-white);
		text-decoration: underline;
		cursor: pointer;
	}
	[data-game-type="numeral"] a[data-type="numeral"] {
		pointer-events: none;
	}

	.options {
		label {
			background: #FFF;
			height: 100px;
			line-height: 100px;
			color: #CCC;
			text-transform: uppercase;
			padding: 0 25px;
			font-size: 1em;
			float: left;
		}

		input {
			padding: 0;
			float: left;
			height: 100px;
			line-height: 100px;
			width: 200px;
			color: var(--main-600);
			border: none;
			border-left: solid 1px #E5E5E5;
			font-size: 1em;
			text-align: center;
			font-weight: bold;
			font-family: "proxima-nova", sans-serif;
			appearance: none;
		}
	}

	.draw-button {
		font-family: "proxima-nova", sans-serif;
		font-weight: bold;
		background: var(--main-900);
		border: none;
		color: #FFF;
		border-radius: 8px;
		font-size: 1em;
		text-align: center;
		padding: 1rem 2rem;
		font-size: 2rem;
		width: fit-content;
		margin-top: 1.5rem;
	}

	#number {
		font-size: 30vw;
		text-shadow: 7px 7px 0px rgba(0, 0, 0, 0.3);
		font-weight: bold;
		user-select: none;
		text-wrap: nowrap;
	}

	.book-nr:before {content:attr(title); font-size:0.1em; line-height:3em; text-shadow: none; color:rgba(0,0,0,0.3); position:absolute;}
	.ticket-nr:before {content:attr(title); font-size:0.1em; line-height:3em; text-shadow: none; color:rgba(0,0,0,0.3); position:absolute;}

	#log {
		transition: transform 0.25s ease;
		transform: translateX(100%);
		position: absolute;
		width: 20%;
		top: 0;
		bottom: 0;
		right: 0;
		font-size: 2em;

		&[data-open="true"] {
			transform: translateX(0);
		}
	}

	#log-trigger {
		transform: rotate(270deg) translate(0, -86px);
		font-weight: bold;
		position: absolute;
		top: 50%;
		left: 0;
		width: 120px;
		height: 50px;
		text-align: center;
		background: rgba(0, 0, 0, 0.3);
		cursor: pointer;
		text-transform: uppercase;
		user-select: none;
	}

	.wrap {
		position: absolute;
		width: 100%;
		bottom: 0;
		top: 0;
		right: 0;
		padding: 0.5rem;
		background: rgba(0, 0, 0, 0.3);
	}
</style>
