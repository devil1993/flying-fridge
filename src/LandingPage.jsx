import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import "./LandingPage.css";

const WALL = [
  { n: "Maya", r: "my mentor", c: "#ff7a59", c2: "#f1542e", t: "You believed in me before I believed in myself." },
  { n: "Dad", r: "my hero", c: "#6c5ce7", c2: "#a29bfe", t: "Thank you for every quiet sacrifice I never saw." },
  { n: "Priya", r: "my best friend", c: "#00b894", c2: "#55efc4", t: "You always show up — rain, shine, or 2am calls." },
  { n: "Mr. Lee", r: "my teacher", c: "#ffb547", c2: "#ff9f1c", t: "You made me love a subject I used to dread." },
  { n: "Sam", r: "my colleague", c: "#ff7a59", c2: "#ffb547", t: "You cover for me without ever keeping score." },
  { n: "Grandma", r: "my anchor", c: "#6c5ce7", c2: "#ff7a59", t: "Your kitchen still feels like the safest place on earth." },
  { n: "Rohan", r: "my brother", c: "#00b894", c2: "#0aa17e", t: "Annoying as ever — and the first to defend me." },
  { n: "Dr. Ada", r: "my doctor", c: "#a29bfe", c2: "#6c5ce7", t: "You listened when everyone else was in a hurry." },
];

const initial = (s) => s.trim()[0].toUpperCase();

function LandingPage() {
  const navigate = useNavigate();

  // Reveal-on-scroll for sections
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".lp .reveal").forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 80 + "ms";
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="lp">
      {/* ===================== HERO ===================== */}
      <section className="hero">
        <svg className="blob b1" width="420" height="420" viewBox="0 0 200 200">
          <path fill="#ffd9c2" d="M44,-62C56,-52,63,-37,68,-21C73,-5,75,12,69,26C62,40,46,51,30,58C13,65,-6,68,-25,63C-44,57,-63,43,-71,24C-78,5,-74,-19,-63,-37C-52,-55,-34,-66,-15,-70C5,-74,25,-72,44,-62Z" transform="translate(100 100)" />
        </svg>
        <svg className="blob b2" width="460" height="460" viewBox="0 0 200 200">
          <path fill="#e4defb" d="M41,-58C53,-49,62,-36,68,-21C73,-6,74,11,68,26C61,41,47,53,31,61C14,68,-4,71,-22,66C-40,61,-57,48,-66,30C-74,12,-73,-11,-64,-29C-56,-47,-39,-60,-21,-66C-3,-71,16,-67,41,-58Z" transform="translate(100 100)" />
        </svg>

        <div className="wrap">
          <div className="hero-grid">
            <div>
              <span className="pill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2l2.6 6.3L21 9l-5 4.3L17.5 21 12 17.3 6.5 21 8 13.3 3 9l6.4-.7L12 2Z" fill="#ffb547" /></svg>
                Made for the people who make your day
              </span>
              <h1>Tell people<br />they <span className="grad">matter.</span></h1>
              <p className="lede">
                Gratitude is a warm little corner of the internet where you write a few honest lines
                about the people you appreciate — then publish and share it with them.
              </p>
              <div className="hero-cta">
                <button className="btn btn-primary" onClick={() => navigate("/register")}>
                  Start writing
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button className="btn btn-ghost" onClick={() => scrollTo("how")}>See how it works</button>
              </div>
              <div className="trust">
                <div className="avatars">
                  <span style={{ background: "linear-gradient(135deg,#ff7a59,#f1542e)" }}>A</span>
                  <span style={{ background: "linear-gradient(135deg,#6c5ce7,#a29bfe)" }}>M</span>
                  <span style={{ background: "linear-gradient(135deg,#ffb547,#ff7a59)" }}>S</span>
                  <span style={{ background: "linear-gradient(135deg,#00b894,#55efc4)" }}>R</span>
                </div>
                <span>Thousands of thank-yous sent and counting.</span>
              </div>
            </div>

            <div className="hero-art">
              <div className="g-card float">
                <svg className="quote" width="46" height="46" viewBox="0 0 24 24" fill="#6c5ce7"><path d="M7 7h4v4c0 2.2-1.8 4-4 4v-2c1.1 0 2-.9 2-2H7V7Zm8 0h4v4c0 2.2-1.8 4-4 4v-2c1.1 0 2-.9 2-2h-2V7Z" /></svg>
                <div className="photo" style={{ background: "linear-gradient(135deg,#ff7a59,#f1542e)" }}>M</div>
                <div className="name">Maya</div>
                <div className="role">my mentor</div>
                <p className="note">"You believed in me before I believed in myself. Thank you for every patient nudge."</p>
              </div>
              <div className="sticker s1 float delay">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 20.5S3.5 14.6 3.5 8.9A4.4 4.4 0 0 1 12 6.7a4.4 4.4 0 0 1 8.5 2.2C20.5 14.6 12 20.5 12 20.5Z" fill="#f1542e" /></svg>
                Gratitude sent
              </div>
              <div className="sticker s2 float">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="6" cy="12" r="2.4" fill="#6c5ce7" /><circle cx="18" cy="6" r="2.4" fill="#ffb547" /><circle cx="18" cy="18" r="2.4" fill="#ff7a59" /><path d="M8 11l8-4M8 13l8 4" stroke="#a29bfe" strokeWidth="1.6" /></svg>
                Shared with Maya
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== WALL ===================== */}
      <section className="marquee-section" id="wall">
        <div className="wrap" style={{ textAlign: "center", marginBottom: 26 }}>
          <span className="eyebrow">The gratitude wall</span>
        </div>
        <Marquee gradient gradientColor={[255, 248, 242]} speed={40} pauseOnHover>
          {WALL.map((x, i) => (
            <div className="mini" key={i}>
              <div className="top">
                <div className="dot" style={{ background: `linear-gradient(135deg, ${x.c}, ${x.c2})` }}>{initial(x.n)}</div>
                <div><b>{x.n}</b><small>{x.r}</small></div>
              </div>
              <p>{x.t}</p>
            </div>
          ))}
        </Marquee>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="section-pad" id="how">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">How it works</span>
            <h2>Four small steps. One big feeling.</h2>
            <p>From a blank page to a message someone will keep forever — it takes about two minutes.</p>
          </div>
          <div className="steps">
            <div className="step reveal">
              <span className="num">1</span>
              <div className="ico">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" fill="#ff7a59" /><path d="M4 20c0-3.9 3.6-6 8-6s8 2.1 8 6" stroke="#f1542e" strokeWidth="2" strokeLinecap="round" /></svg>
              </div>
              <h3>Sign up</h3>
              <p>Create your free account in seconds and you're ready to start appreciating.</p>
            </div>
            <div className="step reveal">
              <span className="num">2</span>
              <div className="ico">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M4 20h4l10-10-4-4L4 16v4Z" fill="#6c5ce7" /><path d="M14 6l4 4" stroke="#a29bfe" strokeWidth="2" strokeLinecap="round" /></svg>
              </div>
              <h3>Write it down</h3>
              <p>Add a name, a photo, and a few honest lines about why this person matters.</p>
            </div>
            <div className="step reveal">
              <span className="num">3</span>
              <div className="ico">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M4 10v4l3 .5V9.5L4 10Z" fill="#ffb547" /><path d="M7 9.5L17 5v14L7 14.5" fill="#ff7a59" /><path d="M9 16l1 4h2l-1-4" fill="#f1542e" /></svg>
              </div>
              <h3>Publish</h3>
              <p>Turn your note into a beautiful, shareable gratitude card with one tap.</p>
            </div>
            <div className="step reveal">
              <span className="num">4</span>
              <div className="ico">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="6" cy="12" r="2.6" fill="#6c5ce7" /><circle cx="18" cy="6" r="2.6" fill="#00b894" /><circle cx="18" cy="18" r="2.6" fill="#ff7a59" /><path d="M8.2 11l7.6-4M8.2 13l7.6 4" stroke="#a29bfe" strokeWidth="1.8" /></svg>
              </div>
              <h3>Share</h3>
              <p>Send it straight to them — or post it to the wall for the whole world to smile at.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== WHY ===================== */}
      <div className="features-wrap" id="why">
        <section className="section-pad">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">Why Gratitude</span>
              <h2>Small thank-yous, surprisingly big impact.</h2>
              <p>Gratitude isn't just nice — it's good for you. We made the easiest way to give it away.</p>
            </div>
            <div className="features">
              <div className="feature reveal">
                <svg className="ico" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="6" fill="#fff1e8" /><path d="M12 17.5S6.5 14 6.5 10.4A2.9 2.9 0 0 1 12 9a2.9 2.9 0 0 1 5.5 1.4C17.5 14 12 17.5 12 17.5Z" fill="#f1542e" /></svg>
                <h3>Heartfelt, not generic</h3>
                <p>No templates, no fluff. Just your own words about a real person who made a difference.</p>
              </div>
              <div className="feature reveal">
                <svg className="ico" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="6" fill="#efeafe" /><path d="M8 12l2.5 2.5L16 9" stroke="#6c5ce7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <h3>Effortlessly beautiful</h3>
                <p>Every note becomes a clean, polished card — the kind people screenshot and keep.</p>
              </div>
              <div className="feature reveal">
                <svg className="ico" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="6" fill="#fff5e0" /><path d="M12 7v5l3 2" stroke="#ffb547" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="6.5" stroke="#ff9f1c" strokeWidth="1.4" /></svg>
                <h3>Two minutes, tops</h3>
                <p>Appreciation shouldn't be a chore. Write, publish, and share before your coffee cools.</p>
              </div>
              <div className="feature reveal">
                <svg className="ico" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="6" fill="#e3fbf3" /><circle cx="8" cy="12" r="2.2" fill="#00b894" /><circle cx="16" cy="8" r="2.2" fill="#0aa17e" /><circle cx="16" cy="16" r="2.2" fill="#55efc4" /><path d="M9.8 11l4.4-2.4M9.8 13l4.4 2.4" stroke="#7becc8" strokeWidth="1.6" /></svg>
                <h3>Made for sharing</h3>
                <p>One link sends your gratitude anywhere — DM, email, or the public wall.</p>
              </div>
              <div className="feature reveal">
                <svg className="ico" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="6" fill="#fff1e8" /><path d="M7 9h10M7 12h7M7 15h9" stroke="#ff7a59" strokeWidth="2" strokeLinecap="round" /></svg>
                <h3>A private journal too</h3>
                <p>Keep a running list of everyone you're thankful for — a feed of good feelings.</p>
              </div>
              <div className="feature reveal">
                <svg className="ico" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="6" fill="#efeafe" /><path d="M12 6l1.7 3.9L18 10l-3.2 2.8L15.8 17 12 14.7 8.2 17l1-4.2L6 10l4.3-.1L12 6Z" fill="#6c5ce7" /></svg>
                <h3>Free, forever</h3>
                <p>Kindness shouldn't cost a thing. Gratitude is free for everyone, always.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ===================== CTA ===================== */}
      <div className="cta-wrap">
        <div className="wrap">
          <div className="cta reveal">
            <svg className="blob c1" width="320" height="320" viewBox="0 0 200 200"><path fill="#ff7a59" d="M44,-62C56,-52,63,-37,68,-21C73,-5,75,12,69,26C62,40,46,51,30,58C13,65,-6,68,-25,63C-44,57,-63,43,-71,24C-78,5,-74,-19,-63,-37C-52,-55,-34,-66,-15,-70C5,-74,25,-72,44,-62Z" transform="translate(100 100)" /></svg>
            <svg className="blob c2" width="340" height="340" viewBox="0 0 200 200"><path fill="#6c5ce7" d="M41,-58C53,-49,62,-36,68,-21C73,-6,74,11,68,26C61,41,47,53,31,61C14,68,-4,71,-22,66C-40,61,-57,48,-66,30C-74,12,-73,-11,-64,-29C-56,-47,-39,-60,-21,-66C-3,-71,16,-67,41,-58Z" transform="translate(100 100)" /></svg>
            <div className="inner">
              <h2>Who are you grateful for today?</h2>
              <p>Someone, somewhere, made your life a little better. Take two minutes and let them know.</p>
              <button className="btn btn-primary" style={{ fontSize: "1.05rem", padding: "16px 32px" }} onClick={() => navigate("/register")}>
                Write your first gratitude
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== FOOTER ===================== */}
      <footer className="foot">
        <div className="wrap foot-grid">
          <div className="foot-brand">
            <span className="mark">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 20.5S3.5 14.6 3.5 8.9A4.4 4.4 0 0 1 12 6.7a4.4 4.4 0 0 1 8.5 2.2C20.5 14.6 12 20.5 12 20.5Z" fill="#fff" /></svg>
            </span>
            Gratitude
          </div>
          <div className="socials">
            <a href="#top" aria-label="Twitter"><svg width="20" height="20" viewBox="0 0 24 24" fill="#6b6480"><path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4 4 0 0 0-6.9 3.7A11.4 11.4 0 0 1 3.8 4.8a4 4 0 0 0 1.2 5.4c-.6 0-1.2-.2-1.8-.5v.1c0 2 1.4 3.6 3.2 4-.6.2-1.2.2-1.8.1.5 1.6 2 2.8 3.8 2.8A8 8 0 0 1 2 18.6 11.3 11.3 0 0 0 8.1 20c7.4 0 11.4-6.1 11.4-11.4v-.5c.8-.6 1.5-1.3 2-2.2Z" /></svg></a>
            <a href="#top" aria-label="Instagram"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" stroke="#6b6480" strokeWidth="1.8" /><circle cx="12" cy="12" r="4" stroke="#6b6480" strokeWidth="1.8" /><circle cx="17.2" cy="6.8" r="1.2" fill="#6b6480" /></svg></a>
            <a href="https://devil1993.github.io" aria-label="GitHub" target="_blank" rel="noreferrer"><svg width="20" height="20" viewBox="0 0 24 24" fill="#6b6480"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" /></svg></a>
          </div>
          <p className="muted">© {new Date().getFullYear()} Gratitude · Project Flying Fridge · Built with ❤️</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
