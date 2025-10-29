<script>
  import { onMount, onDestroy } from 'svelte';
  
  export let title;
  export let date;
  export let emoji;
  
  let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  let interval;
  let isVisible = true;
  let isPast = false;

  function calculateTimeLeft() {
    const target = new Date(date);
    const now = new Date();
    const diff = target - now;

    if (diff > 0) {
      isPast = false;
      timeLeft = {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      };
    } else {
      isPast = true;
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  }

  onMount(() => {
    calculateTimeLeft();
    interval = setInterval(() => {
      if (isVisible) calculateTimeLeft();
    }, 1000);

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) calculateTimeLeft();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  });

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });
</script>

<div class="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow">
  <div class="flex items-center justify-between mb-3">
    <h3 class="text-lg font-semibold text-gray-800">{title}</h3>
    <span class="text-3xl">{emoji}</span>
  </div>
  
  {#if isPast}
    <div class="text-center py-4">
      <p class="text-primary font-semibold">This special day has passed! 🎉</p>
    </div>
  {:else}
    <div class="grid grid-cols-4 gap-3 text-center">
      <div class="bg-cream rounded-lg p-2">
        <div class="text-2xl font-bold text-primary">{timeLeft.days}</div>
        <div class="text-xs text-gray-500 font-medium">Days</div>
      </div>
      <div class="bg-cream rounded-lg p-2">
        <div class="text-2xl font-bold text-primary">{timeLeft.hours}</div>
        <div class="text-xs text-gray-500 font-medium">Hours</div>
      </div>
      <div class="bg-cream rounded-lg p-2">
        <div class="text-2xl font-bold text-primary">{timeLeft.minutes}</div>
        <div class="text-xs text-gray-500 font-medium">Mins</div>
      </div>
      <div class="bg-cream rounded-lg p-2">
        <div class="text-2xl font-bold text-primary">{timeLeft.seconds}</div>
        <div class="text-xs text-gray-500 font-medium">Secs</div>
      </div>
    </div>
  {/if}
</div>
