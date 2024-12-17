<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import {
		getSpreadsheetData,
		getSheetNames,
		updateSpreadsheetData
	} from '$lib/spreadsheetService';
	import Chart from 'chart.js/auto';
	import { goto } from '$app/navigation';
	import CupModal from './CupModal.svelte';

	function goBack() {
		//   goto('/');
		//   location.reload();
		history.back();
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
			const token = JSON.parse(
				decodeURIComponent(
					document.cookie
						.split('; ')
						.find((row) => row.startsWith('token='))
						?.split('=')[1] || ''
				)
			);
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
			const token = JSON.parse(
				decodeURIComponent(
					document.cookie
						.split('; ')
						.find((row) => row.startsWith('token='))
						?.split('=')[1] || ''
				)
			);
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
			return sum + (isNaN(total) ? 0 : total);
		}, 0);
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

		const labels = spreadsheetData.map((item) => item['ชื่อเมนู']);
		const dataM = spreadsheetData.map((item) => parseFloat(item['Size M (จำนวนแก้ว)']) || 0);
		const dataL = spreadsheetData.map((item) => parseFloat(item['Size L (จำนวนแก้ว)']) || 0);

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
	}

	function openModal() {
		isModalOpen = true;
		cups = spreadsheetData.slice(0, 9).map((item) => item['ชื่อเมนู']);
		toppings = spreadsheetData.slice(10, 15).map((item) => item['ชื่อเมนู']);
	}

	function closeModal() {
		isModalOpen = false;
	}

	async function handleAddCup(event: {
		detail: { cup: any; topping: any; size: any; amount: any };
	}) {
		const { cup, topping, size, amount } = event.detail;

		// Find the existing cup data in the spreadsheetData array
		const existingCupRow = spreadsheetData.find((row) => row['ชื่อเมนู'] === cup);

		if (existingCupRow) {
			// Update the existing row with the new values
			existingCupRow[`Size ${size} (จำนวนแก้ว)`] =
				(parseFloat(existingCupRow[`Size ${size} (จำนวนแก้ว)`]) || 0) + amount;
		} else {
			// If the cup does not exist, add a new row
			spreadsheetData.push({
				ชื่อเมนู: cup,
				[`Size ${size} (จำนวนแก้ว)`]: amount
			});
		}

		// Update the corresponding topping row in the slice 10-15
		const existingToppingRow = spreadsheetData
			.slice(10, 15)
			.find((row) => row['ชื่อเมนู'] === topping);

		if (existingToppingRow) {
			existingToppingRow[`Size ${size} (จำนวนแก้ว)`] =
				(parseFloat(existingToppingRow[`Size ${size} (จำนวนแก้ว)`]) || 0) + amount;
		} else {
			// If the topping does not exist in slice 10-15, add a new row
			spreadsheetData.push({
				ชื่อเมนู: topping,
				[`Size ${size} (จำนวนแก้ว)`]: amount
			});
		}

		// Update the Google Sheet with the new data
		try {
			const token = JSON.parse(
				decodeURIComponent(
					document.cookie
						.split('; ')
						.find((row) => row.startsWith('token='))
						?.split('=')[1] || ''
				)
			);
			if (selectedName) {
				await updateSpreadsheetData(token, spreadsheetId, spreadsheetData, selectedName);
			} else {
				throw new Error('No sheet name selected');
			}
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
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 justify-between">
			<div class="flex items-center">
				<span class="text-xl font-semibold text-gray-800 max-md:text-xs">Welcome, {user?.name}</span
				>
			</div>
			<div class="flex items-center">
				<button
					on:click={logout}
					class="max-h-8 max-w-24  text-xs rounded bg-red-500 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:bg-red-600 max-md:text-xs"
				>
					Sign Out
				</button>
			</div>
		</div>
	</div>
</nav>

<div class="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-7xl">
		<div class="mb-4 flex items-center justify-between">
			<button
				on:click={goBack}
				class="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 max-md:text-xs"
			>
				Go Back
			</button>
			<h1
				class="flex items-center justify-center text-center text-xl font-bold text-gray-900 max-md:text-xs"
			>
				Drinkme Spreadsheet Summary
			</h1>
			<button
				on:click={addCup}
				class="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 max-md:text-xs"
			>
				ADD CUP
			</button>
		</div>

		<div class="mb-8 rounded-lg bg-white p-6 shadow">
			<label for="name-select" class="mb-2 block text-sm font-medium text-gray-700"
				>Select Sheet Name</label
			>
			<select
				id="name-select"
				bind:value={selectedName}
				class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
			>
				{#each names as name}
					<option value={name}>{name}</option>
				{/each}
			</select>
		</div>

		{#if error}
			<p class="mb-4 text-center text-red-500">{error}</p>
		{:else if isLoading}
			<div class="flex h-32 items-center justify-center">Select sheet before continuing eiei</div>
		{:else if spreadsheetData.length > 0}
			<div class="mb-8 rounded-lg bg-white p-6 shadow">
				<h2 class="mb-4 text-2xl font-semibold text-gray-900">Total</h2>
				<p class="text-4xl font-bold text-indigo-600">
					{totalSum.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}
				</p>
			</div>

			<div class="mb-8 rounded-lg bg-white p-6 shadow">
				<h2 class="mb-4 text-2xl font-semibold text-gray-900">Sales Summary</h2>
				<div style="height: 400px;">
					<canvas bind:this={chartCanvas}></canvas>
				</div>
			</div>

			<div class="overflow-hidden rounded-lg bg-white shadow">
				<div class="px-4 py-5 sm:p-6">
					<h2 class="mb-4 text-2xl font-semibold text-gray-900">Detailed Data</h2>
					<div class="overflow-x-auto">
						<table class="min-w-full divide-y divide-gray-200">
							<thead class="bg-gray-50">
								<tr>
									{#each Object.keys(displayData[0]) as header}
										<th
											class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
											>{header}</th
										>
									{/each}
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200 bg-white">
								{#each displayData as row}
									<tr>
										{#each Object.entries(row) as [key, value]}
											<td
												class="whitespace-nowrap px-6 py-4 text-sm {key === 'TotalSum'
													? 'text-right font-bold text-indigo-600'
													: 'text-gray-500'}">{value}</td
											>
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
	table {
		width: 100%;
		border-collapse: collapse;
		border-spacing: 0;
		overflow-x: auto;
		background-color: #ffffff;
		border-radius: 10px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	th,
	td {
		padding: 16px;
		text-align: left;
		font-size: 14px;
		border-bottom: 1px solid #e5e7eb;
		white-space: nowrap;
	}

	th {
		background-color: #f3f4f6;
		text-transform: uppercase;
		font-weight: 700;
		color: #6b7280;
	}

	td {
		color: #4b5563;
		font-weight: 500;
	}

	tr:hover {
		background-color: #f9fafb;
	}

	.text-right {
		text-align: right;
	}

	.font-bold {
		font-weight: 700;
	}

	.text-indigo-600 {
		color: #6366f1;
	}


	@media (max-width: 768px) {
		th,
		td {
			font-size: 12px;
			padding: 10px;
		}

		th {
			text-align: center;
		}

		td {
			text-align: center;
		}
	}
</style>
