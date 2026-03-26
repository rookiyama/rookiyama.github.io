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

document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bg-music');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const volumeSlider = document.getElementById('volume-slider');

    // Sync initial volume
    if (bgMusic && volumeSlider) {
        bgMusic.volume = volumeSlider.value;
    }

    // Toggle play/pause
    playPauseBtn?.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            bgMusic.pause();
            pauseIcon.style.display = 'none';
            playIcon.style.display = 'block';
        }
    });

    // Handle volume adjustment
    volumeSlider?.addEventListener('input', (e) => {
        bgMusic.volume = e.target.value;
    });

    // Don't forget: Update your existing enter screen logic 
    // to toggle these icons appropriately if the music auto-plays on enter!
    const enterScreen = document.getElementById('enter-screen');
    enterScreen?.addEventListener('click', () => {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    });

        // --- 1. Parallax Cursor Effect ---
    const mainContent = document.getElementById('main-content');
    
    document.addEventListener('mousemove', (e) => {
        if (!mainContent || mainContent.classList.contains('hidden')) return;
        
        // Calculate tilt angles based on cursor position relative to window center
        const xAxis = (window.innerWidth / 2 - e.pageX) / 100;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 100;
        
        mainContent.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });

    // Reset rotation when the mouse leaves the page entirely
    document.addEventListener('mouseleave', () => {
        if (mainContent) mainContent.style.transform = `rotateY(0deg) rotateX(0deg)`;
    });


    // --- 2. Track Duration Logic ---
    const progressSlider = document.getElementById('progress-slider');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    
    // Helper format function (e.g., 85 seconds -> "1:25")
    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    if (bgMusic && progressSlider) {
        const initDuration = () => {
            progressSlider.max = Math.floor(bgMusic.duration);
            totalTimeEl.textContent = formatTime(bgMusic.duration);
        };

        // Initialize total duration once metadata loads or if already preloaded
        if (bgMusic.readyState >= 1) {
            initDuration();
        } else {
            bgMusic.addEventListener('loadedmetadata', initDuration);
        }

        // Update progress bar as song plays
        bgMusic.addEventListener('timeupdate', () => {
            progressSlider.value = Math.floor(bgMusic.currentTime);
            currentTimeEl.textContent = formatTime(bgMusic.currentTime);
        });

    }

});
