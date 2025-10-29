<script>
  import { onMount } from 'svelte';
  import { supabase } from './lib/supabaseClient.js';
  import Login from './components/Login.svelte';
  import Home from './components/Home.svelte';
  import Gallery from './components/Gallery.svelte';
  import LoveNotes from './components/LoveNotes.svelte';
  import Compliment from './components/Compliment.svelte';
  import FutureDates from './components/FutureDates.svelte';
  import Playlist from './components/Playlist.svelte';
  import Gratitude from './components/Gratitude.svelte';

  let session = null;
  let currentView = 'home';

  onMount(() => {
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      session = sess;
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      session = sess;
    });

    return () => subscription.unsubscribe();
  });

  function navigate(view) {
    currentView = view;
    window.scrollTo(0, 0);
  }
</script>

<main class="min-h-screen">
  {#if !session}
    <Login />
  {:else}
    {#if currentView === 'home'}
      <Home on:navigate={(e) => navigate(e.detail)} />
    {:else if currentView === 'gallery'}
      <Gallery on:back={() => navigate('home')} />
    {:else if currentView === 'notes'}
      <LoveNotes on:back={() => navigate('home')} />
    {:else if currentView === 'compliment'}
      <Compliment on:back={() => navigate('home')} />
    {:else if currentView === 'dates'}
      <FutureDates on:back={() => navigate('home')} />
    {:else if currentView === 'playlist'}
      <Playlist on:back={() => navigate('home')} />
    {:else if currentView === 'gratitude'}
      <Gratitude on:back={() => navigate('home')} />
    {/if}
  {/if}
</main>