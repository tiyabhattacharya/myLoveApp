<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { supabase } from '../lib/supabaseClient.js';
  import imageCompression from 'browser-image-compression';
  import { v4 as uuidv4 } from 'uuid';
  
  const dispatch = createEventDispatcher();
  
  let photos = [];
  let uploading = false;
  let currentUser;
  let uploadProgress = '';

  async function loadPhotos() {
    try {
      const { data, error } = await supabase
        .from('memory_vault')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      photos = data || [];
    } catch (err) {
      console.error('Error loading photos:', err);
    }
  }

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB

    try {
      uploading = true;
      uploadProgress = 'Preparing upload...';
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      let fileToUpload = file;
      
      // Compress if needed
      if (file.size > maxSize) {
        uploadProgress = 'Compressing image...';
        fileToUpload = await imageCompression(file, {
          maxSizeMB: 4,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        });
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${uuidv4()}.${fileExt}`;
      
      uploadProgress = 'Uploading to cloud...';
      const { error: uploadError } = await supabase.storage
        .from('Gallery')
        .upload(fileName, fileToUpload, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('Gallery')
        .getPublicUrl(fileName);

      uploadProgress = 'Saving to gallery...';
      const { error: insertError } = await supabase.from('memory_vault').insert({
        uploader_id: user.id,
        photo_url: publicUrl
      });

      if (insertError) throw insertError;

      await loadPhotos();
      event.target.value = ''; // Reset input
      uploadProgress = '';
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
      uploadProgress = '';
    } finally {
      uploading = false;
    }
  }

  async function deletePhoto(photo) {
    if (!confirm('Delete this memory? This cannot be undone.')) return;

    try {
      // Extract filename from URL
      const urlParts = photo.photo_url.split('/');
      const fileName = urlParts.slice(-2).join('/'); // user_id/filename.ext

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('Gallery')
        .remove([fileName]);

      if (storageError) console.error('Storage delete error:', storageError);

      // Delete from database
      const { error: dbError } = await supabase
        .from('memory_vault')
        .delete()
        .eq('id', photo.id);

      if (dbError) throw dbError;

      await loadPhotos();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete photo: ' + err.message);
    }
  }

  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    currentUser = user;
    await loadPhotos();
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
    <h1 class="text-2xl font-script text-primary">Memory Vault</h1>
    <div class="w-11"></div>
  </div>

  <div class="p-4 max-w-4xl mx-auto">
    <!-- Upload Button -->
    <label class="block w-full bg-gradient-to-r from-primary to-pink-500 text-white text-center py-4 rounded-xl font-semibold mb-6 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0" style="min-height: 44px;">
      {#if uploading}
        <span class="flex items-center justify-center gap-2">
          <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          {uploadProgress}
        </span>
      {:else}
        <span>📸 Add Photo</span>
      {/if}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        on:change={handleUpload}
        disabled={uploading}
        class="hidden"
      />
    </label>

    <!-- Gallery Grid -->
    {#if photos.length > 0}
      <div class="grid grid-cols-3 md:grid-cols-4 gap-2">
        {#each photos as photo (photo.id)}
          <div class="relative aspect-square group animate-fade-in">
            <img 
              src={photo.photo_url} 
              alt="Memory" 
              class="w-full h-full object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow"
              loading="lazy"
            />
            {#if currentUser && photo.uploader_id === currentUser.id}
              <button
                on:click={() => deletePhoto(photo)}
                class="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                style="min-width: 44px; min-height: 44px;"
              >
                ×
              </button>
            {/if}
          </div>
        {/each}
      </div>
    {:else}
      <div class="text-center py-16">
        <div class="text-6xl mb-4">📸</div>
        <p class="text-gray-500 text-lg">No memories yet</p>
        <p class="text-gray-400 text-sm mt-2">Add your first photo to start building our vault!</p>
      </div>
    {/if}
  </div>
</div>