import React, { useRef, useState, useEffect } from "react";

export default function MusicButton({ src = "/assets/music/theme.mp3" }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(true); // music ON by default

  // 🔥 AUTOPLAY on load (with fade-in)
useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;

  // 1. Autoplay allowed only if muted
  audio.muted = true;
  audio.volume = 0;

  audio.play()
    .then(() => {
      console.log("Autoplay success!");

      // 2. Unmute + Fade-In after a short delay
      setTimeout(() => {
        audio.muted = false;

        let vol = 0;
        const fade = setInterval(() => {
          if (vol < 0.7) {
            vol += 0.05;
            audio.volume = vol;
          } else {
            clearInterval(fade);
          }
        }, 150);
      }, 800);
      
      setPlaying(true);
    })
    .catch(err => {
      console.log("Autoplay blocked:", err);
      setPlaying(false); // Show Play button
    });

}, []);


  // Smooth fade-in effect
  function fadeIn(audio) {
    let vol = 0;
    const fade = setInterval(() => {
      if (vol < 0.7) {
        vol += 0.05;
        audio.volume = vol;
      } else {
        clearInterval(fade);
      }
    }, 150);
  }

  // Smooth fade-out effect
  function fadeOut(audio) {
    return new Promise((resolve) => {
      let vol = audio.volume;
      const fade = setInterval(() => {
        if (vol > 0) {
          vol -= 0.05;
          audio.volume = Math.max(0, vol);
        } else {
          clearInterval(fade);
          resolve();
        }
      }, 150);
    });
  }

  // Play / Pause toggle
  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      // 🔇 Fade out then pause
      await fadeOut(audio);
      audio.pause();
      setPlaying(false);
    } else {
      // 🔊 Play and fade in
      await audio.play();
      fadeIn(audio);
      setPlaying(true);
    }
  }

  return (
    <div className="music-container">
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        loop
        playsInline
      />

   <button
  className={`music-circle ${playing ? "playing" : ""}`}
  onClick={toggleMusic}
  title={playing ? "Pause Theme" : "Play Theme"}
>
  <div className="music-icon">
    {playing ? (
      <span className="pause-icon">⏸</span>
    ) : (
      <span className="play-icon">▶</span>
    )}
  </div>
</button>

    </div>
  );
}
