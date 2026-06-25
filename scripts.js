document.addEventListener('DOMContentLoaded', function () {
    /* ---------- Footer year ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Music player ---------- */
    const audioPlayer = document.getElementById('audio-player');
    const playlist = document.getElementById('playlist');
    const nowPlaying = document.getElementById('now-playing');
    const tracks = playlist ? Array.from(playlist.getElementsByTagName('li')) : [];
    let currentTrack = 0;

    const trackCount = document.getElementById('track-count');
    if (trackCount) trackCount.textContent = tracks.length;

    function trackTitle(li) {
        const t = li.querySelector('.title');
        return t ? t.textContent.trim() : '';
    }

    function loadTrack(index, autoplay) {
        currentTrack = index;
        const li = tracks[index];
        audioPlayer.src = li.getAttribute('data-src');
        audioPlayer.playbackRate = 1;

        tracks.forEach(t => { t.classList.remove('current-track', 'is-playing'); });
        li.classList.add('current-track');
        if (nowPlaying) {
            nowPlaying.textContent = trackTitle(li);
            // retrigger crossfade animation
            nowPlaying.classList.remove('swap');
            void nowPlaying.offsetWidth;
            nowPlaying.classList.add('swap');
        }

        if (autoplay) {
            const p = audioPlayer.play();
            if (p && p.catch) p.catch(() => { /* autoplay blocked — ignore */ });
        }
    }

    tracks.forEach((li, i) => {
        const activate = () => {
            if (i === currentTrack && !audioPlayer.paused) {
                audioPlayer.pause();
            } else {
                loadTrack(i, true);
            }
        };
        li.addEventListener('click', activate);
        li.addEventListener('keydown', (e) => {
            if (e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); activate(); }
        });
    });

    audioPlayer.addEventListener('play', () => {
        const li = tracks[currentTrack];
        if (li) li.classList.add('is-playing');
    });
    audioPlayer.addEventListener('pause', () => {
        const li = tracks[currentTrack];
        if (li) li.classList.remove('is-playing');
    });
    audioPlayer.addEventListener('ended', () => {
        loadTrack((currentTrack + 1) % tracks.length, true);
    });
    audioPlayer.addEventListener('ratechange', () => {
        if (audioPlayer.playbackRate !== 1) audioPlayer.playbackRate = 1;
    });

    if (tracks.length) loadTrack(0, false);

    /* ---------- Keyboard transport ---------- */
    document.addEventListener('keydown', (e) => {
        const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
        if (typing || !tracks.length) return;

        if (e.code === 'Space' && e.target === document.body) {
            e.preventDefault();
            audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
        }
        if (e.code === 'ArrowRight') loadTrack((currentTrack + 1) % tracks.length, true);
        if (e.code === 'ArrowLeft') loadTrack((currentTrack - 1 + tracks.length) % tracks.length, true);
    });

    /* ---------- Sticky nav state ---------- */
    const nav = document.getElementById('nav');
    if (nav) {
        const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---------- Scroll reveals (progressive enhancement) ---------- */
    const reveals = Array.from(document.querySelectorAll('.reveal'));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce || !('IntersectionObserver' in window)) {
        reveals.forEach(el => el.classList.add('in'));
    } else {
        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        reveals.forEach(el => io.observe(el));

        // Safety net: anything still hidden after load gets revealed.
        window.addEventListener('load', () => {
            setTimeout(() => reveals.forEach(el => el.classList.add('in')), 1200);
        });
    }
});
