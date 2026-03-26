document.getElementById('enter-screen').addEventListener('click', function() {
    // 1. Fade out the overlay
    this.style.opacity = '0';
    setTimeout(() => {
        this.style.display = 'none';
    }, 500); // Waits for the CSS transition to finish

    // 2. Play the background music
    const audio = document.getElementById('bg-music');
    audio.volume = 0.4; // Sets volume to 40% so it isn't deafening
    audio.play().catch(error => {
        console.log("Audio playback was blocked or failed:", error);
    });

    // 3. Reveal the main content card
    const mainContent = document.getElementById('main-content');
    mainContent.classList.remove('hidden');
});