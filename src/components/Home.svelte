<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { supabase } from '../lib/supabaseClient.js';
  import CountdownCard from './CountdownCard.svelte';
  import HugButton from './HugButton.svelte';
  
  const dispatch = createEventDispatcher();
  
  const greetings = ["How's my baby?", "What you doing handsome?", "Missing me?"];
  let currentGreeting = 0;
  let greetingInterval;
  let userName = 'Bubu';

  onMount(async () => {
    greetingInterval = setInterval(() => {
      currentGreeting = (currentGreeting + 1) % greetings.length;
    }, 6000);

    // Get user info
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.email) {
      userName = user.email === 'ayya@love.com' ? 'Bubu' : 'Love';
    }
  });

  onDestroy(() => {
    if (greetingInterval) clearInterval(greetingInterval);
  });

  const navItems = [
    { label: 'Love Notes', view: 'notes', icon: '💌', color: 'from-pink-400 to-pink-500' },
    { label: 'Gallery', view: 'gallery', icon: '📸', color: 'from-purple-400 to-purple-500' },
    { label: 'Compliment', view: 'compliment', icon: '💝', color: 'from-red-400 to-red-500' },
    { label: 'Future Dates', view: 'dates', icon: '📅', color: 'from-blue-400 to-blue-500' },
    { label: 'Playlist', view: 'playlist', icon: '🎵', color: 'from-green-400 to-green-500' },
    { label: 'Gratitude', view: 'gratitude', icon: '🙏', color: 'from-yellow-400 to-yellow-500' }
  ];

  async function handleSignOut() {
    await supabase.auth.signOut();
  }
</script>

<div class="min-h-screen bg-cream pb-6">
  <!-- Hero Section -->
  <div class="relative h-[45vh] bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 opacity-20">
      <div class="absolute top-10 left-10 text-6xl animate-heartbeat">💕</div>
      <div class="absolute bottom-10 right-10 text-6xl animate-heartbeat" style="animation-delay: 0.5s;">💕</div>
      <div class="absolute top-1/2 left-1/4 text-4xl animate-heartbeat" style="animation-delay: 1s;">❤️</div>
    </div>
    
    <div class="z-10 text-center px-4">
      <h1 class="text-4xl md:text-5xl font-script text-white mb-2 animate-fade-in">
        {greetings[currentGreeting]}
      </h1>
      <p class="text-white text-opacity-90 text-lg">Hey {userName}! 💕</p>
    </div>

    <button 
      on:click={handleSignOut}
      class="absolute top-4 right-4 text-white text-opacity-80 hover:text-opacity-100 text-sm"
    >
      Sign Out
    </button>
  </div>

  <div class="px-4 py-6 space-y-6 max-w-2xl mx-auto">
    <!-- Countdowns -->
    <div class="space-y-4">
      <h2 class="text-2xl font-semibold text-gray-800 font-script">Counting Down To...</h2>
      <CountdownCard 
        title="Ayush's Birthday" 
        date={import.meta.env.VITE_AYUSH_BDAY} 
        emoji="🎂" 
      />
      <CountdownCard 
        title="My Birthday" 
        date={import.meta.env.VITE_MY_BDAY} 
        emoji="🎉" 
      />
      <CountdownCard 
        title="Our Anniversary" 
        date={import.meta.env.VITE_ANNIVERSARY} 
        emoji="❤️" 
      />
    </div>

    <!-- Hug Button -->
    <HugButton />

    <!-- Navigation Grid -->
    <div class="space-y-3">
      <h2 class="text-2xl font-semibold text-gray-800 font-script">Explore</h2>
      <div class="grid grid-cols-2 gap-4">
        {#each navItems as item}
          <button
            on:click={() => dispatch('navigate', item.view)}
            class="bg-gradient-to-br {item.color} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 min-h-[120px] flex flex-col items-center justify-center"
            style="min-height: 44px;"
          >
            <div class="text-5xl mb-2">{item.icon}</div>
            <div class="text-white font-semibold text-center">{item.label}</div>
          </button>
        {/each}
      </div>
    </div>
  </div>
</div>
