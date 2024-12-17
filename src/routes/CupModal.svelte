<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let isOpen: boolean;
  export let cups: string[];
  export let toppings: string[];
  let selectedCup = '';
  let selectedTopping = '';
  let selectedSize = 'M';
  let amount = 1;

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
              <label for="cup-select" class="block text-sm font-medium text-gray-700">Select Cup</label>
              <select
                  id="cup-select"
                  bind:value={selectedCup}
                  class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                  {#each cups as cup}
                      <option value={cup}>{cup}</option>
                  {/each}
              </select>
          </div>

          <div class="mb-4">
              <label for="topping-select" class="block text-sm font-medium text-gray-700">Select Topping</label>
              <select
                  id="topping-select"
                  bind:value={selectedTopping}
                  class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                  {#each toppings as topping}
                      <option value={topping}>{topping}</option>
                  {/each}
              </select>
          </div>

          <div class="mb-4">
              <label for="size-select" class="block text-sm font-medium text-gray-700">Select Size</label>
              <select
                  id="size-select"
                  bind:value={selectedSize}
                  class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                  <option value="M">M</option>
                  <option value="L">L</option>
              </select>
          </div>

          <div class="mb-4">
              <label for="amount-input" class="block text-sm font-medium text-gray-700">Amount</label>
              <input
                  id="amount-input"
                  type="number"
                  bind:value={amount}
                  min="1"
                  class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
          </div>

          <div class="flex justify-end">
              <button
                  on:click={closeModal}
                  class="mr-2 rounded bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400"
              >
                  Cancel
              </button>
              <button
                  on:click={addCup}
                  class="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                  Add
              </button>
          </div>
      </div>
  </div>
{/if}