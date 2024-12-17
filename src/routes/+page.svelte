<script lang="ts">
	import { onMount } from 'svelte';
	import { getAllSpreadsheets } from '$lib/spreadsheetService';
	import { fade } from 'svelte/transition';

	let user: { name: string; access_token: string } | null = null;
	let spreadsheets: any[] = [];
	let token: string = '';
	let drinkmeSpreadsheet: any | null = null;

	onMount(async () => {
		const userCookie = document.cookie.split('; ').find((row) => row.startsWith('user='));
		if (userCookie) {
			user = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
		}
		const tokenCookie = document.cookie.split('; ').find((row) => row.startsWith('token='));
		if (tokenCookie) {
			token = JSON.parse(decodeURIComponent(tokenCookie.split('=')[1]));
		}

		if (user && token) {
			spreadsheets = await getAllSpreadsheets(token);
			localStorage.setItem('spreadsheets', JSON.stringify(spreadsheets));
			drinkmeSpreadsheet = spreadsheets.find((spreadsheet) => spreadsheet.name === 'Drinkme');
		}

		console.log('User:', user);
		console.log('token:', token);
		console.log('Spreadsheets:', spreadsheets);
	});

	function logout() {
		document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
		document.cookie = 'spreadsheets=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
		localStorage.removeItem('spreadsheets');
		user = null;
		spreadsheets = [];
		drinkmeSpreadsheet = null;
		console.log('User logged out.');
	}
</script>

<div class="min-h-screen bg-gray-100">
	{#if user}
		<nav class="bg-white shadow-lg">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="flex h-16 justify-between">
					<div class="flex items-center">
						<span class="text-xl font-semibold text-gray-800 max-md:text-xs"
							>Welcome, {user?.name}</span
						>
					</div>
					<div class="flex items-center">
						<button
							on:click={logout}
							class="max-h-8 max-w-24 rounded text-xs bg-red-500 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:bg-red-600 max-md:text-xs"
						>
							Sign Out
						</button>
					</div>
				</div>
			</div>
		</nav>

		<main class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
			<div class="px-4 py-6 sm:px-0">
				{#if drinkmeSpreadsheet}
					<div class="mb-6 rounded-lg bg-white p-6 shadow-md">
						<div class="flex items-center justify-between">
							<div>
								<h2 class="text-2xl font-semibold text-gray-900">Drinkme Spreadsheet</h2>
								<p class="mt-2 text-sm text-gray-500">
									Last modified: {new Date(drinkmeSpreadsheet.modifiedTime).toLocaleDateString()}
								</p>
							</div>
							<div class="flex space-x-4">
								<!-- <a href={`https://docs.google.com/spreadsheets/d/${drinkmeSpreadsheet.id}`} target="_blank" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    View spreadsheet →
                  </a> -->
								<a
									href={`/edit/${drinkmeSpreadsheet.id}`}
									class="rounded bg-green-500 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:bg-green-600"
								>
									Edit
								</a>
							</div>
						</div>
					</div>
				{:else}
					<p class="text-gray-600">You don't have a spreadsheet named "Drinkme".</p>
				{/if}
				<h2 class="mb-6 text-2xl font-semibold text-gray-900">Your Spreadsheets</h2>
				{#if spreadsheets.length > 0}
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{#each spreadsheets as spreadsheet}
							<div
								class="flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition duration-300 ease-in-out hover:shadow-lg"
								transition:fade
							>
								<div class="flex-grow p-6">
									<h3 class="text-lg font-medium text-gray-900">{spreadsheet.name}</h3>
									<p class="mt-2 text-sm text-gray-500">
										Last modified: {new Date(spreadsheet.modifiedTime).toLocaleDateString()}
									</p>
								</div>
								<div class="mt-auto bg-gray-50 px-6 py-4">
									<a
										href={`https://docs.google.com/spreadsheets/d/${drinkmeSpreadsheet.id}`}
										target="_blank"
										class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
									>
										View spreadsheet →
									</a>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<p class="text-gray-600">No spreadsheets found. Create one to get started!</p>
				{/if}
			</div>
		</main>
	{:else}
		<div class="flex min-h-screen items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
			<div class="w-full max-w-md space-y-8">
				<div>
					<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Sign in to your account
					</h2>
					<p class="mt-2 text-center text-sm text-gray-600">Or start your journey with us today</p>
				</div>
				<form class="mt-8 space-y-6" method="post" action="?/OAuth2">
					<div>
						<button
							type="submit"
							class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition duration-300 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							<span class="absolute inset-y-0 left-0 flex items-center pl-3">
								<svg
									class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										fill-rule="evenodd"
										d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
										clip-rule="evenodd"
									/>
								</svg>
							</span>
							Sign in with Google
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</div>
