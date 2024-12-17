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
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <span class="text-xl font-semibold text-gray-800">Dashboard</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-600 mr-4">Welcome, {user.name}</span>
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
  
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          {#if drinkmeSpreadsheet}
            <div class="mb-6 p-6 bg-white shadow-md rounded-lg">
              <div class="flex justify-between items-center">
                <div>
                  <h2 class="text-2xl font-semibold text-gray-900">Drinkme Spreadsheet</h2>
                  <p class="mt-2 text-sm text-gray-500">Last modified: {new Date(drinkmeSpreadsheet.modifiedTime).toLocaleDateString()}</p>
                </div>
                <div class="flex space-x-4">
                  <!-- <a href={`https://docs.google.com/spreadsheets/d/${drinkmeSpreadsheet.id}`} target="_blank" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    View spreadsheet →
                  </a> -->
                  <a href={`/edit/${drinkmeSpreadsheet.id}`} class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                    Edit
                  </a>
                </div>
              </div>
            </div>
          {:else}
            <p class="text-gray-600">You don't have a spreadsheet named "Drinkme".</p>
          {/if}
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">Your Spreadsheets</h2>
          {#if spreadsheets.length > 0}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {#each spreadsheets as spreadsheet}
                <div
                  class="bg-white overflow-hidden shadow-md rounded-lg hover:shadow-lg transition duration-300 ease-in-out flex flex-col"
                  transition:fade
                >
                  <div class="p-6 flex-grow">
                    <h3 class="text-lg font-medium text-gray-900">{spreadsheet.name}</h3>
                    <p class="mt-2 text-sm text-gray-500">Last modified: {new Date(spreadsheet.modifiedTime).toLocaleDateString()}</p>
                  </div>
                  <div class="bg-gray-50 px-6 py-4 mt-auto">
                    <a href="#" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
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
      <div class="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
          <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600">
              Or start your journey with us today
            </p>
          </div>
          <form class="mt-8 space-y-6" method="post" action="?/OAuth2">
            <div>
              <button
                type="submit"
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
              >
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
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
  
  