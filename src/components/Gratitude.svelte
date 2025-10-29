<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { supabase } from '../lib/supabaseClient.js';
  
  const dispatch = createEventDispatcher();
  
  let latestEntry = null;
  let loading = true;

  async function loadLatestEntry() {
    try {
      loading = true;
      const { data, error } = await supabase
        .from('grateful_entries')
        .select('*')
        .order('grateful_date', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      latestEntry = data;
    } catch (err) {
      console.error('Error loading gratitude:', err);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadLatestEntry();
  });

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
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
    <h1 class="text-2xl font-script text-primary">Daily Gratitude</h1>
    <div class="w-11"></div>
  </div>

  <div class="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
    <div class="max-w-md w-full">
      {#if loading}
        <div class="text-center">
          <div class="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      {:else if latestEntry}
        <div class="bg-white rounded-2xl p-8 shadow-xl text-center animate-fade-in">
          <div class="text-6xl mb-6">🙏</div>
          <p class="text-sm text-gray-500 mb-4">{formatDate(latestEntry.grateful_date)}</p>
          <p class="text-xl text-gray-800 leading-relaxed italic">
            "{latestEntry.grateful_entry}"
          </p>
        </div>
      {:else}
        <div class="bg-white rounded-2xl p-8 shadow-xl text-center">
          <div class="text-6xl mb-4">🙏</div>
          <p class="text-gray-500">No gratitude entries yet</p>
          <p class="text-sm text-gray-400 mt-2">Check back soon for daily reflections</p>
        </div>
      {/if}
    </div>
  </div>
</div>