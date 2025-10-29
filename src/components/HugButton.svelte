<script>
  import { onMount } from 'svelte';
  import { supabase } from '../lib/supabaseClient.js';
  
  let hugCount = 0;
  let showAnimation = false;
  let sending = false;

  async function loadHugCount() {
    try {
      const { count, error } = await supabase
        .from('hugs')
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        hugCount = count || 0;
      }
    } catch (err) {
      console.error('Error loading hug count:', err);
    }
  }

  async function sendHug() {
    if (sending) return;
    
    try {
      sending = true;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      showAnimation = true;
      hugCount += 1; // Optimistic update

      const { error } = await supabase.from('hugs').insert({ sender_id: user.id });
      
      if (error) {
        hugCount -= 1; // Revert on error
        console.error('Error sending hug:', error);
      }

      setTimeout(() => {
        showAnimation = false;
      }, 1200);
    } catch (err) {
      console.error('Error:', err);
      hugCount -= 1;
    } finally {
      sending = false;
    }
  }

  onMount(() => {
    loadHugCount();
  });
</script>

<div class="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
  <div class="text-5xl mb-3 animate-heartbeat">🤗</div>
  <div class="text-4xl font-bold text-primary mb-1">{hugCount}</div>
  <div class="text-sm text-gray-500 mb-4">virtual hugs sent</div>
  
  <button
    on:click={sendHug}
    disabled={sending}
    class="w-full bg-gradient-to-r from-primary to-pink-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    style="min-height: 44px;"
  >
    {sending ? 'Sending...' : 'Send a Hug 💕'}
  </button>

  {#if showAnimation}
    <div class="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      <div class="text-9xl animate-heartbeat opacity-90">💕</div>
    </div>
  {/if}
</div>