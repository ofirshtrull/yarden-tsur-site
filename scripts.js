document.addEventListener('DOMContentLoaded', function () {
    const audioPlayer = document.getElementById('audio-player');
    const playlist = document.getElementById('playlist');
    const tracks = playlist.getElementsByTagName('li');
    let currentTrack = 0;

    function loadTrack(index) {
        const src = tracks[index].getAttribute('data-src');
        audioPlayer.src = src;
        updatePlaylistStyles(index);
        audioPlayer.playbackRate = 1;

        // Smooth scroll to current track
        tracks[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function updatePlaylistStyles(index) {
        for (let i = 0; i < tracks.length; i++) {
            tracks[i].classList.remove('current-track');
        }
        tracks[index].classList.add('current-track');
    }

    for (let i = 0; i < tracks.length; i++) {
        tracks[i].addEventListener('click', function () {
            currentTrack = i;
            loadTrack(currentTrack);
            audioPlayer.play();
        });
    }

    audioPlayer.addEventListener('ended', function () {
        currentTrack++;
        if (currentTrack >= tracks.length) {
            currentTrack = 0;
        }
        loadTrack(currentTrack);
        audioPlayer.play();
    });

    // Prevent playback speed changes
    audioPlayer.addEventListener('ratechange', function () {
        if (audioPlayer.playbackRate !== 1) {
            audioPlayer.playbackRate = 1;
        }
    });

    // Initialize without auto-playing
    loadTrack(currentTrack);

    // Add intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Add smooth parallax effect to header
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.querySelector('header');

        if (header) {
            const offset = scrollTop * 0.5;
            header.style.transform = `translateY(${offset}px)`;

            // Fade out header as you scroll
            const opacity = Math.max(0, 1 - (scrollTop / 400));
            header.style.opacity = opacity;
        }

        lastScrollTop = scrollTop;
    }, { passive: true });

    // Add keyboard controls for music player
    document.addEventListener('keydown', function(e) {
        // Space bar to play/pause
        if (e.code === 'Space' && e.target === document.body) {
            e.preventDefault();
            if (audioPlayer.paused) {
                audioPlayer.play();
            } else {
                audioPlayer.pause();
            }
        }
        // Arrow keys for next/previous track
        if (e.code === 'ArrowRight') {
            currentTrack = (currentTrack + 1) % tracks.length;
            loadTrack(currentTrack);
            audioPlayer.play();
        }
        if (e.code === 'ArrowLeft') {
            currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
            loadTrack(currentTrack);
            audioPlayer.play();
        }
    });
});

