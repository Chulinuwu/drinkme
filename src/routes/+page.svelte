<script lang="ts">
    import { onMount } from 'svelte';

  
    let user: { name: string } | null = null;
  
    onMount(() => {
      const userCookie = document.cookie.split('; ').find(row => row.startsWith('user='));
      console.log('userCookie:', userCookie); // Debugging line
      if (userCookie) {
        user = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
        console.log('user:', user); // Debugging line
      }
    });

    function logout() {
    user = null;
  }
  </script>
  
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      {#if user}
        <div class="text-center">
          <h1 class="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome, {user.name}!
          </h1>
          <p class="mt-2 text-sm text-gray-600">
            We're glad to see you here.
          </p>
          <button on:click={logout} class="mt-4 px-4 py-2 bg-red-500 text-white rounded">
            Logout
          </button>
        </div>
      {:else}
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
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <!-- <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.411 2.865 8.138 6.839 9.439.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.934.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.134 20 14.41 20 10c0-5.523-4.477-10-10-10z" clip-rule="evenodd" />
                </svg>
              </span> -->
              Sign in with Google
            </button>
          </div>
        </form>
      {/if}
    </div>
  </div>