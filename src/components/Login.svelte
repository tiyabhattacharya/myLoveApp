<script>
  import { supabase, ALLOWED_EMAILS} from '../lib/supabaseClient.js';
  
  let email = '';
  let loading = false;
  let message = '';
  let error = '';

  async function handleLogin() {
    if (!ALLOWED_EMAILS.includes(email.toLowerCase().trim())) {
  error = 'This app is private. Only allowed emails can sign in.';
  return;
    }

    try {
      loading = true;
      error = '';
      const { error: signInError } = await supabase.auth.signInWithOtp({ 
        email: email.trim() 
      });
      
      if (signInError) throw signInError;
      
      message = 'Check your email for the magic link! 💌';
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary via-accent to-cream">
  <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-fade-in">
    <div class="text-center mb-8">
      <div class="text-6xl mb-4 animate-heartbeat">💕</div>
      <h1 class="text-4xl font-script text-primary mb-2">Our Love App</h1>
      <p class="text-gray-600">A space just for us</p>
    </div>

    <form on:submit|preventDefault={handleLogin} class="space-y-4">
      <div>
        <input
          type="email"
          bind:value={email}
          placeholder="Enter your email"
          class="w-full px-4 py-3 rounded-xl border-2 border-accent focus:border-primary outline-none transition"
          required
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        class="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending magic link...' : 'Sign In with Magic Link'}
      </button>
    </form>

    {#if message}
      <p class="mt-4 text-center text-green-600 text-sm animate-fade-in">{message}</p>
    {/if}
    
    {#if error}
      <p class="mt-4 text-center text-red-600 text-sm animate-fade-in">{error}</p>
    {/if}

    <p class="mt-6 text-center text-xs text-gray-500">
      Made with 💕 
    </p>
  </div>
</div>