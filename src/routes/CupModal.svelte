<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let isOpen: boolean;
	export let cups: string[];
	export let toppings: string[];

	let selectedCup = '';
	let selectedTopping = '';
	let selectedSize = 'M';
	let amount = 1;

	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('close');
	}

	function addCup() {
		dispatch('add', { cup: selectedCup, topping: selectedTopping, size: selectedSize, amount });
		closeModal();
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
		<div class="rounded-lg bg-white p-6 shadow-lg">
			<h2 class="mb-4 text-xl font-bold">Add Cup</h2>
			<div class="mb-4">
				<label class="block text-sm font-medium text-gray-700">Select Cup</label>
				<select
					bind:value={selectedCup}
					class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
				>
					{#each cups as cup}
						<option value={cup}>{cup}</option>
					{/each}
				</select>
			</div>
			<div class="mb-4">
				<label class="block text-sm font-medium text-gray-700">Select Topping</label>
				<select
					bind:value={selectedTopping}
					class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
				>
					{#each toppings as topping}
						<option value={topping}>{topping}</option>
					{/each}
				</select>
			</div>
			<div class="mb-4">
				<label class="block text-sm font-medium text-gray-700">Select Size</label>
				<select
					bind:value={selectedSize}
					class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
				>
					<option value="M">M</option>
					<option value="L">L</option>
				</select>
			</div>
			<div class="mb-4">
				<label class="block text-sm font-medium text-gray-700">Amount</label>
				<input
					type="number"
					bind:value={amount}
					min="1"
					class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
				/>
			</div>
			<div class="flex justify-end">
				<button
					on:click={closeModal}
					class="mr-2 rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-600"
					>Cancel</button
				>
				<button
					on:click={addCup}
					class="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600">Add</button
				>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Add any additional styles here if needed */
</style>
