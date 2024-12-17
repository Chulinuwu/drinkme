<script lang="ts">
    import { onMount, afterUpdate } from 'svelte';
    import { getSpreadsheetData, getSheetNames, updateSpreadsheetData } from '$lib/spreadsheetService';
    import Chart from 'chart.js/auto';
    import { goto } from '$app/navigation';
    import CupModal from './CupModal.svelte';
  
    function goBack() {
      goto('/');
      location.reload();
    }
  
    export let spreadsheetId: string;
  
    let spreadsheetData: any[] = [];
    let displayData: any[] = [];
    let isLoading = true;
    let error: string | null = null;
    let selectedName: string | null = null;
    let names: string[] = [];
    let totalSum = 0;
    let chartCanvas: HTMLCanvasElement;
    let chart: Chart | null = null;
    let user: { name: string; access_token: string } | null = null;
  
    let isModalOpen = false;
    let cups: string[] = [];
    let toppings: string[] = [];
  
    onMount(() => {
      const userCookie = document.cookie.split('; ').find((row) => row.startsWith('user='));
      if (userCookie) {
        user = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
      }
      loadSheetNames();
    });
  
    afterUpdate(() => {
      if (spreadsheetData.length > 0 && chartCanvas) {
        createOrUpdateChart();
      }
    });
  
    async function loadSheetNames() {
      try {
        const token = JSON.parse(decodeURIComponent(document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || ''));
        names = await getSheetNames(token, spreadsheetId);
        if (names.length > 0) {
          selectedName = names[0]; // Set the initial selected name to the first index
        }
      } catch (err) {
        error = 'Failed to load sheet names';
      }
    }
  
    async function loadSpreadsheetData() {
      try {
        isLoading = true;
        error = null;
        const token = JSON.parse(decodeURIComponent(document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || ''));
        if (selectedName) {
          spreadsheetData = await getSpreadsheetData(token, spreadsheetId, selectedName);
          calculateTotalSum();
          prepareDisplayData();
        } else {
          throw new Error('No sheet name selected');
        }
      } catch (err) {
        error = 'Failed to load spreadsheet data';
      } finally {
        isLoading = false;
      }
    }
  
    function calculateTotalSum() {
      totalSum = spreadsheetData.reduce((sum, item, index) => {
        let sizeM = 0;
        let sizeL = 0;

        if (index >= 0 && index <= 9) {
          sizeM = parseFloat(item['Size M (จำนวนแก้ว)']) * 29;
          sizeL = parseFloat(item['Size L (จำนวนแก้ว)']) * 39;
        } else if (index >= 10 && index <= 11) {
          sizeM = parseFloat(item['Size M (จำนวนแก้ว)']) * 15;
          sizeL = parseFloat(item['Size L (จำนวนแก้ว)']) * 15;
        } else if (index >= 12 && index <= 15) {
          sizeM = parseFloat(item['Size M (จำนวนแก้ว)']) * 10;
          sizeL = parseFloat(item['Size L (จำนวนแก้ว)']) * 10;
        }

        const total = sizeM + sizeL;
        console.log(`Item: ${JSON.stringify(item)}, Size M Total: ${sizeM}, Size L Total: ${sizeL}, Total: ${total}`);
        return sum + (isNaN(total) ? 0 : total);
      }, 0);
      console.log(`Total Sum: ${totalSum}`);
    }

    function prepareDisplayData() {
      displayData = spreadsheetData.map((item, index) => {
        let sizeM = 0;
        let sizeL = 0;

        if (index >= 0 && index <= 9) {
          sizeM = parseFloat(item['Size M (จำนวนแก้ว)']) * 29;
          sizeL = parseFloat(item['Size L (จำนวนแก้ว)']) * 39;
        } else if (index >= 10 && index <= 11) {
          sizeM = parseFloat(item['Size M (จำนวนแก้ว)']) * 15;
          sizeL = parseFloat(item['Size L (จำนวนแก้ว)']) * 15;
        } else if (index >= 12 && index <= 15) {
          sizeM = parseFloat(item['Size M (จำนวนแก้ว)']) * 10;
          sizeL = parseFloat(item['Size L (จำนวนแก้ว)']) * 10;
        }

        const total = sizeM + sizeL;
        return { ...item, TotalSum: total };
      });
    }
  
    function createOrUpdateChart() {
      const ctx = chartCanvas.getContext('2d');
      if (!ctx) return;
  
      const labels = spreadsheetData.map(item => item['ชื่อเมนู']);
      const dataM = spreadsheetData.map(item => parseFloat(item['Size M (จำนวนแก้ว)']) || 0);
      const dataL = spreadsheetData.map(item => parseFloat(item['Size L (จำนวนแก้ว)']) || 0);
  
      if (chart) {
        chart.destroy();
      }
  
      chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Size M (จำนวนแก้ว)',
              data: dataM,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            },
            {
              label: 'Size L (จำนวนแก้ว)',
              data: dataL,
              backgroundColor: 'rgba(153, 102, 255, 0.6)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  
    $: if (selectedName) {
      loadSpreadsheetData();
    }
  
    function logout() {
      document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'spreadsheets=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      localStorage.removeItem('spreadsheets');
      user = null;
      console.log('User logged out.');
    }
  
    function openModal() {
      isModalOpen = true;
      cups = spreadsheetData.slice(0, 9).map(item => item['ชื่อเมนู']);
      toppings = spreadsheetData.slice(10, 15).map(item => item['ชื่อเมนู']);
    }
  
    function closeModal() {
      isModalOpen = false;
    }
  
    async function handleAddCup(event: { detail: { cup: any; topping: any; size: any; amount: any; }; }) {
  const { cup, topping, size, amount } = event.detail;
  console.log(`Cup: ${cup}, Topping: ${topping}, Size: ${size}, Amount: ${amount}`);

  // Find the existing cup data in the spreadsheetData array
  const existingCupRow = spreadsheetData.find(row => row['ชื่อเมนู'] === cup);

  if (existingCupRow) {
    // Update the existing row with the new values
    existingCupRow[`Size ${size} (จำนวนแก้ว)`] = (parseFloat(existingCupRow[`Size ${size} (จำนวนแก้ว)`]) || 0) + amount;
  } else {
    // If the cup does not exist, add a new row
    spreadsheetData.push({
      'ชื่อเมนู': cup,
      [`Size ${size} (จำนวนแก้ว)`]: amount,
    });
  }

  // Update the corresponding topping row in the slice 10-15
  const existingToppingRow = spreadsheetData.slice(10, 15).find(row => row['ชื่อเมนู'] === topping);

  if (existingToppingRow) {
    existingToppingRow[`Size ${size} (จำนวนแก้ว)`] = (parseFloat(existingToppingRow[`Size ${size} (จำนวนแก้ว)`]) || 0) + amount;
  } else {
    // If the topping does not exist in slice 10-15, add a new row
    spreadsheetData.push({
      'ชื่อเมนู': topping,
      [`Size ${size} (จำนวนแก้ว)`]: amount,
    });
  }

  // Update the Google Sheet with the new data
  try {
    const token = JSON.parse(decodeURIComponent(document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || ''));
    if (selectedName) {
      await updateSpreadsheetData(token, spreadsheetId, spreadsheetData, selectedName);
    } else {
      throw new Error('No sheet name selected');
    }
    console.log('Spreadsheet updated successfully');
  } catch (err) {
    console.error('Failed to update spreadsheet', err);
  }

  closeModal();
  calculateTotalSum();
  prepareDisplayData();
}
  
    function addCup() {
      openModal();
    }
  </script>
  
  <CupModal isOpen={isModalOpen} {cups} {toppings} on:close={closeModal} on:add={handleAddCup} />
  
  <nav class="bg-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <span class="text-xl font-semibold text-gray-800">Dashboard</span>
        </div>
        <div class="flex items-center">
          <span class="text-gray-600 mr-4">Welcome, {user?.name}</span>
          <button
            on:click={logout}
            class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </nav>
  
  <div class="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between mb-4 items-center">
        <button 
          on:click={goBack} 
          class="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75">
          Go Back
        </button>
        <h1 class="text-xl font-bold text-center items-center justify-center flex text-gray-900">Drinkme Spreadsheet Summary</h1>
        <button 
          on:click={addCup} 
          class="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75">
          ADD CUP
        </button>
      </div>
  
      <div class="bg-white shadow rounded-lg p-6 mb-8">
        <label for="name-select" class="block text-sm font-medium text-gray-700 mb-2">Select Sheet Name</label>
        <select 
          id="name-select" 
          bind:value={selectedName} 
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {#each names as name}
            <option value={name}>{name}</option>
          {/each}
        </select>
      </div>
  
      {#if error}
        <p class="text-red-500 text-center mb-4">{error}</p>
      {:else if isLoading}
        <div class="flex justify-center items-center h-32">
          Select sheet before continuing eiei
        </div>
      {:else if spreadsheetData.length > 0}
        <div class="bg-white shadow rounded-lg p-6 mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">Total</h2>
          <p class="text-4xl font-bold text-indigo-600">{totalSum.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</p>
        </div>
  
        <div class="bg-white shadow rounded-lg p-6 mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">Sales Summary</h2>
          <div style="height: 400px;">
            <canvas bind:this={chartCanvas}></canvas>
          </div>
        </div>
  
        <div class="bg-white shadow rounded-lg overflow-hidden">
            <div class="px-4 py-5 sm:p-6">
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">Detailed Data</h2>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      {#each Object.keys(displayData[0]) as header}
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                      {/each}
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    {#each displayData as row}
                      <tr>
                        {#each Object.entries(row) as [key, value]}
                          <td class="px-6 py-4 whitespace-nowrap text-sm {key === 'TotalSum' ? 'text-right font-bold text-indigo-600' : 'text-gray-500'}">{value}</td>
                        {/each}
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      {:else}
        <p class="text-center text-gray-700">No data available. Please select a sheet.</p>
      {/if}
    </div>
  </div>
  
  <style>
    /* Add any additional styles here if needed */
  </style>