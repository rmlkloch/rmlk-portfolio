import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import Fuse from "fuse.js";
import {
  Mail, ExternalLink, ChevronDown, Menu, X, Copy, CheckCircle,
  Star, Award, BookOpen, Search, Rocket, TrendingUp, Shield,
  ArrowRight, Code, Database, Zap, Eye, Network, ArrowLeft
} from "lucide-react";

/* ============================================================
   CUSTOM BRAND ICONS
   ============================================================ */
const Github = ({ size = 24, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 9 18v4"></path>
    <path d="M9 18c-4.51 2-5-2-7-2"></path>
  </svg>
);

const Linkedin = ({ size = 24, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const Fiverr = ({ size = 24, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19.256 9.404h-4.32v-2.32c0-.992.8-1.8 1.792-1.8h2.528V2.116h-2.528c-2.424 0-4.4 1.976-4.4 4.4v2.888H9.68v3.168h2.648v9.312h3.32v-9.312h3.608V9.404z"></path>
    <circle cx="5.04" cy="15.828" r="3.24"></circle>
  </svg>
);

/* ============================================================
   GLOBAL STYLES + FONTS
   ============================================================ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Orbitron:wght@700;800;900&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior: smooth; }
  body { background:#020817; }
  
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background:#020817; }
  ::-webkit-scrollbar-thumb { background:rgba(0,212,255,0.35); border-radius:3px; }
  
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(10px)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  
  .nav-link { color:rgba(255,255,255,0.65); text-decoration:none; font-size:0.85rem; letter-spacing:0.04em; text-transform:uppercase; font-family:'Inter', sans-serif; font-weight:600; transition:color 0.2s; cursor: pointer; background: transparent; border: none; outline: none; }
  .nav-link:hover { color:#00D4FF; }
  
  .glass-card { background:rgba(255,255,255,0.04); border:1px solid rgba(0,212,255,0.18); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); box-shadow:0 8px 32px rgba(0,212,255,0.06),inset 0 1px 0 rgba(255,255,255,0.05); border-radius:16px; }
  .glass-card-hover { transition:transform 0.3s, box-shadow 0.3s, border-color 0.3s; }
  .glass-card-hover:hover { transform:translateY(-4px); border-color:rgba(0,212,255,0.4); box-shadow:0 16px 40px rgba(0,212,255,0.15),inset 0 1px 0 rgba(255,255,255,0.08); }
  
  .accent-btn { background:#00D4FF; color:#020817; border:none; padding:0.75rem 2rem; border-radius:10px; font-weight:700; font-family:'Inter', sans-serif; font-size:0.9rem; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem; transition:opacity 0.2s, transform 0.15s; }
  .accent-btn:hover { opacity:0.88; transform:scale(1.03); }
  .ghost-btn { background:transparent; color:#00D4FF; border:1px solid rgba(0,212,255,0.4); padding:0.75rem 2rem; border-radius:10px; font-weight:700; font-family:'Inter', sans-serif; font-size:0.9rem; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem; transition:background 0.2s, transform 0.15s; }
  .ghost-btn:hover { background:rgba(0,212,255,0.08); transform:scale(1.03); }
  
  .filter-btn { padding:0.45rem 1rem; border-radius:8px; font-size:0.8rem; font-family:'Inter', sans-serif; font-weight:600; cursor:pointer; transition:all 0.2s; letter-spacing:0.02em; }
  .filter-btn-active { background:#00D4FF; color:#020817; border:1px solid #00D4FF; }
  .filter-btn-inactive { background:rgba(0,212,255,0.05); color:rgba(255,255,255,0.65); border:1px solid rgba(0,212,255,0.18); }
  .filter-btn-inactive:hover { border-color:rgba(0,212,255,0.4); color:#00D4FF; }
  
  .tech-chip { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); color:rgba(255,255,255,0.75); font-size:0.75rem; padding:0.25rem 0.65rem; border-radius:6px; font-family:'Inter', sans-serif; font-weight:500; }
  .accent-chip { background:rgba(0,212,255,0.08); border:1px solid rgba(0,212,255,0.2); color:rgba(0,212,255,0.9); font-size:0.75rem; padding:0.25rem 0.65rem; border-radius:6px; font-family:'Inter', sans-serif; font-weight:600; }
  
  .search-bar { width: 100%; max-width: 600px; background: rgba(255,255,255,0.04); border: 2px solid rgba(0,212,255,0.3); border-radius: 12px; padding: 1rem 1.5rem 1rem 3rem; color: white; font-family: 'Inter', sans-serif; font-size: 1.05rem; outline: none; transition: all 0.3s; }
  .search-bar:focus { border-color: #00D4FF; box-shadow: 0 0 20px rgba(0,212,255,0.15); background: rgba(255,255,255,0.08); }
  .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: rgba(0,212,255,0.6); }

  .section-divider { height:1px; background:linear-gradient(90deg,transparent,rgba(0,212,255,0.35),transparent); margin:0; }
  
  .carousel-container {
    display: flex; gap: 1.5rem; overflow-x: auto; scroll-snap-type: x mandatory;
    scroll-behavior: smooth; padding: 1.5rem 1rem 3rem 1rem; margin: -1.5rem -1rem 0 -1rem; 
    -webkit-overflow-scrolling: touch;
  }
  .carousel-card { scroll-snap-align: start; flex: 0 0 350px; display: flex; flex-direction: column; }
  
  /* TOAST ANIMATIONS */
  .toast-container { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); z-index: 9999; pointer-events: none; display: flex; flex-direction: column; gap: 0.5rem; }
  .toast {
    background: rgba(2, 8, 23, 0.95); border: 1px solid rgba(0, 212, 255, 0.5);
    box-shadow: 0 8px 32px rgba(0, 212, 255, 0.2); backdrop-filter: blur(10px);
    color: white; padding: 0.75rem 1.5rem; border-radius: 50px;
    font-family: 'Inter', sans-serif; font-weight: 600; font-size: 0.95rem;
    display: flex; align-items: center; gap: 0.5rem;
    animation: toastFade 3s ease-in-out forwards;
  }
  @keyframes toastFade {
    0% { opacity: 0; transform: translateY(20px) scale(0.9); }
    10% { opacity: 1; transform: translateY(0) scale(1); }
    90% { opacity: 1; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(-20px) scale(0.9); }
  }

  @media (max-width: 768px) { 
    .desktop-nav { display:none!important; } 
    .carousel-card { flex: 0 0 85vw; }
  }
  @media (min-width: 769px) { .mobile-menu-btn { display:none!important; } }
`;

/* ============================================================
   DATA ARCHITECTURE
   ============================================================ */
const PERSONAL = {
  name: "R.M Lochana Kalhara Ranathunga",
  initials: "R.M.L.K",
  title: "Data Science & ML Engineer", 
  pitch: "Crafting intelligent data pipelines, predictive models, and scalable machine learning solutions.", 
  status: "Open to Freelance & Full-Time",
  about: "I am Lochana Kalhara Ranathunga, a Data Science undergraduate at NSBM Green University and a Data Science & ML Engineer. I specialize in building scalable data pipelines, predictive AI models, and custom software systems. My goal is to transform complex technical challenges into streamlined, intelligent workflows.",
  linkedin: "https://www.linkedin.com/in/lochana-ranathunga-9972b023a",
  github: "https://github.com/rmlkloch",
  fiverr: "https://www.fiverr.com/tourforyourpc", 
  email: "rmlkkalhara@gmail.com",
};

const SERVICES = [
  {
    id: 1, Icon: Search,
    title: "Productized Audits & Quick Wins",
    desc: "Rapid diagnosis of your startup's data infrastructure, automation gaps, and tech stack inefficiencies, delivered as a clear action plan within days.",
    features: ["Data infrastructure audit", "Automation gap analysis", "Actionable roadmap delivery"],
    accent: "#00D4FF",
  },
  {
    id: 2, Icon: Rocket,
    title: "Rapid MVP Development",
    desc: "From idea to working prototype in weeks. I build lean, functional MVPs like data dashboards, AI tools, or web apps so you can validate faster and cheaper.",
    features: ["Full-stack MVP builds", "AI-powered prototypes", "Streamlit / React frontends"],
    accent: "#7C3AED",
  },
  {
    id: 3, Icon: Network,
    title: "Specialized Niche Integrations",
    desc: "Custom integrations between tools your startup already uses. Automate workflows, sync data sources, and eliminate manual bottlenecks that bleed hours.",
    features: ["API & webhook integrations", "Cross-platform data sync", "Custom automation flows"],
    accent: "#059669",
  },
  {
    id: 4, Icon: TrendingUp,
    title: "High-Ticket Fractional Retainers",
    desc: "Embed a senior Data Science & ML Engineer into your team part-time. Ongoing strategy, builds, and optimization without the full-time hiring cost.",
    features: ["Ongoing technical strategy", "Monthly delivery sprints", "Priority advisory support"],
    accent: "#F59E0B",
  },
];

const TOP_PROJECTS = [];
const OTHER_PROJECTS = [];

const RESEARCH = [
  {
    id: 1, title: "Thingiverse 3D Model Curvature Research", status: "Under Supervisor Review", statusType: "review",
    abstract: "An in-depth analysis of 3D model curvature across diverse datasets sourced from Thingiverse. Focuses on extracting geometric features to identify structural tendencies.",
    topics: ["3D Data Processing", "Geometric Analysis", "PyVista"]
  }
];

const TECH_STACK = [
  { name: "Python", emoji: "🐍" }, { name: "React", emoji: "⚛️" },
  { name: "Next.js", emoji: "▲" },
  { name: "Machine Learning", emoji: "🧠" }, { name: "Pandas", emoji: "🐼" },
  { name: "PyVista", emoji: "🔷" }, { name: "Trimesh", emoji: "📐" },
  { name: "Streamlit", emoji: "🚀" }, { name: "Flask", emoji: "🌶️" },
  { name: "PostgreSQL", emoji: "🐘" }, { name: "C#", emoji: "💠" },
  { name: "Scikit-learn", emoji: "⚙️" },
];

const FILTERS = [
  { label: "All", key: "all" },
  { label: "AI & Analytics", key: "ai" },
  { label: "Data Engineering", key: "data" },
  { label: "Automation", key: "automation" },
  { label: "Security", key: "security" },
];

const LEADERSHIP_CARDS = [
  {
    id: 1,
    title: "Assistant Director of Operations",
    subtitle: "NFORCE Club · NSBM Green University",
    desc: "Orchestrated university-wide events including INNOVENTRA 2026, managing full-scale logistics, coordinating cross-functional operational teams, and ensuring seamless execution from planning through delivery.",
    iconColor: "#00D4FF", 
    isMedal: false,
    items: [
      { text: "Led INNOVENTRA 2026 operations end-to-end" },
      { text: "Coordinated multi-department teams" },
      { text: "Managed event logistics & vendor relations" }
    ]
  },
  {
    id: 2,
    title: "NSBM Taekwondo Club",
    subtitle: "Yellow Belt",
    desc: "Competed as a solo trainee at NSBM Sports Fiesta 2026, demonstrating competitive discipline, grit, and the ability to perform under pressure.",
    iconColor: "#F59E0B", 
    isMedal: true,
    items: [
      { title: "Poomsae", tournament: "NSBM Sports Fiesta 2026", medal: "Gold", emoji: "🥇", color: "#F59E0B" },
      { title: "Sparring", tournament: "NSBM Sports Fiesta 2026", medal: "Bronze", emoji: "🥉", color: "#9CA3AF" }
    ]
  }
];

/* ============================================================
   TOAST COMPONENT
   ============================================================ */
function Toast() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(t);
  }, []);
  if (!visible) return null;
  return (
    <div className="toast">
      <CheckCircle size={18} color="#00D4FF" /> Email copied to clipboard!
    </div>
  );
}

/* ============================================================
   THREE.JS HERO CANVAS
   ============================================================ */
function HeroCanvas() {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const W = el.clientWidth, H = el.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.z = 38;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const makeGeo = () => {
      const g = [
        () => new THREE.IcosahedronGeometry(Math.random() * 1.4 + 0.7, 0),
        () => new THREE.OctahedronGeometry(Math.random() * 1.2 + 0.5, 0),
        () => new THREE.TetrahedronGeometry(Math.random() * 1.3 + 0.6, 0),
        () => new THREE.BoxGeometry(1.1, 1.1, 1.1),
      ];
      return g[Math.floor(Math.random() * g.length)]();
    };

    const shapes = [];
    for (let i = 0; i < 30; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: i % 4 === 0 ? 0x7C3AED : 0x00D4FF,
        wireframe: true, transparent: true,
        opacity: Math.random() * 0.5 + 0.35, 
      });
      const mesh = new THREE.Mesh(makeGeo(), mat);
      mesh.position.set(
        (Math.random() - 0.5) * 75,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 28 - 5
      );
      mesh.userData = {
        rx: (Math.random() - 0.5) * 0.012,
        ry: (Math.random() - 0.5) * 0.015,
        fy: Math.random() * 0.006 + 0.003,
        fa: Math.random() * 1.8 + 0.8,
        iy: mesh.position.y,
        ph: Math.random() * Math.PI * 2,
        mx: 0.001 + Math.random() * 0.003,
      };
      scene.add(mesh);
      shapes.push(mesh);
    }

    const sGeo = new THREE.BufferGeometry();
    const sPos = new Float32Array(700 * 3);
    for (let i = 0; i < 700; i++) {
      sPos[i * 3] = (Math.random() - 0.5) * 140;
      sPos[i * 3 + 1] = (Math.random() - 0.5) * 90;
      sPos[i * 3 + 2] = (Math.random() - 0.5) * 70 - 10;
    }
    sGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    scene.add(new THREE.Points(sGeo, new THREE.PointsMaterial({ color: 0x00D4FF, size: 0.16, transparent: true, opacity: 0.75 })));

    const onMouse = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const onResize = () => {
      const nw = el.clientWidth, nh = el.clientHeight;
      camera.aspect = nw / nh; camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("resize", onResize);

    const animate = (t) => {
      rafRef.current = requestAnimationFrame(animate);
      const time = t * 0.001;
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      shapes.forEach((m) => {
        const d = m.userData;
        m.rotation.x += d.rx; m.rotation.y += d.ry;
        m.position.y = d.iy + Math.sin(time * d.fy * 80 + d.ph) * d.fa;
        m.position.x += (mx * 4 - m.position.x) * d.mx;
      });
      camera.position.x += (mx * 5 - camera.position.x) * 0.03;
      camera.position.y += (my * 3 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    animate(0);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      renderer.forceContextLoss(); // Stops WebGL memory leaks
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return <div ref={mountRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />;
}

/* ============================================================
   SHARED HELPERS
   ============================================================ */
const H = ({ children, style = {} }) => (
  <h2 style={{ fontFamily: "'Orbitron',monospace", color: "white", fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 900, lineHeight: 1.2, marginBottom: "0.25rem", ...style }}>{children}</h2>
);
const Label = ({ children }) => (
  <p style={{ fontFamily: "'Orbitron',monospace", color: "#00D4FF", fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "0.5rem" }}>// {children}</p>
);
const Body = ({ children, style = {} }) => (
  <p style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, fontSize: "0.95rem", ...style }}>{children}</p>
);
const Accent = "#00D4FF";
const BG1 = "#020817";
const BG2 = "#020d1f";

const glassStyle = (extra = {}) => ({
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(0,212,255,0.18)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  boxShadow: "0 8px 32px rgba(0,212,255,0.06),inset 0 1px 0 rgba(255,255,255,0.05)",
  borderRadius: 16,
  ...extra,
});

const iconBox = (color = Accent) => ({
  width: 46, height: 46, borderRadius: 12,
  background: `${color}18`, border: `1px solid ${color}33`,
  display: "flex", alignItems: "center", justifyContent: "center",
  flexShrink: 0,
});

/* ============================================================
   NAV Component
   ============================================================ */
function Nav({ currentView, setView }) {
  const [open, setOpen] = useState(false);
  const homeLinks = [
    { href: "#about", label: "About" }, { href: "#services", label: "Services" },
    { href: "#projects", label: "Projects" }, { href: "#research", label: "Research" }, 
    { href: "#leadership", label: "Leadership" }, { href: "#contact", label: "Contact" },
  ];

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: "rgba(2,8,23,0.88)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderBottom: "1px solid rgba(0,212,255,0.1)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        
        {currentView === "home" ? (
          <a href="#hero" style={{ fontFamily: "'Orbitron',monospace", color: Accent, fontWeight: 900, fontSize: "1.1rem", textDecoration: "none", letterSpacing: "0.05em" }}>&lt;R.M.L.K/&gt;</a>
        ) : (
          <button onClick={() => { setView("home"); window.scrollTo(0,0); }} style={{ background: "transparent", border: "none", color: "white", display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'Inter', sans-serif", fontWeight: 700, cursor: "pointer" }}>
            <ArrowLeft size={18} color={Accent} /> Back to Home
          </button>
        )}

        {currentView === "home" && (
          <div className="desktop-nav" style={{ display: "flex", gap: "2rem" }}>
            {homeLinks.map(l => <a key={l.href} href={l.href} className="nav-link">{l.label}</a>)}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {currentView === "home" && <a href="#contact" className="accent-btn desktop-nav" style={{ padding: "0.45rem 1.2rem", fontSize: "0.8rem" }}>Hire Me</a>}
          {currentView === "home" && (
            <button className="mobile-menu-btn" onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", padding: "0.25rem" }}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}
        </div>
      </div>

      {open && currentView === "home" && (
        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid rgba(0,212,255,0.1)", display: "flex", flexDirection: "column", gap: "1rem", background: "rgba(2,8,23,0.97)" }}>
          {homeLinks.map(l => <a key={l.href} href={l.href} className="nav-link" onClick={() => setOpen(false)} style={{ fontSize: "0.95rem" }}>{l.label}</a>)}
          <a href="#contact" onClick={() => setOpen(false)} className="accent-btn" style={{ justifyContent: "center", marginTop: "0.5rem" }}>Hire Me</a>
        </div>
      )}
    </nav>
  );
}

/* ============================================================
   DEDICATED FULL PROJECT LIBRARY PAGE WITH SMART SEARCH
   ============================================================ */
function FullProjectLibraryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [results, setResults] = useState(OTHER_PROJECTS);

  const fuse = useRef(new Fuse(OTHER_PROJECTS, {
    keys: ["title", "desc", "tech", "category"],
    threshold: 0.4,
    includeScore: true
  })).current;

  useEffect(() => {
    let filteredList = OTHER_PROJECTS;

    if (searchTerm.trim() !== "") {
      const searchResults = fuse.search(searchTerm);
      filteredList = searchResults.map(result => result.item);
    }

    if (activeFilter !== "all") {
      filteredList = filteredList.filter(p => p.key === activeFilter);
    }

    setResults(filteredList);
  }, [searchTerm, activeFilter, fuse]);

  return (
    <section style={{ minHeight: "100vh", paddingTop: "100px", paddingBottom: "6rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>
        
        <Label>Archive</Label>
        <H style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>Comprehensive Project Library</H>
        <Body style={{ marginTop: "1rem", marginBottom: "3rem", maxWidth: 600, fontSize: "1.1rem" }}>
          Browse the full archive of tools, scripts, dashboards, and integrations. 
          Use the smart search bar below to find exactly what you're looking for.
        </Body>

        <div style={{ position: "relative", marginBottom: "2rem" }}>
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search projects, technologies, or keywords..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
        </div>

        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "3rem" }}>
          {FILTERS.map(f => (
            <button 
              key={f.key} 
              className={`filter-btn ${activeFilter === f.key ? "filter-btn-active" : "filter-btn-inactive"}`} 
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {results.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "2rem" }}>
            {results.map(p => (
              <div key={p.id} className="glass-card glass-card-hover" style={{ padding: "2rem", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <span className="accent-chip">{p.category}</span>
                  <a href={p.github} target="_blank" style={{ color: "rgba(255,255,255,0.4)", transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = Accent}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
                  ><Github size={20} /></a>
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", color: "white", fontWeight: 700, fontSize: "1.15rem", marginBottom: "0.8rem" }}>{p.title}</p>
                <Body style={{ fontSize: "0.95rem", marginBottom: "1.5rem", flexGrow: 1 }}>{p.desc}</Body>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "auto" }}>
                  {p.tech.map(t => <span key={t} className="tech-chip" style={{ background: "rgba(0,212,255,0.05)" }}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "6rem 0" }}>
            <Database size={48} color="rgba(255,255,255,0.1)" style={{ margin: "0 auto 1rem" }} />
            <H style={{ fontSize: "1.5rem", color: "rgba(255,255,255,0.5)" }}>No results found</H>
            <Body>Try adjusting your search terms or selecting a different filter.</Body>
            <button onClick={() => {setSearchTerm(""); setActiveFilter("all");}} className="ghost-btn" style={{ marginTop: "1.5rem" }}>Clear Search</button>
          </div>
        )}
      </div>
    </section>
  );
}


/* ============================================================
   HERO
   ============================================================ */
function Hero({ copyEmail }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);
  return (
    <section id="hero" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: BG1, paddingTop: 64 }}>
      <HeroCanvas />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "radial-gradient(ellipse 80% 60% at 50% 50%,rgba(0,212,255,0.01) 0%,rgba(2,8,23,0.4) 80%)" }} />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 680, width: "100%", padding: "2rem 1.5rem", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: "opacity 0.9s ease, transform 0.9s ease" }}>
        <div style={{ ...glassStyle({ padding: "2.5rem 2.5rem 3rem" }) }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.3)", borderRadius: 100, padding: "0.3rem 1rem", marginBottom: "1.8rem" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#00D4FF", animation: "pulse 2s infinite", flexShrink: 0 }} />
            <span style={{ fontFamily: "'Inter', sans-serif", color: Accent, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.08em" }}>{PERSONAL.status}</span>
          </div>

          <h1 style={{ fontFamily: "'Orbitron',monospace", color: "white", fontSize: "clamp(1.7rem,5vw,2.9rem)", fontWeight: 900, lineHeight: 1.18, marginBottom: "0.6rem" }}>
            R.M Lochana <span style={{ color: Accent }}>Kalhara</span><br />Ranathunga
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", color: "rgba(0,212,255,0.85)", fontSize: "1rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "1.4rem" }}>
            {PERSONAL.title}
          </p>
          <Body style={{ fontSize: "1.05rem", marginBottom: "2rem", color: "rgba(255,255,255,0.75)" }}>{PERSONAL.pitch}</Body>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a href="#projects" className="accent-btn">View Projects <ArrowRight size={15} /></a>
            <a href="#contact" className="ghost-btn">Hire Me</a>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(0,212,255,0.12)" }}>
            {[{ href: PERSONAL.linkedin, Icon: Linkedin, label: "LinkedIn" }, { href: PERSONAL.github, Icon: Github, label: "GitHub" }, { href: PERSONAL.fiverr, Icon: Fiverr, label: "Fiverr" }].map(({ href, Icon, label }) => (
              <a key={label} href={href} target="_blank" style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", fontFamily: "'Inter', sans-serif", fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = Accent}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
              ><Icon size={16} /> {label}</a>
            ))}
            <button onClick={copyEmail} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: "0.4rem", color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", fontFamily: "'Inter', sans-serif", fontWeight: 500, textDecoration: "none", transition: "color 0.2s", cursor: "pointer", padding: 0 }}
              onMouseEnter={e => e.currentTarget.style.color = Accent}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
            ><Mail size={16} /> Email</button>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "2.5rem", animation: "float 3s ease-in-out infinite" }}>
          <ChevronDown size={26} color="rgba(0,212,255,0.4)" />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   ABOUT
   ============================================================ */
function About({ copyEmail }) {
  return (
    <section id="about" style={{ background: BG2, padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Label>About</Label>
        <H>Who I Am</H>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "2rem", marginTop: "2.5rem" }}>
          <div style={glassStyle({ padding: "2rem" })}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ width: 68, height: 68, borderRadius: "50%", background: "linear-gradient(135deg,rgba(0,212,255,0.3),rgba(124,58,237,0.3))", border: "2px solid rgba(0,212,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Orbitron',monospace", fontWeight: 900, color: Accent, fontSize: "0.9rem", flexShrink: 0 }}>R.M.L.K</div>
              <div>
                <p style={{ fontFamily: "'Inter', sans-serif", color: "white", fontWeight: 700, fontSize: "1rem" }}>{PERSONAL.name}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", color: "rgba(0,212,255,0.8)", fontSize: "0.85rem", marginTop: "0.2rem" }}>{PERSONAL.title}</p>
              </div>
            </div>
            <Body>{PERSONAL.about}</Body>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1.5rem" }}>
              {[{ href: PERSONAL.linkedin, Icon: Linkedin, label: "LinkedIn" }, { href: PERSONAL.github, Icon: Github, label: "GitHub" }].map(({ href, Icon, label }) => (
                <a key={label} href={href} target="_blank" className="ghost-btn" style={{ padding: "0.45rem 1rem", fontSize: "0.85rem" }}>
                  <Icon size={14} /> {label}
                </a>
              ))}
              <button onClick={copyEmail} className="ghost-btn" style={{ padding: "0.45rem 1rem", fontSize: "0.85rem" }}>
                <Mail size={14} /> Email
              </button>
            </div>
          </div>

          <div style={glassStyle({ padding: "2rem" })}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem" }}>
              <Code size={16} color={Accent} />
              <p style={{ fontFamily: "'Orbitron',monospace", color: Accent, fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>Tech Stack</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.7rem" }}>
              {TECH_STACK.map(t => (
                <div key={t.name} style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.14)", borderRadius: 10, padding: "0.7rem 0.5rem", textAlign: "center", transition: "border-color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.4)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.14)"}
                >
                  <div style={{ fontSize: "1.35rem", marginBottom: "0.25rem" }}>{t.emoji}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.75)", fontSize: "0.7rem", fontWeight: 600 }}>{t.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SERVICES
   ============================================================ */
function Services() {
  return (
    <section id="services" style={{ background: BG1, padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Label>Services</Label>
        <H>What I Offer</H>
        <Body style={{ marginTop: "0.5rem", marginBottom: "2.5rem", maxWidth: 520 }}>Four focused service lines built to deliver maximum value for early-stage teams moving fast.</Body>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.5rem" }}>
          {SERVICES.map(s => (
            <div key={s.id} className="glass-card glass-card-hover" style={{ padding: "2rem" }}>
              <div style={iconBox(s.accent)}><s.Icon size={20} color={s.accent} /></div>
              <p style={{ fontFamily: "'Inter', sans-serif", color: "white", fontWeight: 700, fontSize: "1.05rem", margin: "1.2rem 0 0.65rem" }}>{s.title}</p>
              <Body style={{ fontSize: "0.9rem", marginBottom: "1.2rem" }}>{s.desc}</Body>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {s.features.map(f => (
                  <li key={f} style={{ fontFamily: "'Inter', sans-serif", color: `${s.accent}CC`, fontSize: "0.85rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <ArrowRight size={12} color={s.accent} /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   TOP PROJECTS (With Link to new Library Page)
   ============================================================ */
function TopProjects({ setView }) {
  const categories = [...new Set(TOP_PROJECTS.map(p => p.category))];

  return (
    <section id="projects" style={{ background: BG2, padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "3rem" }}>
          <div>
            <Label>Showcase</Label>
            <H>Top Projects</H>
            <Body style={{ marginTop: "0.5rem", maxWidth: 520 }}>My absolute best work, structured by specialization. Up to 5 featured projects per category.</Body>
          </div>
          <button onClick={() => { setView("library"); window.scrollTo(0,0); }} className="accent-btn" style={{ padding: "0.6rem 1.5rem", fontSize: "0.85rem" }}>
            Search Full Library <ArrowRight size={16} />
          </button>
        </div>

        {TOP_PROJECTS.length === 0 ? (
          <Body style={{ textAlign: "center", padding: "3rem 0", color: "rgba(255,255,255,0.3)" }}>
            Exciting new projects are currently under development. Check back soon!
          </Body>
        ) : (
          categories.map(category => {
            const categoryProjects = TOP_PROJECTS.filter(p => p.category === category).slice(0, 5);
            
            return (
              <div key={category} style={{ marginBottom: "4rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                  <h3 style={{ fontFamily: "'Orbitron',monospace", color: Accent, fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{category}</h3>
                  <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, ${Accent}44, transparent)` }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
                  {categoryProjects.map((p) => (
                    <div key={p.id} className="glass-card" style={{ padding: "2rem 2rem 2rem 2.25rem", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3.5, background: `linear-gradient(180deg,${p.accent},${p.accent}44)`, borderRadius: "2px 0 0 2px" }} />
                      <div style={{ position: "absolute", right: -60, top: -60, width: 200, height: 200, borderRadius: "50%", background: `${p.accent}08`, pointerEvents: "none" }} />

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.75rem", position: "relative" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ background: `${p.accent}22`, border: `1px solid ${p.accent}55`, color: p.accent, fontSize: "0.7rem", padding: "0.2rem 0.75rem", borderRadius: 100, fontFamily: "'Inter', sans-serif", fontWeight: 700, letterSpacing: "0.05em" }}>{p.badge}</span>
                        </div>
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                          <a href={p.github} target="_blank" style={{ color: "rgba(255,255,255,0.4)", transition: "color 0.2s" }}
                            onMouseEnter={e => e.currentTarget.style.color = Accent}
                            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
                          ><Github size={18} /></a>
                          {p.live && <a href={p.live} target="_blank" style={{ color: "rgba(255,255,255,0.4)" }}><ExternalLink size={18} /></a>}
                        </div>
                      </div>

                      <p style={{ fontFamily: "'Inter', sans-serif", color: "white", fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.5rem", position: "relative" }}>{p.title}</p>
                      <p style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", marginBottom: "0.8rem", position: "relative" }}>
                        <span style={{ color: p.accent, fontWeight: 600 }}>Problem: </span>{p.problem}
                      </p>
                      <Body style={{ marginBottom: "1.1rem", position: "relative" }}>{p.desc}</Body>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", position: "relative" }}>
                        {p.tech.map(t => <span key={t} className="tech-chip">{t}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

/* ============================================================
   RESEARCH 
   ============================================================ */
function Research() {
  if (RESEARCH.length === 0) return null;

  const statusStyles = {
    review: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.35)", color: "#F59E0B" },
    progress: { bg: "rgba(0,212,255,0.1)", border: "rgba(0,212,255,0.35)", color: Accent },
    published: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.35)", color: "#10B981" },
  };

  const isCarousel = RESEARCH.length >= 5;

  return (
    <section id="research" style={{ background: BG1, padding: "6rem 1.5rem", overflow: "hidden" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Label>Academia</Label>
        <H>Research Papers</H>
        
        {isCarousel && (
          <div className="carousel-container" style={{ marginTop: "2.5rem" }}>
            {RESEARCH.map(r => {
              const st = statusStyles[r.statusType];
              return (
                <div key={r.id} className="glass-card carousel-card glass-card-hover" style={{ padding: "2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <BookOpen size={16} color={Accent} />
                      <span style={{ fontFamily: "'Orbitron',monospace", color: Accent, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Academic Research</span>
                    </div>
                    <span style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.color, fontSize: "0.75rem", padding: "0.25rem 0.85rem", borderRadius: 100, fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>{r.status}</span>
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif", color: "white", fontWeight: 700, fontSize: "1.15rem", lineHeight: 1.5, marginBottom: "0.85rem" }}>{r.title}</p>
                  <Body style={{ fontSize: "0.9rem", marginBottom: "1.1rem", flexGrow: 1 }}>{r.abstract}</Body>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "auto" }}>
                    {r.topics.map(t => <span key={t} className="accent-chip">{t}</span>)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isCarousel && (
          <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "800px", margin: "2.5rem auto 0" }}>
            {RESEARCH.map(r => {
              const st = statusStyles[r.statusType];
              return (
                <div key={r.id} className="glass-card glass-card-hover" style={{ padding: "2rem", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <BookOpen size={16} color={Accent} />
                      <span style={{ fontFamily: "'Orbitron',monospace", color: Accent, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Academic Research</span>
                    </div>
                    <span style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.color, fontSize: "0.75rem", padding: "0.25rem 0.85rem", borderRadius: 100, fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>{r.status}</span>
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif", color: "white", fontWeight: 700, fontSize: "1.15rem", lineHeight: 1.5, marginBottom: "0.85rem" }}>{r.title}</p>
                  <Body style={{ fontSize: "0.9rem", marginBottom: "1.1rem", flexGrow: 1 }}>{r.abstract}</Body>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "auto" }}>
                    {r.topics.map(t => <span key={t} className="accent-chip">{t}</span>)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   LEADERSHIP 
   ============================================================ */
function Leadership() {
  const isCarousel = LEADERSHIP_CARDS.length >= 5;

  return (
    <section id="leadership" style={{ background: BG2, padding: "6rem 1.5rem", overflow: "hidden" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Label>Leadership & Discipline</Label>
        <H>Beyond the Code</H>
        <Body style={{ marginTop: "0.5rem", marginBottom: "2.5rem", maxWidth: 520 }}>Execution, discipline, and leadership developed both inside and outside the lab.</Body>
        
        {LEADERSHIP_CARDS.length === 0 ? (
          <Body style={{ padding: "3rem 0", color: "rgba(255,255,255,0.3)" }}>Leadership entries will be listed here soon.</Body>
        ) : (
          <div 
            className={isCarousel ? "carousel-container" : ""}
            style={!isCarousel ? { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "2rem", justifyContent: "center" } : {}}
          >
            {LEADERSHIP_CARDS.map(card => (
              <div key={card.id} className={`glass-card glass-card-hover ${isCarousel ? 'carousel-card' : ''}`} style={{ padding: "2rem", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                  <div style={iconBox(card.iconColor)}>
                    {card.isMedal ? <Award size={20} color={card.iconColor} /> : <Star size={20} color={card.iconColor} />}
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Inter', sans-serif", color: "white", fontWeight: 700, fontSize: "1.05rem" }}>{card.title}</p>
                    <p style={{ fontFamily: "'Inter', sans-serif", color: `${card.iconColor}CC`, fontSize: "0.85rem", marginTop: "0.2rem" }}>{card.subtitle}</p>
                  </div>
                </div>
                
                <Body style={{ fontSize: "0.9rem", marginBottom: "1.25rem", flexGrow: 1 }}>{card.desc}</Body>
                
                {card.isMedal ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem", marginTop: "auto" }}>
                    {card.items.map(m => (
                      <div key={m.title} style={{ background: `${m.color}10`, border: `1px solid ${m.color}30`, borderRadius: 10, padding: "0.8rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <p style={{ fontFamily: "'Inter', sans-serif", color: "white", fontWeight: 700, fontSize: "0.9rem" }}>{m.title}</p>
                          <p style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>{m.tournament}</p>
                        </div>
                        <span style={{ fontFamily: "'Orbitron',monospace", color: m.color, fontWeight: 900, fontSize: "0.85rem" }}>{m.emoji} {m.medal}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "auto" }}>
                    {card.items.map(a => (
                      <li key={a.text} style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <ArrowRight size={12} color={card.iconColor} /> {a.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   CONTACT (Direct Contact Card Redesign)
   ============================================================ */
function Contact({ copyEmail }) {
  return (
    <section id="contact" style={{ background: BG1, padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <Label>Contact</Label>
        <H>Let's Build Together</H>
        <Body style={{ marginTop: "0.5rem", marginBottom: "3rem", maxWidth: 460 }}>
          My inbox is always open. Whether you have a project, a retainer opportunity, or just want to connect, I'll try my best to get back to you!
        </Body>

        <div className="glass-card" style={{ padding: "4rem 2rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
          {/* Subtle Background Glow inside card */}
          <div style={{ position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)", width: "400px", height: "400px", background: "rgba(0, 212, 255, 0.1)", filter: "blur(80px)", borderRadius: "50%", pointerEvents: "none" }} />
          
          <div style={{ margin: "0 auto 1.5rem", width: 64, height: 64, borderRadius: 16, background: "rgba(0, 212, 255, 0.1)", border: "1px solid rgba(0, 212, 255, 0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Mail size={32} color={Accent} />
          </div>
          
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "clamp(1.3rem, 4vw, 2.2rem)", color: "white", marginBottom: "0.5rem" }}>
            {PERSONAL.email}
          </h3>
          <p style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.5)", marginBottom: "2.5rem", fontSize: "0.95rem" }}>
            Average response time: Within 24 hours
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}>
            {/* UPDATED: Directly opens Gmail web composer */}
            <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${PERSONAL.email}`} target="_blank" rel="noopener noreferrer" className="accent-btn"><Mail size={18} /> Open Gmail</a>
            <button onClick={copyEmail} className="ghost-btn"><Copy size={18} /> Copy Email</button>
          </div>

          <div style={{ height: 1, width: "100%", background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.2), transparent)", marginBottom: "2.5rem" }} />

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            {[{ href: PERSONAL.linkedin, Icon: Linkedin, label: "LinkedIn" }, { href: PERSONAL.github, Icon: Github, label: "GitHub" }, { href: PERSONAL.fiverr, Icon: Fiverr, label: "Fiverr" }].map(({ href, Icon, label }) => (
              <a key={label} href={href} target="_blank" className="ghost-btn" style={{ padding: "0.5rem 1.1rem", fontSize: "0.85rem" }}>
                <Icon size={16} /> {label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
function Footer({ copyEmail }) {
  return (
    <footer style={{ background: BG2, borderTop: "1px solid rgba(0,212,255,0.1)", padding: "2.5rem 1.5rem", textAlign: "center" }}>
      <p style={{ fontFamily: "'Orbitron',monospace", color: Accent, fontWeight: 900, fontSize: "1.1rem", marginBottom: "0.6rem" }}>&lt;R.M.L.K/&gt;</p>
      <p style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>
        © 2026 R.M Lochana Kalhara Ranathunga · Data Science & ML Engineer
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "1.25rem" }}>
        {[{ href: PERSONAL.linkedin, Icon: Linkedin }, { href: PERSONAL.github, Icon: Github }, { href: PERSONAL.fiverr, Icon: Fiverr }].map(({ href, Icon }) => (
          <a key={href} href={href} target="_blank" style={{ color: "rgba(255,255,255,0.35)", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = Accent}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
          ><Icon size={18} /></a>
        ))}
        <button onClick={copyEmail} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "rgba(255,255,255,0.35)", transition: "color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.color = Accent}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
        ><Mail size={18} /></button>
      </div>
    </footer>
  );
}

/* ============================================================
   ROOT APP (ROUTER)
   ============================================================ */
export default function Portfolio() {
  const [currentView, setCurrentView] = useState("home"); 
  const [toastCounter, setToastCounter] = useState(0);

  const copyEmail = (e) => {
    if (e) e.preventDefault();
    navigator.clipboard.writeText(PERSONAL.email);
    setToastCounter(prev => prev + 1);
  };

  return (
    <div style={{ background: BG1, minHeight: "100vh", position: "relative" }}>
      <style>{GLOBAL_CSS}</style>
      <Nav currentView={currentView} setView={setCurrentView} />
      
      {currentView === "home" ? (
        <>
          <Hero copyEmail={copyEmail} />
          <div className="section-divider" />
          <About copyEmail={copyEmail} />
          <div className="section-divider" />
          <Services />
          <div className="section-divider" />
          <TopProjects setView={setCurrentView} />
          <div className="section-divider" />
          <Research />
          <div className="section-divider" />
          <Leadership />
          <div className="section-divider" />
          <Contact copyEmail={copyEmail} />
        </>
      ) : (
        <FullProjectLibraryPage />
      )}
      
      <Footer copyEmail={copyEmail} />

      {/* GLOBAL TOAST CONTAINER */}
      <div className="toast-container">
        {toastCounter > 0 && <Toast key={toastCounter} />}
      </div>
    </div>
  );
}