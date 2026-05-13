import { useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";
import {
  Mail, ChevronDown, Menu, X, Copy, CheckCircle,
  Star, Award, BookOpen, Search, Rocket, TrendingUp,
  ArrowRight, Code, Database, Zap, Activity, Server, ArrowLeft
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
   GLOBAL STYLES & LAYOUT FIXES
   ============================================================ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@700;800;900&display=swap');
  
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior: smooth; }
  body { 
    background-color: #E7E7E7 !important; 
    color: #1F2937 !important; 
    overflow-x: hidden !important; 
    margin: 0; padding: 0;
  }
  
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background:#E7E7E7; }
  ::-webkit-scrollbar-thumb { background:#B6B6B6; border-radius:4px; }
  ::-webkit-scrollbar-thumb:hover { background:#9B9B9B; }

  /* =========================================
     THE WIDE-SCREEN LAYOUT LOCK
     These classes guarantee the tracker and content never drift apart
  ========================================= */
  .desktop-tracker-col { display: none; width: 140px; flex-shrink: 0; position: relative; }
  .nav-inner-spacing { padding-left: 1.5rem; }
  
  @media (min-width: 1024px) {
    .desktop-tracker-col { display: block; }
    .nav-inner-spacing { padding-left: 140px; } /* Aligns Nav with Content */
  }

  /* TRACKER CSS */
  .yscroll-track { position: relative; height: 100%; width: 100%; display: flex; flex-direction: column; justify-content: space-between; align-items: flex-start; }
  .yscroll-line-bounds { position: absolute; left: 39px; top: 12px; bottom: 12px; width: 2px; z-index: 0; }
  .yscroll-line-bg { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 0%, rgba(209, 209, 209, 0.6) 15%, rgba(209, 209, 209, 0.6) 85%, transparent 100%); }
  .yscroll-line-fill { position: absolute; top: 0; left: 0; width: 100%; background: linear-gradient(to bottom, transparent 0%, transparent calc(100% - 100px), #10B981 100%); transition: height 0.15s linear; }
  .yscroll-node { position: relative; display: flex; align-items: center; gap: 16px; padding-left: 35px; pointer-events: auto; cursor: pointer; z-index: 2; height: 24px; width: 100%; }
  
  .yscroll-dot { width: 10px; height: 10px; border-radius: 50%; background: #E7E7E7; border: 2px solid #B6B6B6; transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); flex-shrink: 0; opacity: 0; transform: scale(0.5); }
  .yscroll-node.is-adjacent .yscroll-dot { opacity: 0.5; transform: scale(1); }
  .yscroll-node.is-active .yscroll-dot { opacity: 1; background: #10B981; border-color: #10B981; transform: scale(1.6); box-shadow: 0 0 10px rgba(16, 185, 129, 0.4); }
  
  .yscroll-label { font-family: 'Outfit', sans-serif; font-size: 0.75rem; font-weight: 700; color: #9B9B9B; text-transform: uppercase; letter-spacing: 0.1em; transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); transform-origin: left center; transform: translateX(-15px) scale(0.8); opacity: 0; pointer-events: none; white-space: nowrap; }
  .yscroll-node.is-adjacent .yscroll-label { opacity: 0.4; transform: translateX(-5px) scale(0.95); }
  .yscroll-node.is-active .yscroll-label { opacity: 1; color: #10B981; font-weight: 900; transform: translateX(0) scale(1.25); }

  /* HERO RESPONSIVENESS */
  .hero-layout { display: flex; flex-direction: column-reverse; gap: 3rem; align-items: center; text-align: center; }
  .hero-text-col { flex: 1.1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .hero-img-col { flex: 0.9; display: flex; justify-content: center; align-items: center; position: relative; min-height: 350px; width: 100%; }
  .hero-badges-wrapper { position: static !important; display: flex; flex-direction: column; gap: 1rem; align-items: center; margin-top: 2rem; }
  
  @media (min-width: 1024px) {
    .hero-layout { flex-direction: row; text-align: left; }
    .hero-text-col { align-items: flex-start; }
    .hero-img-col { min-height: 450px; }
    .hero-badges-wrapper { position: absolute !important; bottom: 12% !important; right: -20% !important; margin-top: 0; display: flex; flex-direction: column; gap: 1rem; align-items: flex-start; }
  }

  /* UTILITIES */
  .fade-section { opacity: 0; transform: translateY(50px); transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1); padding: 6rem 1.5rem; }
  .fade-section.is-visible { opacity: 1; transform: translateY(0); }
  
  .nav-link { color:#1F2937; text-decoration:none; font-size:0.95rem; letter-spacing:0.02em; font-family:'Inter', sans-serif; font-weight:600; transition:color 0.2s; cursor: pointer; background: transparent; border: none; outline: none; display: flex; alignItems: center; gap: 0.25rem; }
  .nav-link:hover { color:#10B981; } 
  
  .glass-card { background: rgba(255, 255, 255, 0.6); border: 1px solid #D1D1D1; box-shadow: 0 8px 32px rgba(0,0,0,0.04); border-radius: 16px; backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
  .glass-card-hover { transition:transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease; }
  .glass-card-hover:hover { transform:translateY(-8px); border-color:#9B9B9B; box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
  
  .solid-badge { background: #FFFFFF; border: 1px solid #E7E7E7; border-radius: 12px; box-shadow: 0 12px 30px rgba(0,0,0,0.08); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
  .solid-badge:hover { border-color: #D1D1D1; transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }

  .accent-btn { background:#1F2937; color:#FFFFFF; border:none; padding:0.75rem 2rem; border-radius:10px; font-weight:700; font-family:'Inter', sans-serif; font-size:0.95rem; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem; transition:all 0.2s; box-shadow: 0 4px 14px rgba(31, 41, 55, 0.2); }
  .accent-btn:hover { background:#000000; transform:translateY(-2px); box-shadow: 0 6px 20px rgba(31, 41, 55, 0.3); }
  
  .ghost-btn { background:rgba(255, 255, 255, 0.5); color:#1F2937; border:1px solid #D1D1D1; padding:0.75rem 2rem; border-radius:10px; font-weight:700; font-family:'Inter', sans-serif; font-size:0.95rem; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem; transition:all 0.2s; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
  .ghost-btn:hover { background:rgba(255, 255, 255, 0.9); border-color:#B6B6B6; transform:translateY(-2px); }
  
  .filter-btn { padding:0.5rem 1.25rem; border-radius:100px; font-size:0.85rem; font-family:'Inter', sans-serif; font-weight:600; cursor:pointer; transition:all 0.2s; letter-spacing:0.01em; }
  .filter-btn-active { background:#1F2937; color:#FFFFFF; border:1px solid #1F2937; }
  .filter-btn-inactive { background:rgba(255,255,255,0.6); color:#4B5563; border:1px solid #D1D1D1; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
  .filter-btn-inactive:hover { border-color:#9B9B9B; color:#111827; }
  
  .tech-chip { background:rgba(255,255,255,0.7); border:1px solid #D1D1D1; color:#4B5563; font-size:0.75rem; padding:0.35rem 0.8rem; border-radius:100px; font-family:'Inter', sans-serif; font-weight:600; backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px); }
  .accent-chip { background:rgba(16, 185, 129, 0.1); border:1px solid rgba(16, 185, 129, 0.2); color:#059669; font-size:0.75rem; padding:0.35rem 0.8rem; border-radius:100px; font-family:'Inter', sans-serif; font-weight:700; }
  .dynamic-chip { background:rgba(59, 130, 246, 0.1); border:1px solid rgba(59, 130, 246, 0.2); color:#2563EB; font-size:0.75rem; padding:0.35rem 0.8rem; border-radius:100px; font-family:'Inter', sans-serif; font-weight:700; animation: pulseGlow 2s infinite; }
  
  @keyframes pulseGlow { 0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0); } 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); } }

  .search-bar { width: 100%; max-width: 600px; background: rgba(255,255,255,0.7); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid #D1D1D1; border-radius: 100px; padding: 1rem 1.5rem 1rem 3.5rem; color: #1F2937; font-family: 'Inter', sans-serif; font-size: 1.05rem; outline: none; transition: all 0.3s; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
  .search-bar:focus { border-color: #B6B6B6; box-shadow: 0 0 0 4px rgba(0,0,0,0.05); background: #FFFFFF; }
  .search-icon { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); color: #9B9B9B; }

  .carousel-container { display: flex; gap: 1.5rem; overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth; padding: 1.5rem 1rem 3rem 1rem; margin: -1.5rem -1rem 0 -1rem; -webkit-overflow-scrolling: touch; }
  .carousel-card { scroll-snap-align: start; flex: 0 0 380px; display: flex; flex-direction: column; }
  
  .dropdown-container { position: relative; display: inline-block; }
  .dropdown-content { position: absolute; top: 100%; left: 50%; transform: translateX(-50%) translateY(10px); background: rgba(255,255,255,0.95); min-width: 220px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); border-radius: 12px; border: 1px solid #D1D1D1; opacity: 0; visibility: hidden; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); padding: 0.5rem; z-index: 300; pointer-events: none; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
  .dropdown-container:hover .dropdown-content { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0); pointer-events: auto; }
  .dropdown-item { display: block; padding: 0.75rem 1rem; color: #4B5563; text-decoration: none; font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 600; border-radius: 8px; transition: background 0.2s, color 0.2s; text-align: left; width: 100%; border: none; background: transparent; cursor: pointer; }
  .dropdown-item:hover { background: #E7E7E7; color: #111827; }

  .toast-container { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); z-index: 9999; pointer-events: none; display: flex; flex-direction: column; gap: 0.5rem; }
  .toast { background: rgba(17, 24, 39, 0.95); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2); color: white; padding: 0.85rem 1.75rem; border-radius: 100px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 0.95rem; display: flex; align-items: center; gap: 0.6rem; animation: toastFade 3s ease-in-out forwards; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
  @keyframes toastFade { 0% { opacity: 0; transform: translateY(20px) scale(0.9); } 10% { opacity: 1; transform: translateY(0) scale(1); } 90% { opacity: 1; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(-20px) scale(0.9); } }
`;

/* ============================================================
   DATA ARCHITECTURE
   ============================================================ */
const PERSONAL = {
  name: "R.M Lochana Kalhara Ranathunga",
  title: "Data Science & ML Engineer", 
  pitch: "Crafting intelligent data pipelines, predictive models, and scalable machine learning solutions.", 
  status: "Open to Full-Time & Retainers",
  about: "I am a 23-year-old Data Science & ML Engineer and undergraduate at NSBM Green University, currently based in Pitipana, Homagama. Set to graduate in 2027, I specialize in building scalable data pipelines, predictive AI models, and decoupled custom software systems. My goal is to transform complex technical challenges into streamlined, intelligent workflows.",
  linkedin: "https://www.linkedin.com/in/lochana-ranathunga-9972b023a",
  github: "https://github.com/rmlkloch",
  fiverr: "https://www.fiverr.com/tourforyourpc",
  email: "rmlkkalhara@gmail.com",
};

const BASE_SKILLS = [
  { category: "Languages", items: ["Python", "SQL", "C/C++", "R"] },
  { category: "ML & Data", items: ["PyTorch", "TensorFlow", "Scikit-learn", "Pandas", "NumPy", "OpenCV"] },
  { category: "Engineering & Cloud", items: ["Docker", "Kubernetes", "CI/CD", "Snowflake", "FastAPI"] },
];

const SERVICES = [
  {
    id: 1, Icon: Database, title: "Automated Data Pipelines",
    desc: "Robust, scalable ETL/ELT pipelines using modern stacks to centralize and clean your unstructured data securely.",
    accent: "#3B82F6",
  },
  {
    id: 2, Icon: Activity, title: "Predictive AI Models",
    desc: "End-to-end machine learning models (Churn Prediction, Recommendation Engines) deployed as live RESTful microservices.",
    accent: "#10B981",
  },
  {
    id: 3, Icon: Rocket, title: "Custom LLM Integrations",
    desc: "Tailored AI chatbots and RAG (Retrieval-Augmented Generation) workflows integrated directly into your existing SaaS products.",
    accent: "#8B5CF6",
  },
];

const TOP_PROJECTS = [
  {
    id: 1, category: "Predictive Analytics & Microservices",
    title: "Customer Churn Risk Scoring API",
    problem: "SaaS startups face high Customer Acquisition Costs (CAC) but lack the technical infrastructure to proactively identify and retain at-risk users before they cancel subscriptions.",
    desc: "A machine-learning-powered API and interactive dashboard designed to shift retention strategies from reactive to proactive. Processes incoming user behavior payloads to return a real-time probability score and business risk level.",
    tech: ["Python", "FastAPI", "Random Forest", "Streamlit", "Joblib", "Render"],
    github: "https://github.com/rmlkloch/customer-churn-risk-api.git", 
    live: "https://customer-churn-risk-api-jsnvxagbpmhe5msv4ix6l.streamlit.app/", 
    apiDocs: "https://customer-churn-risk-api.onrender.com/docs", 
    badge: "Featured Deployment", accent: "#10B981", 
    bullets: [
      "Engineered realistic synthetic SaaS dataset & deployed RF model as a live web service.",
      "Implemented class weight balancing to ensure high recall for churning users.",
      "Decoupled RESTful API backend allows clients to plug AI directly into React/Next.js apps."
    ]
  }
];

const OTHER_PROJECTS = [
  { 
    id: 1, title: "Customer Churn Risk API", category: "AI & Analytics", key: "ai", 
    desc: "Decoupled FastAPI microservice and Streamlit dashboard that processes live SaaS user behavior to return real-time churn probability scores using Random Forest.", 
    tech: ["FastAPI", "Random Forest", "Python", "Streamlit", "Render"], 
    github: "https://github.com/rmlkloch/customer-churn-risk-api.git",
    live: "https://customer-churn-risk-api-jsnvxagbpmhe5msv4ix6l.streamlit.app/",
    apiDocs: "https://customer-churn-risk-api.onrender.com/docs"
  }
];

const RESEARCH = [
  {
    id: 1, title: "Thingiverse 3D Model Curvature Research", status: "Under Supervisor Review", statusType: "review",
    abstract: "An in-depth analysis of 3D model curvature across diverse datasets sourced from Thingiverse. Focuses on extracting geometric features to identify structural tendencies.",
    topics: ["3D Data Processing", "Geometric Analysis", "PyVista", "Trimesh"]
  }
];

const FILTERS = [
  { label: "All", key: "all" },
  { label: "AI & Analytics", key: "ai" },
  { label: "Data Engineering", key: "data" },
  { label: "Automation", key: "automation" },
];

const LEADERSHIP_CARDS = [
  {
    id: 1, title: "Former Assistant Director of Operations", subtitle: "NFORCE Club, NSBM Green University",
    desc: "Orchestrated university-wide events including INNOVENTRA 2026, managing full-scale logistics, coordinating cross-functional operational teams, and ensuring seamless execution from planning through delivery.",
    iconColor: "#3B82F6", isMedal: false,
    items: [
      { text: "Led INNOVENTRA 2026 operations end-to-end" },
      { text: "Coordinated multi-department teams" },
      { text: "Managed event logistics & vendor relations" }
    ]
  },
  {
    id: 2, title: "NSBM Taekwondo Club", subtitle: "Yellow Belt",
    desc: "Competed as a solo trainee at NSBM Sports Fiesta 2026, demonstrating competitive discipline, grit, and the ability to perform under pressure.",
    iconColor: "#F59E0B", isMedal: true,
    items: [
      { title: "Poomsae", tournament: "NSBM Sports Fiesta 2026", medal: "Gold", emoji: "🥇", color: "#F59E0B" },
      { title: "Sparring", tournament: "NSBM Sports Fiesta 2026", medal: "Bronze", emoji: "🥉", color: "#9CA3AF" }
    ]
  }
];

/* ============================================================
   SHARED HELPERS & COLOR CONSTANTS
   ============================================================ */
const Accent = "#10B981"; 
const TextMain = "#111827"; 

const H = ({ children, style = {} }) => (
  <h2 style={{ fontFamily: "'Outfit', sans-serif", color: TextMain, fontSize: "clamp(2.2rem,4vw,3.2rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "0.75rem", ...style }}>{children}</h2>
);
const Label = ({ children }) => (
  <p style={{ fontFamily: "'Inter', sans-serif", color: Accent, fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>{children}</p>
);
const Body = ({ children, style = {} }) => (
  <p style={{ fontFamily: "'Inter', sans-serif", color: "#4B5563", lineHeight: 1.7, fontSize: "1.05rem", ...style }}>{children}</p>
);

const iconBox = (color = Accent) => ({
  width: 56, height: 56, borderRadius: 14,
  background: `${color}15`, color: color,
  display: "flex", alignItems: "center", justifyContent: "center",
  flexShrink: 0,
});

/* INTERSECTION OBSERVER SCROLL ANIMATION WRAPPER */
function FadeSection({ children, id, style = {} }) {
  const domRef = useRef();
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { 
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target); 
        } 
      });
    }, { threshold: 0.15 });
    
    const current = domRef.current;
    if (current) observer.observe(current);
    
    return () => { if (current) observer.unobserve(current); };
  }, []);

  return (
    <section id={id} ref={domRef} className="fade-section" style={{ ...style, opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(50px)' }}>
      {children}
    </section>
  );
}

function Toast() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(t);
  }, []);
  if (!visible) return null;
  return (
    <div className="toast">
      <CheckCircle size={18} color={Accent} /> Email copied to clipboard!
    </div>
  );
}

/* ============================================================
   CREATIVE LENS CAMERA ZOOM SCROLL TRACKER
   ============================================================ */
function YScrollTracker() {
  const [activeSection, setActiveSection] = useState("");
  const [progressHeight, setProgressHeight] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const trackSections = ["about", "services", "projects", "research", "leadership", "hireme"];
  const trackLabels = ["About", "Services", "Projects", "Research", "Leadership", "Contact"];

  useEffect(() => {
    const handleScroll = () => {
      // 1. Hide tracker ONLY on Hero Section
      if (window.scrollY > window.innerHeight * 0.5) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // 2. Math-based active section logic
      const triggerOffset = window.innerHeight * 0.4; 
      const triggerLine = window.scrollY + triggerOffset; 
      let current = "";
      
      for (const id of trackSections) {
        const el = document.getElementById(id);
        if (el) {
          const elTop = el.getBoundingClientRect().top + window.scrollY - 80; 
          const elBottom = elTop + el.offsetHeight;
          if (triggerLine >= elTop && triggerLine < elBottom) {
            current = id;
          }
        }
      }

      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        current = "hireme";
      }
      setActiveSection(current);

      // 3. Precise Progress Fill calculation
      const firstEl = document.getElementById(trackSections[0]);
      const lastEl = document.getElementById(trackSections[trackSections.length - 1]);
      
      if (firstEl && lastEl) {
        const start = firstEl.getBoundingClientRect().top + window.scrollY - triggerOffset;
        const end = lastEl.getBoundingClientRect().top + window.scrollY - triggerOffset;
        const totalDistance = end - start;
        const currentDistance = Math.max(0, window.scrollY - start);
        
        let progress = 0;
        if (totalDistance > 0) {
          progress = (currentDistance / totalDistance) * 100;
        }
        setProgressHeight(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); 
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const activeIndex = trackSections.indexOf(activeSection);

  return (
    <div style={{ position: "sticky", top: "20vh", height: "60vh", opacity: isVisible ? 1 : 0, transition: "opacity 0.4s ease", pointerEvents: isVisible ? "auto" : "none" }}>
      <div className="yscroll-track">
        
        <div className="yscroll-line-bounds">
            <div className="yscroll-line-bg"></div>
            <div className="yscroll-line-fill" style={{ height: `${progressHeight}%` }}></div>
        </div>
        
        {trackSections.map((id, index) => {
          const isActive = index === activeIndex;
          const isAdjacent = Math.abs(index - activeIndex) === 1;
          
          let nodeClass = "yscroll-node";
          if (isActive) nodeClass += " is-active";
          else if (isAdjacent) nodeClass += " is-adjacent";

          return (
            <div key={id} className={nodeClass} onClick={() => scrollToSection(id)}>
              <div className="yscroll-dot"></div>
              <span className="yscroll-label">{trackLabels[index]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   NAV Component
   ============================================================ */
function Nav({ currentView, navigateToHome }) {
  const [open, setOpen] = useState(false);
  
  const handleScroll = (e, id) => {
    e.preventDefault();
    setOpen(false);
    if (currentView !== "home") {
      navigateToHome();
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="nav-wrapper">
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }} className="nav-inner-spacing">
        
        {currentView === "home" ? (
          <button onClick={(e) => handleScroll(e, 'hero')} style={{ background: "transparent", border: "none", fontFamily: "'Outfit', sans-serif", color: TextMain, fontWeight: 900, fontSize: "1.4rem", letterSpacing: "-0.02em", cursor: "pointer", paddingRight: "1rem" }}>R.M.L.K.</button>
        ) : (
          <button onClick={navigateToHome} style={{ background: "transparent", border: "none", color: TextMain, display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'Inter', sans-serif", fontWeight: 700, cursor: "pointer" }}>
            <ArrowLeft size={18} color={Accent} /> Back
          </button>
        )}

        {currentView === "home" && (
          <div className="desktop-nav" style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
            <button onClick={(e) => handleScroll(e, 'about')} className="nav-link">About</button>
            <button onClick={(e) => handleScroll(e, 'services')} className="nav-link">Services</button>
            
            <div className="dropdown-container">
              <button onClick={(e) => handleScroll(e, 'projects')} className="nav-link">
                Projects <ChevronDown size={14} />
              </button>
              <div className="dropdown-content">
                <button onClick={() => { document.getElementById('btn-lib').click(); }} className="dropdown-item">Comprehensive Library</button>
              </div>
            </div>

            <button onClick={(e) => handleScroll(e, 'research')} className="nav-link">Research</button>
            <button onClick={(e) => handleScroll(e, 'leadership')} className="nav-link">Leadership</button>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", paddingRight: "1.5rem" }}>
          {currentView === "home" && <button onClick={(e) => handleScroll(e, 'hireme')} className="accent-btn desktop-nav" style={{ padding: "0.5rem 1.4rem", display: "inline-flex" }}>Hire Me</button>}
          {currentView === "home" && (
            <button className="mobile-menu-btn" style={{ display: "none" }} onClick={() => setOpen(!open)}>
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {open && currentView === "home" && (
        <div style={{ padding: "1.5rem", borderTop: "1px solid #D1D1D1", display: "flex", flexDirection: "column", gap: "1.25rem", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
          {["About", "Services", "Projects", "Research", "Leadership"].map(label => (
            <button key={label} onClick={(e) => handleScroll(e, label.toLowerCase())} className="nav-link" style={{ fontSize: "1.1rem" }}>{label}</button>
          ))}
          <button onClick={() => { setOpen(false); document.getElementById('btn-lib').click(); }} className="nav-link" style={{ color: Accent }}>↳ Full Project Library</button>
          <button onClick={(e) => handleScroll(e, 'hireme')} className="accent-btn" style={{ justifyContent: "center", marginTop: "1rem" }}>Hire Me</button>
        </div>
      )}
      <style>{`
         @media (max-width: 1024px) {
            .mobile-menu-btn { display: block !important; }
            .desktop-nav { display: none !important; }
         }
      `}</style>
    </div>
  );
}

/* ============================================================
   HERO 
   ============================================================ */
function Hero({ copyEmail, navigateToLibrary }) {
  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <FadeSection id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div style={{ width: "100%" }}>
        <div className="hero-layout">
          
          <div className="hero-text-col">
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: 100, padding: "0.4rem 1.25rem", marginBottom: "2rem" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: Accent, animation: "pulse 2s infinite" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", color: "#10B981", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.05em" }}>{PERSONAL.status}</span>
            </div>

            <h1 style={{ fontFamily: "'Outfit', sans-serif", color: TextMain, fontSize: "clamp(2.8rem, 6vw, 5rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1rem", letterSpacing: "-0.03em" }}>
              Hi, I'm Lochana.
            </h1>
            <p style={{ fontFamily: "'Inter', sans-serif", color: "#9B9B9B", fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", fontWeight: 500, marginBottom: "1.5rem", letterSpacing: "-0.01em" }}>
              {PERSONAL.title}
            </p>
            
            <Body style={{ fontSize: "1.1rem", marginBottom: "2.5rem", maxWidth: 540 }}>{PERSONAL.pitch}</Body>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem", justifyContent: "center" }}>
              <button onClick={(e) => handleScroll(e, 'projects')} className="accent-btn">View Projects <ArrowRight size={18} /></button>
              <button id="btn-lib" onClick={navigateToLibrary} className="ghost-btn">Full Library</button>
            </div>

            <div style={{ display: "flex", gap: "1.25rem", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
              {[{ href: PERSONAL.linkedin, Icon: Linkedin }, { href: PERSONAL.github, Icon: Github }, { href: PERSONAL.fiverr, Icon: Fiverr }].map(({ href, Icon }, i) => (
                <a key={i} href={href} target="_blank" style={{ color: "#B6B6B6", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = TextMain} onMouseLeave={e => e.currentTarget.style.color = "#B6B6B6"}>
                  <Icon size={22} />
                </a>
              ))}
              <div style={{ width: 1, height: 24, background: "#D1D1D1" }} />
              <button onClick={copyEmail} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: "0.5rem", color: "#9B9B9B", fontSize: "0.95rem", fontFamily: "'Inter', sans-serif", fontWeight: 600, cursor: "pointer", padding: 0 }}
                onMouseEnter={e => e.currentTarget.style.color = TextMain} onMouseLeave={e => e.currentTarget.style.color = "#9B9B9B"}
              ><Mail size={18} /> rmlkkalhara@gmail.com</button>
            </div>
          </div>

          <div className="hero-img-col">
            <div style={{ position: "relative", width: "100%", maxWidth: "420px", aspectRatio: "1/1", margin: "0 auto" }}>
              
              <div style={{ position: "absolute", inset: "-10%", border: "2px solid #D1D1D1", borderRadius: "50%", pointerEvents: "none" }} />
              <div style={{ position: "absolute", inset: "-5%", border: "1px dashed #B6B6B6", borderRadius: "50%", animation: "spin 30s linear infinite", pointerEvents: "none" }} />
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", background: "#E7E7E7", border: "8px solid #FFFFFF", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)", zIndex: 5 }}>
                <img src="/profile.jpg" alt="R.M Lochana Kalhara Ranathunga" style={{ width: "100%", height: "100%", objectFit: "cover", zIndex: 1, position: "relative" }} 
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} 
                />
                <div style={{ display: "none", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#9B9B9B", padding: "2rem", textAlign: "center" }}>
                  <Code size={48} style={{ marginBottom: "1rem", opacity: 0.5 }} />
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 500 }}>Add <b>profile.jpg</b> to<br/>your public folder.</p>
                </div>
              </div>
              
              {/* SOLID WHITE STACKED BADGES */}
              <div className="hero-badges-wrapper">
                <div className="solid-badge" style={{ padding: "0.85rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <TrendingUp size={18} color={Accent} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "0.9rem", color: TextMain, lineHeight: 1.1 }}>Data Science</p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.75rem", color: "#9B9B9B" }}>Specialization</p>
                  </div>
                </div>

                <div className="solid-badge" style={{ padding: "0.85rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Database size={18} color={Accent} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "0.9rem", color: TextMain, lineHeight: 1.1 }}>Machine Learning</p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.75rem", color: "#9B9B9B" }}>Specialization</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </FadeSection>
  );
}

/* ============================================================
   ABOUT 
   ============================================================ */
function About() {
  const hardcodedSkillsFlat = BASE_SKILLS.flatMap(cat => cat.items.map(i => i.toLowerCase()));
  const allProjectTech = [...TOP_PROJECTS, ...OTHER_PROJECTS].flatMap(p => p.tech);
  const dynamicNewSkills = [...new Set(allProjectTech)].filter(tech => !hardcodedSkillsFlat.includes(tech.toLowerCase()));

  return (
    <FadeSection id="about">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "4rem" }}>
        
        <div>
          <Label>About</Label>
          <H>The Engineer</H>
          <div style={{ width: 60, height: 4, background: Accent, borderRadius: 2, marginBottom: "2rem" }} />
          <Body style={{ fontSize: "1.05rem" }}>{PERSONAL.about}</Body>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "2.5rem" }}>
            <div className="glass-card" style={{ padding: "1.5rem" }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, color: TextMain, fontSize: "1.25rem" }}>NSBM</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, color: "#9B9B9B", fontSize: "0.85rem" }}>Green University (Class of 2027)</p>
            </div>
            <div className="glass-card" style={{ padding: "1.5rem" }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, color: TextMain, fontSize: "1.25rem" }}>Sri Lanka</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, color: "#9B9B9B", fontSize: "0.85rem" }}>Pitipana, Homagama</p>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: "2.5rem" }}>
          <Label>Architecture</Label>
          <H>Technical Stack</H>
          <div style={{ width: 60, height: 4, background: Accent, borderRadius: 2, marginBottom: "2rem" }} />
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {BASE_SKILLS.map(category => (
              <div key={category.category}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, color: TextMain, fontSize: "0.9rem", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{category.category}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {category.items.map(item => <span key={item} className="tech-chip">{item}</span>)}
                </div>
              </div>
            ))}

            {dynamicNewSkills.length > 0 && (
              <div style={{ marginTop: "1rem", padding: "1.5rem", background: "rgba(59, 130, 246, 0.03)", borderRadius: "12px", border: "1px dashed rgba(59, 130, 246, 0.3)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <Zap size={16} color="#3B82F6" />
                  <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, color: "#3B82F6", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Dynamically Extracted from Projects</p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {dynamicNewSkills.map(item => <span key={item} className="dynamic-chip">{item}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </FadeSection>
  );
}

/* ============================================================
   SERVICES
   ============================================================ */
function Services() {
  return (
    <FadeSection id="services">
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <Label>Specialization</Label>
        <H>Services & Architecture</H>
        <Body style={{ margin: "0 auto", maxWidth: 600 }}>End-to-end data engineering and intelligent AI systems designed to solve structural business bottlenecks.</Body>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "2rem" }}>
        {SERVICES.map(s => (
          <div key={s.id} className="glass-card glass-card-hover" style={{ padding: "3rem 2.5rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ ...iconBox(s.accent), marginBottom: "1.5rem" }}><s.Icon size={28} /></div>
            <p style={{ fontFamily: "'Outfit', sans-serif", color: TextMain, fontWeight: 800, fontSize: "1.4rem", marginBottom: "1rem", letterSpacing: "-0.01em" }}>{s.title}</p>
            <Body style={{ fontSize: "0.95rem" }}>{s.desc}</Body>
          </div>
        ))}
      </div>
    </FadeSection>
  );
}

/* ============================================================
   TOP PROJECTS
   ============================================================ */
function TopProjects({ onNavigateToLibrary }) {
  const categories = [...new Set(TOP_PROJECTS.map(p => p.category))];

  return (
    <FadeSection id="projects">
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem", marginBottom: "4rem" }}>
        <div>
          <Label>Showcase</Label>
          <H>Featured Deployments</H>
        </div>
        <button onClick={onNavigateToLibrary} className="ghost-btn" style={{ padding: "0.6rem 1.5rem", fontSize: "0.9rem" }}>
          Search Full Library <ArrowRight size={16} />
        </button>
      </div>

      {TOP_PROJECTS.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 0", background: "rgba(255,255,255,0.4)", borderRadius: "16px", border: "1px dashed #B6B6B6" }}>
          <Body style={{ color: "#9B9B9B" }}>Exciting new machine learning projects are currently under development.</Body>
        </div>
      ) : (
        categories.map(category => {
          const categoryProjects = TOP_PROJECTS.filter(p => p.category === category).slice(0, 5);
          return (
            <div key={category} style={{ marginBottom: "5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2.5rem" }}>
                <h3 style={{ fontFamily: "'Inter', sans-serif", color: TextMain, fontSize: "1.2rem", fontWeight: 800, letterSpacing: "-0.01em" }}>{category}</h3>
                <div style={{ flex: 1, height: "1px", background: `#D1D1D1` }} />
              </div>

              <div style={{ display: "grid", gap: "2rem" }}>
                {categoryProjects.map((p) => (
                  <div key={p.id} className="glass-card glass-card-hover" style={{ padding: "3rem", position: "relative", overflow: "hidden", display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
                    
                    <div style={{ position: "absolute", right: -100, top: -100, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${p.accent}20 0%, transparent 70%)`, pointerEvents: "none" }} />

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
                        <span className="accent-chip" style={{ background: `${p.accent}15`, color: p.accent, border: `1px solid ${p.accent}30` }}>{p.badge}</span>
                        
                        <div style={{ display: "flex", gap: "1.25rem" }}>
                          {p.github && <a href={p.github} target="_blank" className="nav-link"><Github size={18} /> Source</a>}
                          {p.apiDocs && <a href={p.apiDocs} target="_blank" className="nav-link"><Server size={18} /> API Docs</a>}
                          {p.live && <a href={p.live} target="_blank" className="nav-link" style={{ color: p.accent }}><Activity size={18} /> Live Demo</a>}
                        </div>
                      </div>

                      <h3 style={{ fontFamily: "'Outfit', sans-serif", color: TextMain, fontWeight: 800, fontSize: "1.8rem", marginBottom: "1rem", letterSpacing: "-0.02em" }}>{p.title}</h3>
                      
                      <div style={{ background: "rgba(255,255,255,0.4)", padding: "1.25rem", borderRadius: "8px", borderLeft: `3px solid ${p.accent}`, marginBottom: "1.5rem" }}>
                        <p style={{ fontFamily: "'Inter', sans-serif", color: "#1F2937", fontSize: "0.95rem", lineHeight: 1.6 }}>
                          <strong style={{ color: TextMain }}>The Problem: </strong>{p.problem}
                        </p>
                      </div>

                      <Body style={{ marginBottom: "1.5rem" }}>{p.desc}</Body>

                      {p.bullets && (
                        <ul style={{ listStyle: "none", marginBottom: "2rem", display: "grid", gap: "0.75rem" }}>
                          {p.bullets.map(b => (
                            <li key={b} style={{ fontFamily: "'Inter', sans-serif", color: "#4B5563", fontSize: "0.95rem", display: "flex", alignItems: "flex-start", gap: "0.75rem", lineHeight: 1.5 }}>
                              <CheckCircle size={18} color={p.accent} style={{ flexShrink: 0, marginTop: "2px" }} /> {b}
                            </li>
                          ))}
                        </ul>
                      )}

                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        {p.tech.map(t => <span key={t} className="tech-chip" style={{ background: "rgba(255,255,255,0.5)" }}>{t}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </FadeSection>
  );
}

/* ============================================================
   DEDICATED FULL PROJECT LIBRARY PAGE
   ============================================================ */
function FullProjectLibraryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [results, setResults] = useState(OTHER_PROJECTS);

  const fuse = useRef(new Fuse(OTHER_PROJECTS, { keys: ["title", "desc", "tech", "category"], threshold: 0.4 })).current;

  useEffect(() => {
    let filtered = searchTerm.trim() !== "" ? fuse.search(searchTerm).map(r => r.item) : OTHER_PROJECTS;
    if (activeFilter !== "all") filtered = filtered.filter(p => p.key === activeFilter);
    setResults(filtered);
  }, [searchTerm, activeFilter, fuse]);

  return (
    <div style={{ minHeight: "100vh", paddingTop: "120px", paddingBottom: "6rem" }}>
      <FadeSection id="library-header" style={{ paddingTop: 0 }}>
        
        <Label>Archive</Label>
        <H style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>Comprehensive Project Library</H>
        <Body style={{ marginTop: "1rem", marginBottom: "3rem", maxWidth: 600 }}>Browse the full archive of scripts, dashboards, and integrations. Use the smart search to find specific tech stacks.</Body>

        <div style={{ position: "relative", marginBottom: "2rem" }}>
          <Search size={20} className="search-icon" />
          <input type="text" placeholder="Search Python, FastAPI, Random Forest..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-bar" />
        </div>

        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "4rem" }}>
          {FILTERS.map(f => (
            <button key={f.key} className={`filter-btn ${activeFilter === f.key ? "filter-btn-active" : "filter-btn-inactive"}`} onClick={() => setActiveFilter(f.key)}>{f.label}</button>
          ))}
        </div>

        {results.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: "2rem" }}>
            {results.map(p => (
              <div key={p.id} className="glass-card glass-card-hover" style={{ padding: "2rem", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                  <span className="tech-chip" style={{ background: "rgba(255,255,255,0.6)", border: "none" }}>{p.category}</span>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    {p.github && <a href={p.github} target="_blank" title="Code" className="nav-link"><Github size={18} /></a>}
                    {p.apiDocs && <a href={p.apiDocs} target="_blank" title="API" className="nav-link"><Server size={18} /></a>}
                    {p.live && <a href={p.live} target="_blank" title="Live" className="nav-link" style={{ color: Accent }}><Activity size={18} /></a>}
                  </div>
                </div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", color: TextMain, fontWeight: 700, fontSize: "1.25rem", marginBottom: "1rem", letterSpacing: "-0.01em" }}>{p.title}</h3>
                <Body style={{ fontSize: "0.95rem", marginBottom: "2rem", flexGrow: 1 }}>{p.desc}</Body>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "auto" }}>
                  {p.tech.map(t => <span key={t} className="tech-chip" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid #D1D1D1" }}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "6rem 0", background: "rgba(255,255,255,0.4)", borderRadius: "16px", border: "1px dashed #D1D1D1" }}>
            <Database size={48} color="#B6B6B6" style={{ margin: "0 auto 1rem" }} />
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.5rem", color: TextMain, fontWeight: 700 }}>No results found</p>
            <Body>Try adjusting your search terms.</Body>
            <button onClick={() => {setSearchTerm(""); setActiveFilter("all");}} className="ghost-btn" style={{ marginTop: "1.5rem" }}>Clear Search</button>
          </div>
        )}
      </FadeSection>
    </div>
  );
}

/* ============================================================
   RESEARCH 
   ============================================================ */
function Research() {
  if (RESEARCH.length === 0) return null;
  const isCarousel = RESEARCH.length >= 5;

  return (
    <FadeSection id="research">
      
      <Label>Academia</Label>
      <H>Research Papers</H>
      
      {isCarousel ? (
        <div className="carousel-container" style={{ marginTop: "3rem" }}>
          {RESEARCH.map(r => (
            <div key={r.id} className="glass-card carousel-card glass-card-hover" style={{ padding: "2.5rem" }}>
              <span className="accent-chip" style={{ alignSelf: "flex-start", marginBottom: "1.5rem" }}>{r.status}</span>
              <p style={{ fontFamily: "'Outfit', sans-serif", color: TextMain, fontWeight: 800, fontSize: "1.3rem", lineHeight: 1.4, marginBottom: "1rem" }}>{r.title}</p>
              <Body style={{ fontSize: "0.95rem", marginBottom: "1.5rem", flexGrow: 1 }}>{r.abstract}</Body>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>{r.topics.map(t => <span key={t} className="tech-chip">{t}</span>)}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: "3rem", display: "grid", gap: "1.5rem" }}>
          {RESEARCH.map(r => (
            <div key={r.id} className="glass-card glass-card-hover" style={{ padding: "3rem", display: "flex", flexDirection: "column", borderLeft: `4px solid ${Accent}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <BookOpen size={20} color={Accent} />
                  <span style={{ fontFamily: "'Inter', sans-serif", color: Accent, fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Academic Publication</span>
                </div>
                <span className="accent-chip" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid #D1D1D1", color: TextMain }}>{r.status}</span>
              </div>
              <p style={{ fontFamily: "'Outfit', sans-serif", color: TextMain, fontWeight: 800, fontSize: "1.5rem", lineHeight: 1.4, marginBottom: "1rem" }}>{r.title}</p>
              <Body style={{ fontSize: "1rem", marginBottom: "1.5rem", maxWidth: 800 }}>{r.abstract}</Body>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>{r.topics.map(t => <span key={t} className="tech-chip">{t}</span>)}</div>
            </div>
          ))}
        </div>
      )}
      
    </FadeSection>
  );
}

/* ============================================================
   LEADERSHIP 
   ============================================================ */
function Leadership() {
  const isCarousel = LEADERSHIP_CARDS.length >= 5;

  return (
    <FadeSection id="leadership">
      
      <Label>Discipline</Label>
      <H>Beyond the Code</H>
      <Body style={{ marginTop: "0.5rem", marginBottom: "3rem", maxWidth: 520 }}>Execution, discipline, and leadership developed both inside and outside the lab.</Body>
      
      <div className={isCarousel ? "carousel-container" : ""} style={!isCarousel ? { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "2rem" } : {}}>
        {LEADERSHIP_CARDS.map(card => (
          <div key={card.id} className={`glass-card glass-card-hover ${isCarousel ? 'carousel-card' : ''}`} style={{ padding: "2.5rem", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div style={{ ...iconBox(card.iconColor), background: `${card.iconColor}15` }}>
                {card.isMedal ? <Award size={24} color={card.iconColor} /> : <Star size={24} color={card.iconColor} />}
              </div>
              <div>
                <p style={{ fontFamily: "'Outfit', sans-serif", color: TextMain, fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.01em" }}>{card.title}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", color: "#9B9B9B", fontSize: "0.9rem", marginTop: "0.25rem", fontWeight: 500 }}>{card.subtitle}</p>
              </div>
            </div>
            
            <Body style={{ fontSize: "0.95rem", marginBottom: "2rem", flexGrow: 1 }}>{card.desc}</Body>
            
            {card.isMedal ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "auto" }}>
                {card.items.map(m => (
                  <div key={m.title} style={{ background: "rgba(255,255,255,0.4)", border: `1px solid #D1D1D1`, borderRadius: 10, padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontFamily: "'Inter', sans-serif", color: TextMain, fontWeight: 700, fontSize: "0.9rem" }}>{m.title}</p>
                      <p style={{ fontFamily: "'Inter', sans-serif", color: "#9B9B9B", fontSize: "0.75rem" }}>{m.tournament}</p>
                    </div>
                    <span style={{ fontFamily: "'Inter', sans-serif", color: m.color, fontWeight: 800, fontSize: "0.9rem" }}>{m.emoji} {m.medal}</span>
                  </div>
                ))}
              </div>
            ) : (
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "auto" }}>
                {card.items.map(a => (
                  <li key={a.text} style={{ fontFamily: "'Inter', sans-serif", color: "#4B5563", fontSize: "0.9rem", display: "flex", alignItems: "flex-start", gap: "0.75rem", lineHeight: 1.5 }}>
                    <ArrowRight size={16} color={card.iconColor} style={{ marginTop: "2px", flexShrink: 0 }} /> {a.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      
    </FadeSection>
  );
}

/* ============================================================
   HIRE ME 
   ============================================================ */
function Contact({ copyEmail }) {
  return (
    <FadeSection id="hireme">
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <Label>Hire Me</Label>
        <H style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", marginBottom: "1rem" }}>Let's Build Together</H>
        <Body style={{ margin: "0 auto 3rem", maxWidth: 500, fontSize: "1.1rem" }}>
          My inbox is always open. Whether you have a robust project, a fractional retainer opportunity, or just want to connect, I'll reply within 24 hours.
        </Body>

        <div className="glass-card" style={{ padding: "4rem 2rem", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)", width: "400px", height: "400px", background: "rgba(16, 185, 129, 0.05)", filter: "blur(80px)", borderRadius: "50%", pointerEvents: "none" }} />
          
          <div style={{ margin: "0 auto 1.5rem", width: 80, height: 80, borderRadius: 24, background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Mail size={40} color={Accent} />
          </div>
          
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "clamp(1.5rem, 4vw, 2.5rem)", color: TextMain, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
            {PERSONAL.email}
          </h3>

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", margin: "2.5rem 0" }}>
            <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${PERSONAL.email}`} target="_blank" rel="noopener noreferrer" className="accent-btn" style={{ padding: "1rem 2.5rem", fontSize: "1.05rem" }}><Mail size={20} /> Open Gmail</a>
            <button onClick={copyEmail} className="ghost-btn" style={{ padding: "1rem 2.5rem", fontSize: "1.05rem" }}><Copy size={20} /> Copy</button>
          </div>
          
          <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
             {[{ href: PERSONAL.linkedin, Icon: Linkedin, label: "LinkedIn" }, { href: PERSONAL.github, Icon: Github, label: "GitHub" }, { href: PERSONAL.fiverr, Icon: Fiverr, label: "Fiverr" }].map(({ href, Icon, label }) => (
               <a key={label} href={href} target="_blank" className="ghost-btn" style={{ padding: "0.5rem 1.1rem", fontSize: "0.85rem" }}>
                 <Icon size={16} /> {label}
               </a>
             ))}
          </div>
        </div>
      </div>
    </FadeSection>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
function Footer({ copyEmail }) {
  return (
    <div style={{ width: "100%", background: "#E7E7E7", borderTop: "1px solid #D1D1D1", zIndex: 150, position: "relative" }}>
      <footer style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem", textAlign: "center" }}>
        <p style={{ fontFamily: "'Outfit', sans-serif", color: TextMain, fontWeight: 900, fontSize: "1.5rem", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>R.M.L.K.</p>
        <p style={{ fontFamily: "'Inter', sans-serif", color: "#9B9B9B", fontSize: "0.85rem", fontWeight: 500 }}>
          © 2026 R.M Lochana Kalhara Ranathunga · Data Science & ML Engineer
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "1.5rem" }}>
          {[{ href: PERSONAL.linkedin, Icon: Linkedin }, { href: PERSONAL.github, Icon: Github }, { href: PERSONAL.fiverr, Icon: Fiverr }].map(({ href, Icon }, i) => (
            <a key={i} href={href} target="_blank" style={{ color: "#9B9B9B", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = TextMain} onMouseLeave={e => e.currentTarget.style.color = "#9B9B9B"}>
              <Icon size={20} />
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}

/* ============================================================
   ROOT APP (BULLETPROOF MASTER LAYOUT)
   ============================================================ */
export default function Portfolio() {
  const [currentView, setCurrentView] = useState("home"); 
  const [toastCounter, setToastCounter] = useState(0);
  const scrollPosition = useRef(0);

  // INJECT CSS INTO HEAD
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = GLOBAL_CSS;
    document.head.appendChild(styleEl);

    if (!window.history.state) {
      window.history.replaceState({ view: 'home' }, '', window.location.pathname);
    }
    const handlePopState = (e) => {
      if (e.state && e.state.view === 'library') {
        setCurrentView("library");
        window.scrollTo(0, 0);
      } else {
        setCurrentView("home");
        setTimeout(() => window.scrollTo({ top: scrollPosition.current, behavior: "instant" }), 0);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.head.removeChild(styleEl);
    };
  }, []);

  const navigateToLibrary = () => {
    scrollPosition.current = window.scrollY;
    window.history.pushState({ view: 'library' }, '', '#library');
    setCurrentView("library");
    window.scrollTo(0, 0);
  };

  const navigateToHome = () => {
    if (window.history.state && window.history.state.view === 'library') {
      window.history.back(); 
    } else {
      window.history.pushState({ view: 'home' }, '', window.location.pathname);
      setCurrentView("home");
      setTimeout(() => window.scrollTo({ top: scrollPosition.current, behavior: "instant" }), 0);
    }
  };

  const copyEmail = (e) => {
    if (e) e.preventDefault();
    navigator.clipboard.writeText(PERSONAL.email);
    setToastCounter(prev => prev + 1);
  };

  return (
    <div style={{ backgroundColor: "#E7E7E7", minHeight: "100vh", display: "flex", flexDirection: "column", width: "100%" }}>
      
      <Nav currentView={currentView} navigateToHome={navigateToHome} />

      {/* THE MASTER FLEXBOX CONTAINER - ABSOLUTE MAX WIDTH 1200px */}
      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", flex: 1, paddingTop: 72 }}>
        
        {/* LEFT COLUMN: TRACKER */}
        <div className="desktop-tracker-col">
          {currentView === "home" && <YScrollTracker />}
        </div>
        
        {/* RIGHT COLUMN: CONTENT */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {currentView === "home" ? (
            <>
              <Hero copyEmail={copyEmail} navigateToLibrary={navigateToLibrary} />
              <About />
              <Services />
              <TopProjects onNavigateToLibrary={navigateToLibrary} />
              <Research />
              <Leadership />
              <Contact copyEmail={copyEmail} />
            </>
          ) : (
            <FullProjectLibraryPage />
          )}
        </div>
        
      </div>
      
      <Footer copyEmail={copyEmail} />

      <div className="toast-container">
        {toastCounter > 0 && <Toast key={toastCounter} />}
      </div>
    </div>
  );
}