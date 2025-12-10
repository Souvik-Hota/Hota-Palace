import React, { useEffect, useState, useRef } from "react";
import "./styles.css";

export default function App() {
  const [year, setYear] = useState("");
  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState({ open: false, src: "", caption: "" });
  const [introDone, setIntroDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => setYear(new Date().getFullYear()), []);
  useEffect(() => {
    const timer = setTimeout(() => setIntroDone(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // ⭐ MUSIC AUTO-PLAY + BUTTON LOGIC (React-friendly)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Global handler: if user clicks/touches anywhere (except the music button)
    // and audio is paused, start playback. This allows starting the song by
    // interacting with any page control (menu, buttons, etc.).
    const globalPlayHandler = (e) => {
      try {
        const btn = document.getElementById("musicBtn");
        if (btn && (btn === e.target || btn.contains(e.target))) return; // music button handles itself
      } catch (err) {}

      if (audio.paused) {
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    };

    window.addEventListener("click", globalPlayHandler);
    window.addEventListener("touchstart", globalPlayHandler);

    return () => {
      window.removeEventListener("click", globalPlayHandler);
      window.removeEventListener("touchstart", globalPlayHandler);
    };
  }, []);

  // Toggle handler used by the music button
  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }

  // Photos
  const familyPhotos = [
    { src: "/assets/photos/family1.jpeg", caption: "Family time in the garden          ", type: "family" },
    { src: "/assets/photos/family2.jpeg", caption: "Sourav & Souvik", type: "family" },
    { src: "/assets/photos/family3.jpeg", caption: "Shibaprasad Hota", type: "family" },
    { src: "/assets/photos/family4.jpg", caption: "Special moments", type: "family" },
    { src: "/assets/photos/family5.jpeg", caption: "2025", type: "family" },
    { src: "/assets/photos/family6.jpeg", caption: "Souvik", type: "family" },
    { src: "/assets/photos/family7.jpeg", caption: "Special moments", type: "family" },
    { src: "/assets/photos/family8.jpeg", caption: "Delhi", type: "family" },
    { src: "/assets/photos/family9.jpeg", caption: "Special moments", type: "family" },
    { src: "/assets/photos/family10.jpeg", caption: "wedding ceremony", type: "family" }
  ];

  const housePhotos = [
    { src: "/assets/photos/house1.png", caption: "Hota Palace", type: "house" },
    { src: "/assets/photos/house2.jpeg", caption: "Hota Palace", type: "house" },
    { src: "/assets/photos/house3.png", caption: "Hota Palace", type: "house" },
    { src: "/assets/photos/house4.jpeg", caption: "Hota Palace", type: "house" },
    { src: "/assets/photos/house5.jpeg", caption: "The Symbol", type: "house" },
    { src: "/assets/photos/house6.jpeg", caption: "The view", type: "house" }
  ];

  const items = [...familyPhotos, ...housePhotos];
  const visible = filter === "all" ? items : items.filter(i => i.type === filter);

  function openLightbox(src, caption) {
    setLightbox({ open: true, src, caption });
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    setLightbox({ open: false, src: "", caption: "" });
    document.body.style.overflow = "";
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") closeLightbox();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={`site-wrapper ${menuOpen ? "menu-open" : ""}`}>

      {/* Hidden Background Music */}
      <audio ref={audioRef} id="backgroundMusic" src="/assets/music/theme.mp3" preload="auto" loop />

      {/* Entrance Animation */}
      <div className={`intro-overlay ${introDone ? "hide" : ""}`}>
        <h1 className="intro-title">
          {"Hota Palace".split("").map((letter, i) => (
            <span key={i} className="letter" style={{ animationDelay: `${i * 0.15}s` }}>
              {letter}
            </span>
          ))}
        </h1>
      </div>

      <header className="site-header">
        <div className="brand">Hota Palace</div>
        
        {/* Hamburger Menu Button (Mobile) */}
        <button 
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Menu */}
        <nav className={`site-nav ${menuOpen ? "open" : ""}`}>
          <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#gallery" onClick={() => setMenuOpen(false)}>Gallery</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#location" onClick={() => setMenuOpen(false)}>Location</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
      </header>

      {/* Fireflies Background */}
      <div className="fireflies">
        {Array.from({ length: 25 }).map((_, i) => (
          <span key={i} className="firefly"></span>
        ))}
      </div>

      <main>
        <section id="home" className="hero">
          <div className="hero-inner">
            <h1 className="premium-title">Welcome to Hota Palace</h1>

            {/* Music Button */}
            <button
              id="musicBtn"
              className={`premium-music-btn ${isPlaying ? "playing" : ""}`}
              onClick={toggleMusic}
              aria-pressed={isPlaying}
              aria-label={isPlaying ? "Pause music" : "Play music"}
            >
              <span className="icon">🎵</span>
              <span className="label">{isPlaying ? "Pause Music" : "Play Music"}</span>
              <span className="pulse"></span>
            </button>

            <p className="subline">Our family, our memories, our home.</p>

            <div className="hero-actions">
              <a href="#gallery" className="btn">View Gallery</a>
              <a href="#location" className="btn btn-ghost">Find Us</a>
            </div>
          </div>

          <div className="hero-ornaments" aria-hidden>
            <span className="blob b1" data-speed="2" />
            <span className="blob b2" data-speed="4" />
            <span className="blob b3" data-speed="6" />
          </div>
          {/* SPY Chat Floating Button */}
<a
  href="your-chat-link-here"
  target="_blank"
  rel="noopener noreferrer"
  className="spy-chat-wrapper"
  title="Open SPY Chat"
>
  <div className="spy-chat-circle">
    <img src="../assets/photos/spy-chat.png" alt="SPY Chat" className="spy-chat-logo" />
  </div>
</a>

        </section>

    <section id="members" className="section family-tree-section">
  <div className="section-head">
    <h2>Family Tree</h2>
    <p>Our complete family at a glance.</p>
  </div>

  <div className="family-tree">

    {/* 🔵 Level 1 — 1 Circle */}
    <div className="tree-level level-1">
      <div className="avatar big-circle">
        <img src="/assets/photos/member_admin1.png" alt="Family Head" />
      </div>
    </div>

    {/* 🔵 Level 2 — 8 Circles */}
    <div className="tree-level level-2">
      {[
        "member1.jpeg",
        "member2.png",
        "member3.png",
        "member4.jpeg",
        "member5.jpeg",
        "member6.jpeg",
        "member7.png",
        "member8.jpeg",
      ].map((img, i) => (
        <div key={i} className="avatar">
          <img src={`/assets/photos/${img}`} alt={`Member ${i + 1}`} />
        </div>
      ))}
    </div>

    {/* 🔵 Level 3 — 8 Circles */}
    <div className="tree-level level-3">
      {[
        "member9.jpeg",
        "member10.png",
        "member11.jpeg",
        "member12.jpeg",
        "member13.jpeg",
        "member14.png",
        "member15.jpeg",
        "member16.jpeg",
      ].map((img, i) => (
        <div key={i} className="avatar small-circle">
          <img src={`/assets/photos/${img}`} alt={`Child ${i + 1}`} />
        </div>
      ))}
    </div>

  </div>
</section>



        <section id="gallery" className="section">
          <div className="section-head">
            <h2>Photo Gallery</h2>
            <p>Family moments and our beautiful home.</p>

            <div className="filters">
              <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>All</button>
              <button onClick={() => setFilter("family")} className={filter === "family" ? "active" : ""}>Family</button>
              <button onClick={() => setFilter("house")} className={filter === "house" ? "active" : ""}>House</button>
            </div>
          </div>

          <div className="gallery-grid">
            {visible.map((it, idx) => (
              <div key={idx} className="card-img" onClick={() => openLightbox(it.src, it.caption)}>
                <img src={it.src} alt={it.caption} />
                <div className="badge">{it.type === "family" ? "Family" : "House"}</div>
                <div className="caption">{it.caption}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="section">
          <div className="two-col">
            <div>
              <h2>About Our Home</h2>
              <p>Hota Palace is where our stories began — a warm, welcoming place filled with laughter, celebrations, and everyday magic.</p>
              <p>Browse through the gallery to see the heart of our home, and check the map to find us if you’re visiting.</p>
            </div>

            <div className="card">
              <h3>Quick facts</h3>
              <ul>
                <li>Family-first home</li>
                <li>Open garden and cozy corners</li>
                <li>Always welcome guests</li>
              </ul>
            </div>
          </div>

        </section>
        {/* 🔔 Premium Notice Section */}
<section id="notice" className="notice-section">
  <div className="notice-card">
    <h2 className="notice-title">📢 Upcoming Events</h2>

    <div className="notice-list">
      <div className="notice-row">
        <span className="dot"></span>
        <p>🎂 Souvik’s Birthday – 28th February </p>
      </div>

      <div className="notice-row">
        <span className="dot"></span>
        <p>💍 Parents’ Anniversary – </p>
      </div>

      <div className="notice-row">
        <span className="dot"></span>
        <p>📜 Family Ritual – </p>
      </div>

      <div className="notice-row">
        <span className="dot"></span>
        <p>🏡 Home Puja – </p>
      </div>
    </div>
  </div>
</section>


        <section id="location" className="section">
          <h2>Location</h2>
          <div className="map-wrap">
            <iframe
              title="Hota Palace Location"
              loading="lazy"
              allowFullScreen
              src="https://www.google.com/maps?q=23.2466236,87.0549339&z=17&output=embed"
            ></iframe>
          </div>
        </section>

        <section id="contact" className="section">
          <h2>Contact</h2>
          <div className="contact-cards">
            <div className="card"><h3>Address</h3><p>Malancha, Bankura, West Bengal, Bharat</p></div>
            <div className="card"><h3>Email</h3><p><a href="mailto:you@example.com">you@example.com</a></p></div>
            <div className="card"><h3>Phone</h3><p><a href="tel:+1234567890">+1 234 567 890</a></p></div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>© {year} Hota Palace — Made with love.</p>
      </footer>

      {/* Lightbox */}
      <div
        className={`lightbox ${lightbox.open ? "" : "hidden"}`}
        onClick={(e) => {
          if (e.target.classList.contains("lightbox")) closeLightbox();
        }}
      >
        <button className="lightbox-close" onClick={closeLightbox}>×</button>
        <img src={lightbox.src} alt={lightbox.caption} />
        <div className="caption">{lightbox.caption}</div>
      </div>
    </div>
  );
}
