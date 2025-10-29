<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  const playlists = [
    {
      name: 'Slow & Sweet',
      emoji: '🎶',
      color: 'from-pink-400 to-pink-600',
      songs: [
        { title: 'Perfect', artist: 'Ed Sheeran', url: 'https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v' },
        { title: 'Until I Found You', artist: 'Stephen Sanchez', url: 'https://open.spotify.com/track/0T5iIrXA4p5GsubkhuBIKV' },
        { title: 'The Night We Met', artist: 'Lord Huron', url: 'https://open.spotify.com/track/3hRV0jL3vUpRrcy398teAU' },
        { title: 'I Wanna Be Yours', artist: 'Arctic Monkeys', url: 'https://open.spotify.com/track/5XeFesFbtLpXzIVDNQP22n' }
      ]
    },
    {
      name: 'Date Night',
      emoji: '💕',
      color: 'from-red-400 to-red-600',
      songs: [
        { title: 'Dusk Till Dawn (feat. Sia)', artist: 'ZAYN', url: 'https://open.spotify.com/track/2gVOhnMkK8XngKgf0YdlXQ' },
        { title: 'Finding Her', artist: 'Various', url: 'https://open.spotify.com/track/5ThyDv6aRVU8AH4vXQNldF' },
        { title: 'Sab Tera', artist: 'Armaan Malik', url: 'https://open.spotify.com/track/2Rr8j88wr7SAYSwuekTJgx' }
      ]
    },
    {
      name: 'Throwback Love',
      emoji: '🎵',
      color: 'from-purple-400 to-purple-600',
      songs: [
        { title: 'Memories', artist: 'Maroon 5', url: 'https://open.spotify.com/track/2EqZwJJI43elRIoooZUIPJ' },
        { title: 'Tum Ho', artist: 'Various', url: 'https://open.spotify.com/track/3aruLKeDgDcms2JA8n30fh' },
        { title: 'Tum Se', artist: 'Various', url: 'https://open.spotify.com/track/1yWoosl79YwZfPPIqpczZp' },
        { title: 'Soch Na Sake', artist: 'Arijit Singh / Tulsi Kumar', url: 'https://open.spotify.com/track/6mTvwBzWTGDOVeCNQEqtOE' },
        { title: 'Kinna Sona', artist: 'Various', url: 'https://open.spotify.com/track/01AE1MgL6L86WQzh4KGDUa' },
        { title: 'Kaise Hua', artist: 'Vishal Mishra', url: 'https://open.spotify.com/track/1y1rQTkWmrZdJmjwuK07GC' }
      ]
    }
  ];
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
    <h1 class="text-2xl font-script text-primary">Our Playlist</h1>
    <div class="w-11"></div>
  </div>

  <div class="p-4 space-y-6 max-w-2xl mx-auto pb-8">
    {#each playlists as playlist}
      <div class="bg-white rounded-2xl p-5 shadow-lg animate-fade-in">
        <div class="flex items-center gap-3 mb-4">
          <div class="text-4xl">{playlist.emoji}</div>
          <h2 class="text-2xl font-semibold text-gray-800">{playlist.name}</h2>
        </div>
        
        <div class="space-y-2">
          {#each playlist.songs as song}
            <a
              href={song.url}
              target="_blank"
              rel="noopener noreferrer"
              class="block bg-gradient-to-r {playlist.color} text-white p-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
              style="min-height: 44px;"
            >
              <div class="font-semibold">{song.title}</div>
              <div class="text-sm text-white text-opacity-90">{song.artist}</div>
            </a>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>
