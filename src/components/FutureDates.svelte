<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { supabase } from '../lib/supabaseClient.js';
  
  const dispatch = createEventDispatcher();
  
  let dates = [];
  let filter = 'all';
  let loading = true;
  let newIdea = '';
  let newCategory = 'At Home';
  let showAddForm = false;

  async function loadDates() {
    try {
      loading = true;
      const { data, error } = await supabase
        .from('future_dates')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      dates = data || [];
    } catch (err) {
      console.error('Error loading dates:', err);
    } finally {
      loading = false;
    }
  }

  async function toggleStatus(date) {
    try {
      const { error } = await supabase
        .from('future_dates')
        .update({ status: !date.status })
        .eq('id', date.id);
      
      if (error) throw error;
      await loadDates();
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  }

  async function addNewIdea() {
    if (!newIdea.trim()) return;
    
    try {
      const { error } = await supabase
        .from('future_dates')
        .insert({ 
          title: newIdea.trim(), 
          category: newCategory,
          status: false 
        });
      
      if (error) throw error;
      
      newIdea = '';
      showAddForm = false;
      await loadDates();
    } catch (err) {
      console.error('Error adding idea:', err);
      alert('Failed to add idea');
    }
  }

  onMount(() => {
    loadDates();
  });

  $: filteredDates = dates.filter(d => {
    if (filter === 'todo') return !d.status;
    if (filter === 'done') return d.status;
    return true;
  });

  function getCategoryEmoji(category) {
    if (category === 'Birthday' || category === 'Anniversary') return '🎉';
    if (category === 'At Home') return '🏠';
    if (category === 'Outdoors') return '🌳';
    if (category === 'Expensive') return '💎';
    return '📅';
  }
</script>

<div class="min-h-screen bg-cream">
  <!-- Header -->
  <div class="sticky top-0 bg-white shadow-md z-20 p-4">
    <div class="flex items-center justify-between mb-4">
      <button 
        on:click={() => dispatch('back')} 
        class="text-primary text-3xl hover:scale-110 transition-transform"
        style="min-width: 44px; min-height: 44px;"
      >
        ←
      </button>
      <h1 class="text-2xl font-script text-primary">Future Dates</h1>
      <button
        on:click={() => showAddForm = !showAddForm}
        class="text-primary text-3xl hover:scale-110 transition-transform"
        style="min-width: 44px; min-height: 44px;"
      >
        +
      </button>
    </div>

    <!-- Filter Buttons -->
    <div class="flex gap-2 justify-center">
      <button
        on:click={() => filter = 'all'}
        class="px-4 py-2 rounded-full text-sm font-semibold transition"
        class:bg-primary={filter === 'all'}
        class:text-white={filter === 'all'}
        class:bg-white={filter !== 'all'}
        class:text-gray-600={filter !== 'all'}
      >
        All
      </button>
      <button
        on:click={() => filter = 'todo'}
        class="px-4 py-2 rounded-full text-sm font-semibold transition"
        class:bg-primary={filter === 'todo'}
        class:text-white={filter === 'todo'}
        class:bg-white={filter !== 'todo'}
        class:text-gray-600={filter !== 'todo'}
      >
        To Do
      </button>
      <button
        on:click={() => filter = 'done'}
        class="px-4 py-2 rounded-full text-sm font-semibold transition"
        class:bg-primary={filter === 'done'}
        class:text-white={filter === 'done'}
        class:bg-white={filter !== 'done'}
        class:text-gray-600={filter !== 'done'}
      >
        Done
      </button>
    </div>
  </div>

  <div class="p-4 space-y-3 max-w-2xl mx-auto pb-8">
    <!-- Add Form -->
    {#if showAddForm}
      <div class="bg-white rounded-xl p-4 shadow-lg animate-fade-in">
        <input
          type="text"
          bind:value={newIdea}
          placeholder="Enter date idea..."
          class="w-full px-4 py-2 border-2 border-accent rounded-lg mb-3 outline-none focus:border-primary"
        />
        <select
          bind:value={newCategory}
          class="w-full px-4 py-2 border-2 border-accent rounded-lg mb-3 outline-none focus:border-primary"
        >
          <option value="At Home">🏠 At Home</option>
          <option value="Outdoors">🌳 Outdoors</option>
          <option value="Expensive">💎 Expensive</option>
        </select>
        <div class="flex gap-2">
          <button
            on:click={addNewIdea}
            class="flex-1 bg-primary text-white py-2 rounded-lg font-semibold hover:bg-opacity-90"
            style="min-height: 44px;"
          >
            Add
          </button>
          <button
            on:click={() => showAddForm = false}
            class="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300"
            style="min-height: 44px;"
          >
            Cancel
          </button>
        </div>
      </div>
    {/if}

    <!-- Dates List -->
    {#if loading}
      <div class="text-center py-16">
        <div class="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    {:else if filteredDates.length > 0}
      {#each filteredDates as date (date.id)}
        <button
          on:click={() => toggleStatus(date)}
          class="w-full bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 text-left flex items-center gap-4 animate-fade-in"
          style="min-height: 44px;"
        >
          <div class="flex-shrink-0">
            <div 
              class="w-6 h-6 rounded border-2 flex items-center justify-center transition-colors"
              class:bg-primary={date.status}
              class:border-primary={date.status}
              class:border-gray-300={!date.status}
            >
              {#if date.status}
                <span class="text-white text-sm">✓</span>
              {/if}
            </div>
          </div>
          
          <div class="flex-1">
            <div 
              class="font-semibold transition-all"
              class:line-through={date.status}
              class:text-gray-400={date.status}
              class:text-gray-800={!date.status}
            >
              {date.title}
            </div>
            {#if date.category}
              <div class="text-sm text-gray-500 mt-1">
                {getCategoryEmoji(date.category)} {date.category}
              </div>
            {/if}
            {#if date.target_date}
              <div class="text-xs text-gray-400 mt-1">
                📅 {new Date(date.target_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            {/if}
          </div>
        </button>
      {/each}
    {:else}
      <div class="text-center py-16">
        <div class="text-6xl mb-4">📅</div>
        <p class="text-gray-500">No dates in this category</p>
      </div>
    {/if}
  </div>
</div>