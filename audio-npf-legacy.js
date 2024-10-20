document.addEventListener("DOMContentLoaded", function () {
    const playSVG = `
    <svg class='play-audio' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 512 512'>
      <g><path fill-rule='evenodd' d='M468.8 235.007 67.441 3.277A24.2 24.2 0 0 0 55.354-.008h-.07A24.247 24.247 0 0 0 43.19 3.279a24 24 0 0 0-12.11 20.992v463.456a24.186 24.186 0 0 0 36.36 20.994L468.8 276.99a24.238 24.238 0 0 0 0-41.983z' fill='currentColor'></path></g>
    </svg>
  `;

    const pauseSVG = `
    <svg class='pause-audio' xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 47.607 47.607'>
      <g><path d='M17.991 40.976a6.631 6.631 0 0 1-13.262 0V6.631a6.631 6.631 0 0 1 13.262 0v34.345zM42.877 40.976a6.631 6.631 0 0 1-13.262 0V6.631a6.631 6.631 0 0 1 13.262 0v34.345z' fill='currentColor'></path></g>
    </svg>
  `;

    const createCustomPlayer = (caption) => {
        const customPlayer = document.createElement("div");
        customPlayer.classList.add("custom-audio-player");
        customPlayer.innerHTML = `
            <div class="custom-controls">
                <button class="play-pause" aria-label="Play audio">
                    ${ playSVG }
                </button>
            </div>
        `;
        caption.appendChild(customPlayer);
        return customPlayer.querySelector(".play-pause");
    };

    const handleAudioPosts = () => {
        const audioPosts = document.querySelectorAll(".tmblr-full");

        audioPosts.forEach((post) => {
            const caption = post.querySelector(".audio-caption");
            const audio = post.querySelector("audio");
            const nativePlayer = post.querySelector(".audio_player");

            // Handle regular audio posts
            if (caption && audio && !audio.dataset.handled) {
                audio.dataset.handled = true;

                audio.style.display = "none";

                const playPauseButton = createCustomPlayer(caption);

                playPauseButton.addEventListener("click", () => {
                    if (audio.paused) {
                        audio.play();
                        playPauseButton.innerHTML = pauseSVG;
                        playPauseButton.setAttribute("aria-label", "Pause audio");
                    } else {
                        audio.pause();
                        playPauseButton.innerHTML = playSVG;
                        playPauseButton.setAttribute("aria-label", "Play audio");
                    }
                });

                audio.addEventListener("play", () => {
                    playPauseButton.innerHTML = pauseSVG;
                    playPauseButton.setAttribute("aria-label", "Pause audio");
                });

                audio.addEventListener("pause", () => {
                    playPauseButton.innerHTML = playSVG;
                    playPauseButton.setAttribute("aria-label", "Play audio");
                });
            }

            // Handle legacy audio posts
            if (caption && nativePlayer && !nativePlayer.dataset.handled) {
                nativePlayer.dataset.handled = true;

                nativePlayer.style.display = "none";

                const audioSrc = nativePlayer.querySelector("iframe").src;
                const legacyAudio = document.createElement("audio");
                legacyAudio.src = getAudioSource(audioSrc);

                const playPauseButton = createCustomPlayer(caption);

                playPauseButton.addEventListener("click", () => {
                    if (legacyAudio.paused) {
                        legacyAudio.play();
                        playPauseButton.innerHTML = pauseSVG;
                        playPauseButton.setAttribute("aria-label", "Pause audio");
                    } else {
                        legacyAudio.pause();
                        playPauseButton.innerHTML = playSVG;
                        playPauseButton.setAttribute("aria-label", "Play audio");
                    }
                });

                legacyAudio.addEventListener("play", () => {
                    playPauseButton.innerHTML = pauseSVG;
                    playPauseButton.setAttribute("aria-label", "Pause audio");
                });

                legacyAudio.addEventListener("pause", () => {
                    playPauseButton.innerHTML = playSVG;
                    playPauseButton.setAttribute("aria-label", "Play audio");
                });

                legacyAudio.addEventListener("ended", () => {
                    playPauseButton.innerHTML = playSVG;
                    playPauseButton.setAttribute("aria-label", "Play audio");
                });
            }
        });
    };

    const getAudioSource = (src) => {
        let audioSrc = decodeURIComponent(src)
            .split("audio_file=")[1]
            .split("&color=")[0];
        if (!audioSrc.includes(".mp3")) {
            const tempSrc = audioSrc.split("/").pop();
            audioSrc = "https://a.tumblr.com/" + tempSrc + "o1.mp3";
        }
        return audioSrc;
    };

    handleAudioPosts();

    const observer = new MutationObserver(() => {
        handleAudioPosts();
    });

    observer.observe(document.body, { childList: true, subtree: true });
});
