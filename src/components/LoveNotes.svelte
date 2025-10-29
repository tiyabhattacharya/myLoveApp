<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { supabase } from '../lib/supabaseClient.js';
  
  const dispatch = createEventDispatcher();
  
  let notes = [];
  let selectedNote = null;
  let loading = true;

  async function loadNotes() {
    try {
      loading = true;
      const { data, error } = await supabase
        .from('love_notes')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      notes = data || [];
    } catch (err) {
      console.error('Error loading notes:', err);
    } finally {
      loading = false;
    }
  }

  function openNote(note) {
    selectedNote = note;
  }

  function closeNote() {
    selectedNote = null;
  }

  onMount(() => {
    loadNotes();
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
    <h1 class="text-2xl font-script text-primary">Love Notes</h1>
    <div class="w-11"></div>
  </div>

  <div class="p-4 space-y-3 max-w-2xl mx-auto pb-8">
    {#if loading}
      <div class="text-center py-16">
        <div class="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-500 mt-4">Loading love notes...</p>
      </div>
    {:else if notes.length > 0}
      {#each notes as note (note.id)}
        <button
          on:click={() => openNote(note)}
          class="w-full bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 text-left transform hover:-translate-y-1 active:translate-y-0 animate-fade-in"
          style="min-height: 44px;"
        >
          <div class="flex items-center justify-between">
            <div class="text-lg font-semibold text-gray-800 pr-2">{note.category}</div>
            <div class="text-2xl">💌</div>
          </div>
        </button>
      {/each}
    {:else}
      <div class="text-center py-16">
        <div class="text-6xl mb-4">💌</div>
        <p class="text-gray-500">No love notes yet</p>
      </div>
    {/if}
  </div>

  <!-- Modal -->
  {#if selectedNote}
    <div 
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in" 
      on:click={closeNote}
    >
      <div 
        class="bg-white rounded-2xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto shadow-2xl" 
        on:click|stopPropagation
      >
        {#if selectedNote.image_url}
          <img 
            src={selectedNote.image_url} 
            alt="" 
            class="w-full rounded-lg mb-4 shadow-md"
            loading="lazy"
          />
        {/if}
        
        <h2 class="text-2xl font-script text-primary mb-4">{selectedNote.category}</h2>
        <p class="text-gray-700 leading-relaxed whitespace-pre-line text-base mb-6">
          {selectedNote.message}
        </p>
        
        <button
          on:click={closeNote}
          class="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-opacity-90 transition"
          style="min-height: 44px;"
        >
          Close 💕
        </button>
      </div>
    </div>
  {/if}
</div>