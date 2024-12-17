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
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-xl font-bold mb-4">Add Cup</h2>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Select Cup</label>
        <select bind:value={selectedCup} class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
          {#each cups as cup}
            <option value={cup}>{cup}</option>
          {/each}
        </select>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Select Topping</label>
        <select bind:value={selectedTopping} class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
          {#each toppings as topping}
            <option value={topping}>{topping}</option>
          {/each}
        </select>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Select Size</label>
        <select bind:value={selectedSize} class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
          <option value="M">M</option>
          <option value="L">L</option>
        </select>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Amount</label>
        <input type="number" bind:value={amount} min="1" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" />
      </div>
      <div class="flex justify-end">
        <button on:click={closeModal} class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2">Cancel</button>
        <button on:click={addCup} class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Add</button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Add any additional styles here if needed */
</style>