document.addEventListener('DOMContentLoaded', function () {
    const audioPlayer = document.getElementById('audio-player');
    const playlist = document.getElementById('playlist');
    const tracks = playlist.getElementsByTagName('li');
    let currentTrack = 0;

    function loadTrack(index) {
        const src = tracks[index].getAttribute('data-src');
        audioPlayer.src = src;
        updatePlaylistStyles(index);
        audioPlayer.playbackRate = 1; // Ensure playback rate is normal
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
});

