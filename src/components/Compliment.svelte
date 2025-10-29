<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { supabase } from '../lib/supabaseClient.js';
  
  const dispatch = createEventDispatcher();
  
  let compliments = [];
  let currentCompliment = '';
  let showCompliment = false;
  let loading = true;

  async function loadCompliments() {
    try {
      const { data, error } = await supabase.from('compliments').select('text');
      if (error) throw error;
      compliments = data?.map(c => c.text) || [];
    } catch (err) {
      console.error('Error loading compliments:', err);
    } finally {
      loading = false;
    }
  }

  function getRandomCompliment() {
    if (compliments.length === 0) return;
    const random = compliments[Math.floor(Math.random() * compliments.length)];
    currentCompliment = random;
    showCompliment = true;
  }

  onMount(() => {
    loadCompliments();
  });
</script>

<div class="min-h-screen bg-cream">
  <!-- Header -->
  <div class="sticky top-0 bg-white shadow-md z-20 p-4 flex items-center justify-between">
    <button 
      on:click={() => dispatch('back')} 
      class="text-primary text-3xl hover:scale-110 transition-transform"
      style="min-width: 44px; min-height: 44px;"
    >
      ←
    </button>
    <h1 class="text-2xl font-script text-primary">For You</h1>
    <div class="w-11"></div>
  </div>

  <div class="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
    <div class="text-center max-w-md w-full">
      <div class="text-8xl mb-8 animate-heartbeat">💝</div>
      
      {#if loading}
        <div class="mb-6">
          <div class="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      {:else if showCompliment}
        <div class="bg-white rounded-2xl p-8 shadow-xl mb-6 animate-fade-in">
          <p class="text-xl text-gray-800 leading-relaxed">{currentCompliment}</p>
        </div>
      {/if}

      <button
        on:click={getRandomCompliment}
        disabled={loading || compliments.length === 0}
        class="bg-gradient-to-r from-primary to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        style="min-height: 44px;"
      >
        Get a Compliment! ✨
      </button>
    </div>
  </div>
</div>