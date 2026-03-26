// Wrap everything in DOMContentLoaded to ensure HTML loads before JS runs
document.addEventListener('DOMContentLoaded', () => {
    
    // --- DOM Elements Caching ---
    // Caching elements here saves the browser from searching for them multiple times
    const enterScreen = document.getElementById('enter-screen');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');
    
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    
    const volumeSlider = document.getElementById('volume-slider');
    const volumeIcon = document.getElementById('volume-icon');
    const volumeMutedIcon = document.getElementById('volume-muted-icon');
    
    const progressSlider = document.getElementById('progress-slider');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');


    // --- 1. Initialization / Enter Screen ---
    enterScreen?.addEventListener('click', () => {
        // Fade out overlay
        enterScreen.style.opacity = '0';
        setTimeout(() => { enterScreen.style.display = 'none'; }, 500);

        // Start Music
        bgMusic.volume = volumeSlider ? volumeSlider.value : 0.4;
        bgMusic.play().catch(err => console.log("Audio blocked:", err));

        // Update UI Icons
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';

        // Reveal Main Card
        mainContent.classList.remove('hidden');
    });


    // --- 2. Audio Player Logic ---
    let previousVolume = 0.5;

    // Play/Pause Toggle
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

    // Mute/Unmute Logic
    const toggleMute = () => {
        if (bgMusic.volume > 0) {
            previousVolume = bgMusic.volume;
            bgMusic.volume = 0;
            volumeSlider.value = 0;
            volumeIcon.style.display = 'none';
            volumeMutedIcon.style.display = 'block';
        } else {
            const newVolume = previousVolume > 0 ? previousVolume : 0.5;
            bgMusic.volume = newVolume;
            volumeSlider.value = newVolume;
            volumeMutedIcon.style.display = 'none';
            volumeIcon.style.display = 'block';
        }
    };

    volumeIcon?.addEventListener('click', toggleMute);
    volumeMutedIcon?.addEventListener('click', toggleMute);

    // Volume Slider Drag
    volumeSlider?.addEventListener('input', (e) => {
        const currentVal = parseFloat(e.target.value);
        bgMusic.volume = currentVal;
        
        if (currentVal === 0) {
            volumeIcon.style.display = 'none';
            volumeMutedIcon.style.display = 'block';
        } else {
            volumeMutedIcon.style.display = 'none';
            volumeIcon.style.display = 'block';
            previousVolume = currentVal;
        }
    });

    // --- 3. Track Duration & Progress ---
    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    if (bgMusic && progressSlider) {
        
        // Function to dynamically fill the background track with neon blue
        const updateProgressFill = (current, total) => {
            const percentage = (current / total) * 100 || 0;
            // Uses CSS linear-gradient to color the left side blue and the right side gray
            progressSlider.style.background = `linear-gradient(to right, var(--neon-blue) ${percentage}%, rgba(255, 255, 255, 0.2) ${percentage}%)`;
        };

        const initDuration = () => {
            progressSlider.max = Math.floor(bgMusic.duration);
            totalTimeEl.textContent = formatTime(bgMusic.duration);
            updateProgressFill(bgMusic.currentTime, bgMusic.duration); // Set initial fill
        };

        if (bgMusic.readyState >= 1) {
            initDuration();
        } else {
            bgMusic.addEventListener('loadedmetadata', initDuration);
        }

        // Update the slider as the song plays naturally
        bgMusic.addEventListener('timeupdate', () => {
            progressSlider.value = Math.floor(bgMusic.currentTime);
            currentTimeEl.textContent = formatTime(bgMusic.currentTime);
            updateProgressFill(bgMusic.currentTime, bgMusic.duration);
        });
    }

    // --- 4. Optimized Parallax Effect ---
    let isTicking = false; // Used to prevent animation frame spam

    document.addEventListener('mousemove', (e) => {
        if (!mainContent || mainContent.classList.contains('hidden')) return;
        
        // requestAnimationFrame optimizes performance by syncing with monitor refresh rate
        if (!isTicking) {
            window.requestAnimationFrame(() => {
                const xAxis = (window.innerWidth / 2 - e.pageX) / 100;
                const yAxis = (window.innerHeight / 2 - e.pageY) / 100;
                mainContent.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;

                const bgMoveX = (window.innerWidth / 2 - e.pageX) / 50; 
                const bgMoveY = (window.innerHeight / 2 - e.pageY) / 50;
                document.body.style.backgroundPosition = `calc(50% + ${bgMoveX}px) calc(50% + ${bgMoveY}px)`;
                
                isTicking = false;
            });
            isTicking = true;
        }
    });

    document.addEventListener('mouseleave', () => {
        if (mainContent) mainContent.style.transform = `rotateY(0deg) rotateX(0deg)`;
        document.body.style.backgroundPosition = ''; 
    });

    // --- 5. Wind-Blown Snow Particles ---
    function createSnowParticle() {
        const particle = document.createElement('div');
        particle.classList.add('snow-particle');
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDuration = Math.random() * 3 + 2 + 's'; // Random duration
        particle.style.opacity = Math.random(); // Random opacity
        document.body.appendChild(particle);

        particle.addEventListener('animationend', () => particle.remove());
    }

    // --- 6. Tab Visibility Logic ---
    let snowInterval;

    // Function to start the snowstorm
    function startSnow() {
        if (!snowInterval) {
            snowInterval = setInterval(createSnowParticle, 50);
        }
    }

    // Function to pause the snowstorm
    function stopSnow() {
        clearInterval(snowInterval);
        snowInterval = null;
    }

    // Start the snow when the page first loads
    startSnow();

    // Listen for the user switching tabs or minimizing the browser
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopSnow(); // Pause when tab is inactive
        } else {
            startSnow(); // Resume when they come back
        }
    });
});