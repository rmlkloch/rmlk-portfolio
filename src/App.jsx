import { useState, useEffect, useRef, useCallback } from "react";
import Fuse from "fuse.js";
import {
  Mail, ChevronDown, Menu, X, Copy, CheckCircle,
  Star, Award, BookOpen, Search, Rocket, TrendingUp,
  ArrowRight, Code, Database, Zap, Activity, Server, ArrowLeft,
} from "lucide-react";

/* ─────────────────────────────────────────
   SVG BRAND ICONS
───────────────────────────────────────── */
const Github = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 9 18v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

const Linkedin = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const Fiverr = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19.256 9.404h-4.32v-2.32c0-.992.8-1.8 1.792-1.8h2.528V2.116h-2.528c-2.424 0-4.4 1.976-4.4 4.4v2.888H9.68v3.168h2.648v9.312h3.32v-9.312h3.608V9.404z"/>
    <circle cx="5.04" cy="15.828" r="3.24"/>
  </svg>
);

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const PERSONAL = {
  name: "R.M Lochana Kalhara Ranathunga",
  shortName: "R.M.L.K.",
  title: "Data Science & ML Engineer",
  pitch: "Crafting intelligent data pipelines, predictive models, and scalable machine learning solutions.",
  status: "Open to Full-Time & Retainers",
  about: "I am a 23-year-old Data Science & ML Engineer and undergraduate at NSBM Green University and Plymouth University, currently based in Pitipana, Homagama. Set to graduate in 2027, I specialize in building scalable data pipelines, predictive AI models, and decoupled custom software systems. My goal is to transform complex technical challenges into streamlined, intelligent workflows.",
  linkedin: "https://www.linkedin.com/in/lochana-ranathunga-9972b023a",
  github: "https://github.com/rmlkloch",
  fiverr: "https://www.fiverr.com/tourforyourpc",
  email: "rmlkkalhara@gmail.com",
};

const SKILLS = [
  { category: "Languages",            items: ["Python", "SQL", "C/C++", "R"] },
  { category: "ML & Data",            items: ["PyTorch", "TensorFlow", "Scikit-learn", "Pandas", "NumPy", "OpenCV"] },
  { category: "Engineering & Cloud",  items: ["Docker", "Kubernetes", "CI/CD", "Snowflake", "FastAPI"] },
];

const SERVICES = [
  { id: 1, Icon: Database, title: "Automated Data Pipelines",  accent: "#3B82F6",
    desc: "Robust, scalable ETL/ELT pipelines using modern stacks to centralize and clean your unstructured data securely." },
  { id: 2, Icon: Activity, title: "Predictive AI Models",      accent: "#10B981",
    desc: "End-to-end machine learning models (Churn Prediction, Recommendation Engines) deployed as live RESTful microservices." },
  { id: 3, Icon: Rocket,   title: "Custom LLM Integrations",   accent: "#8B5CF6",
    desc: "Tailored AI chatbots and RAG workflows integrated directly into your existing SaaS products." },
];

const TOP_PROJECTS = [
  {
    id: 1, category: "Predictive Intelligence & Risk Modeling",
    title: "Customer Churn Risk Scoring API",
    badge: "Featured Deployment", accent: "#10B981",
    problem: "SaaS startups face high Customer Acquisition Costs (CAC) but lack the technical infrastructure to proactively identify and retain at-risk users before they cancel subscriptions.",
    desc: "A machine-learning-powered API and interactive dashboard designed to shift retention strategies from reactive to proactive. Processes incoming user behavior payloads to return a real-time probability score and business risk level.",
    tech: ["Python", "FastAPI", "Random Forest", "Streamlit", "Joblib", "Render"],
    github: "https://github.com/rmlkloch/customer-churn-risk-api.git",
    live: "https://customer-churn-risk-api-jsnvxagbpmhe5msv4ix6l.streamlit.app/",
    apiDocs: "https://customer-churn-risk-api.onrender.com/docs",
    bullets: [
      "Engineered realistic synthetic SaaS dataset & deployed RF model as a live web service.",
      "Implemented class weight balancing to ensure high recall for churning users.",
      "Decoupled RESTful API backend allows clients to plug AI directly into React/Next.js apps.",
    ],
  },
];

const OTHER_PROJECTS = [
  { id: 1, title: "Customer Churn Risk API", category: "Predictive Intelligence & Risk Modeling", key: "predictive",
    desc: "Decoupled FastAPI microservice and Streamlit dashboard that processes live SaaS user behavior to return real-time churn probability scores using Random Forest.",
    tech: ["FastAPI", "Random Forest", "Python", "Streamlit", "Render"],
    github: "https://github.com/rmlkloch/customer-churn-risk-api.git",
    live: "https://customer-churn-risk-api-jsnvxagbpmhe5msv4ix6l.streamlit.app/",
    apiDocs: "https://customer-churn-risk-api.onrender.com/docs",
  },
];

const RESEARCH = [
  { id: 1,
    title: "Thingiverse 3D Model Curvature Research",
    status: "Under Supervisor Review", statusType: "review",
    abstract: "An in-depth analysis of 3D model curvature across diverse datasets sourced from Thingiverse. Focuses on extracting geometric features to identify structural tendencies.",
    topics: ["3D Data Processing", "Geometric Analysis", "PyVista", "Trimesh"],
  },
];

const LEADERSHIP = [
  { id: 1, iconColor: "#3B82F6", isMedal: false,
    title: "Former Assistant Director of Operations",
    subtitle: "NFORCE Club, NSBM Green University",
    desc: "Orchestrated university-wide events including INNOVENTRA 2026, managing full-scale logistics, coordinating cross-functional operational teams, and ensuring seamless execution from planning through delivery.",
    items: [
      { text: "Led INNOVENTRA 2026 operations end-to-end" },
      { text: "Coordinated multi-department teams" },
      { text: "Managed event logistics & vendor relations" },
    ],
  },
  { id: 2, iconColor: "#F59E0B", isMedal: true,
    title: "NSBM Taekwondo Club",
    subtitle: "Yellow Belt",
    desc: "Competed as a solo trainee at NSBM Sports Fiesta 2026, demonstrating competitive discipline, grit, and the ability to perform under pressure.",
    items: [
      { title: "Poomsae",  tournament: "NSBM Sports Fiesta 2026", medal: "Gold",   emoji: "🥇", color: "#F59E0B" },
      { title: "Sparring", tournament: "NSBM Sports Fiesta 2026", medal: "Bronze", emoji: "🥉", color: "#9CA3AF" },
    ],
  },
];

const FILTERS = [
  { label: "All", key: "all" },
  { label: "Predictive Intelligence & Risk Modeling", key: "predictive" },
  { label: "Autonomous Systems & Computer Vision", key: "cv" },
  { label: "Applied NLP & Knowledge Retrieval", key: "nlp" },
  { label: "Smart Infrastructure & Optimization", key: "infra" },
  { label: "Bio-Informatics & Healthcare Analytics", key: "bio" },
];

const NAV_SECTIONS = ["about", "services", "projects", "research", "leadership"];
const TRACKER_SECTIONS = ["about", "services", "projects", "research", "leadership", "hireme"];
const TRACKER_LABELS  = ["About", "Services", "Projects", "Research", "Leadership", "Contact"];

/* ─────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Nunito+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; font-size: 16px; }
  body { background: #EBEBEB; color: #111827; overflow-x: hidden; -webkit-font-smoothing: antialiased; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #EBEBEB; }
  ::-webkit-scrollbar-thumb { background: #C0C0C0; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #A0A0A0; }

  /* ── DESIGN TOKENS ── */
  :root {
    --accent:    #10B981;
    --text:      #111827;
    --muted:     #6B7280;
    --faint:     #9CA3AF;
    --border:    #D4D4D4;
    --surface:   rgba(255,255,255,0.70);
    --surface-s: rgba(255,255,255,0.95);
    --shadow-sm: 0 2px 8px rgba(0,0,0,0.05);
    --shadow-md: 0 8px 24px rgba(0,0,0,0.07);
    --shadow-lg: 0 20px 48px rgba(0,0,0,0.10);
    --radius-sm: 8px;
    --radius-md: 14px;
    --radius-lg: 20px;
    --radius-xl: 28px;
    --gap:       1.5rem;
    --section-y: 6rem;
    --nav-h:     70px;
  }

  /* ── LAYOUT ── */
  .container {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }
  .section {
    padding: var(--section-y) 0;
  }
  .main-offset {
    /* no left offset — tracker removed */
  }

  /* ── TYPOGRAPHY ── */
  .font-display { font-family: 'Outfit', sans-serif; }
  .font-body    { font-family: 'Nunito Sans', sans-serif; }

  .label {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 0.6rem;
  }
  .heading {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.02em;
    line-height: 1.15;
    margin-bottom: 0.75rem;
  }
  .heading-hero {
    font-size: clamp(2.8rem, 6vw, 5rem);
    font-weight: 800;
    line-height: 1.08;
    letter-spacing: -0.03em;
  }
  .body-text {
    font-family: 'Nunito Sans', sans-serif;
    color: var(--muted);
    line-height: 1.78;
    font-size: 1rem;
    font-weight: 400;
  }
  .subheading {
    font-family: 'Nunito Sans', sans-serif;
    font-size: clamp(1.1rem, 2.2vw, 1.5rem);
    font-weight: 500;
    color: var(--faint);
    letter-spacing: 0;
  }

  /* ── CARDS ── */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: var(--shadow-sm);
  }
  .card-hover {
    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1),
                box-shadow 0.35s cubic-bezier(0.16,1,0.3,1),
                border-color 0.3s ease;
  }
  .card-hover:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
    border-color: #B8B8B8;
  }

  /* ── BUTTONS ── */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Nunito Sans', sans-serif;
    font-weight: 700;
    font-size: 0.95rem;
    padding: 0.75rem 1.75rem;
    border-radius: var(--radius-sm);
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s ease;
    white-space: nowrap;
  }
  .btn-primary {
    background: var(--text);
    color: #fff;
    box-shadow: 0 4px 14px rgba(17,24,39,0.18);
  }
  .btn-primary:hover { background: #000; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(17,24,39,0.28); }
  .btn-ghost {
    background: rgba(255,255,255,0.55);
    color: var(--text);
    border: 1px solid var(--border);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  .btn-ghost:hover { background: rgba(255,255,255,0.9); border-color: #A8A8A8; transform: translateY(-2px); }
  .btn-sm { padding: 0.5rem 1.1rem; font-size: 0.85rem; }
  .btn-lg { padding: 1rem 2.25rem; font-size: 1.05rem; }
  .btn-icon {
    background: none; border: none; cursor: pointer;
    color: var(--faint); display: inline-flex; align-items: center;
    font-family: 'Nunito Sans', sans-serif; font-size: 0.9rem; font-weight: 600;
    padding: 0; gap: 0.4rem; transition: color 0.2s;
  }
  .btn-icon:hover { color: var(--text); }

  /* ── CHIPS ── */
  .chip {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.3rem 0.8rem;
    border-radius: 100px;
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.75);
    color: var(--muted);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
  }
  .chip-accent {
    background: rgba(16,185,129,0.08);
    border-color: rgba(16,185,129,0.25);
    color: #059669;
    font-weight: 700;
  }
  .chip-blue {
    background: rgba(59,130,246,0.08);
    border-color: rgba(59,130,246,0.25);
    color: #2563EB;
    font-weight: 700;
    animation: pulse-glow 2s infinite;
  }
  .chip-status {
    background: rgba(255,255,255,0.5);
    border: 1px solid var(--border);
    color: var(--text);
  }
  @keyframes pulse-glow {
    0%   { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
    70%  { box-shadow: 0 0 0 6px rgba(59,130,246,0); }
    100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
  }

  /* ── DIVIDER BAR ── */
  .accent-bar {
    width: 48px; height: 3px;
    background: var(--accent);
    border-radius: 2px;
    margin-bottom: 2rem;
  }

  /* ── FILTER BUTTONS ── */
  .filter-pill {
    padding: 0.45rem 1.2rem;
    border-radius: 100px;
    font-family: 'Nunito Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.01em;
  }
  .filter-pill-active  { background: var(--text); color: #fff; border: 1px solid var(--text); }
  .filter-pill-inactive { background: rgba(255,255,255,0.6); color: var(--muted); border: 1px solid var(--border); }
  .filter-pill-inactive:hover { border-color: #9B9B9B; color: var(--text); }

  /* ── NAV ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    height: var(--nav-h);
    background: rgba(255,255,255,0.72);
    backdrop-filter: saturate(180%) blur(22px);
    -webkit-backdrop-filter: saturate(180%) blur(22px);
    border-bottom: 1px solid rgba(212,212,212,0.5);
    transition: background 0.3s;
  }
  .nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }
  .nav-logo {
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    font-size: 1.35rem;
    color: var(--text);
    letter-spacing: -0.02em;
    background: none; border: none; cursor: pointer;
    transition: opacity 0.2s;
  }
  .nav-logo:hover { opacity: 0.75; }
  .nav-links { display: flex; align-items: center; gap: 2.25rem; }
  .nav-link {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 0.92rem;
    font-weight: 600;
    color: var(--text);
    background: none; border: none; cursor: pointer;
    text-decoration: none;
    transition: color 0.2s;
    letter-spacing: 0.01em;
    display: inline-flex; align-items: center; gap: 0.2rem;
  }
  .nav-link:hover { color: var(--accent); }

  /* Dropdown */
  .dropdown { position: relative; display: inline-block; }
  .dropdown::after { content: ''; position: absolute; bottom: -20px; left: 0; width: 100%; height: 20px; }
  .dropdown-panel {
    position: absolute; top: calc(100% + 10px); left: 50%;
    transform: translateX(-50%) translateY(6px);
    background: var(--surface-s);
    min-width: 200px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    padding: 0.4rem;
    opacity: 0; visibility: hidden; pointer-events: none;
    transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
    z-index: 300;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
  .dropdown:hover .dropdown-panel {
    opacity: 1; visibility: visible;
    transform: translateX(-50%) translateY(0);
    pointer-events: auto;
  }
  .dropdown-item {
    display: block; width: 100%;
    padding: 0.65rem 0.9rem;
    font-family: 'Nunito Sans', sans-serif;
    font-size: 0.88rem; font-weight: 600;
    color: var(--muted); text-align: left;
    border: none; background: transparent; cursor: pointer;
    border-radius: var(--radius-sm);
    transition: background 0.15s, color 0.15s;
  }
  .dropdown-item:hover { background: #EBEBEB; color: var(--text); }

  /* Mobile drawer */
  .mobile-drawer {
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid var(--border);
    padding: 1.5rem;
    display: flex; flex-direction: column; gap: 1.25rem;
  }
  .mobile-nav-link {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 1.05rem; font-weight: 600;
    color: var(--text); background: none;
    border: none; cursor: pointer;
    text-align: left; padding: 0;
    transition: color 0.2s;
  }
  .mobile-nav-link:hover { color: var(--accent); }
  .mobile-nav-link-accent { color: var(--accent) !important; }

  /* HIDE MISSING TRACKER CSS BUG */
  .tracker-wrap { display: none !important; }

  /* ── SCROLL ANIMATION ── */
  .fade-up {
    opacity: 0; transform: translateY(40px);
    transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1),
                transform 0.85s cubic-bezier(0.16,1,0.3,1);
  }
  .fade-up.visible { opacity: 1; transform: translateY(0); }

  /* ── HERO ── */
  .hero-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    align-items: center;
  }
  .hero-status-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: rgba(16,185,129,0.08);
    border: 1px solid rgba(16,185,129,0.22);
    border-radius: 100px;
    padding: 0.35rem 1.1rem;
    margin-bottom: 1.75rem;
    align-self: flex-start;
  }
  .status-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); animation: blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
  .status-text { font-family: 'Nunito Sans', sans-serif; font-size: 0.82rem; font-weight: 700; color: var(--accent); letter-spacing: 0.04em; }

  .hero-image-wrap {
    position: relative;
    width: 100%; max-width: 380px;
    aspect-ratio: 1/1;
    margin: 0 auto;
  }
  .hero-ring-outer {
    position: absolute; inset: -10%;
    border: 1.5px solid var(--border);
    border-radius: 50%; pointer-events: none;
  }
  .hero-ring-dashed {
    position: absolute; inset: -5%;
    border: 1px dashed #C0C0C0;
    border-radius: 50%;
    animation: spin 28s linear infinite;
    pointer-events: none;
  }
  @keyframes spin { 100% { transform: rotate(360deg); } }
  .hero-photo {
    position: absolute; inset: 0;
    border-radius: 50%; overflow: hidden;
    background: #E0E0E0;
    border: 7px solid #fff;
    box-shadow: var(--shadow-lg);
    z-index: 5;
  }
  .hero-photo img { width: 100%; height: 100%; object-fit: cover; }
  .hero-photo-fallback {
    width: 100%; height: 100%; display: flex;
    flex-direction: column; align-items: center; justify-content: center;
    color: var(--faint); padding: 2rem; text-align: center;
  }
  .hero-badge {
    background: #fff;
    border: 1px solid #E8E8E8;
    border-radius: var(--radius-md);
    box-shadow: 0 10px 28px rgba(0,0,0,0.09);
    padding: 0.8rem 1.15rem;
    display: flex; align-items: center; gap: 0.85rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    z-index: 10; position: relative;
  }
  .hero-badge:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(0,0,0,0.13); }
  .hero-badge-icon {
    width: 34px; height: 34px; border-radius: 50%;
    background: rgba(16,185,129,0.1);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .hero-badge-title { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 0.9rem; color: var(--text); line-height: 1.2; }
  .hero-badge-sub   { font-family: 'Nunito Sans', sans-serif; font-weight: 500; font-size: 0.72rem; color: var(--faint); }

  /* New Badge Container Styles */
  .hero-badges-container {
    position: absolute;
    bottom: 10%;
    right: -20%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1rem;
    z-index: 20;
  }

  /* Creative staggered layout from wireframe */
  .hero-badge:nth-child(2) {
    margin-right: 3.5rem;
  }

  @media (max-width: 1024px) {
    .hero-badges-container { right: -5%; }
  }

  @media (max-width: 639px) {
    .hero-grid { grid-template-columns: 1fr; text-align: center; }
    .hero-text { align-items: center; }
    .hero-status-badge { align-self: center; }
    
    /* Safely hide the entire profile picture and badges wrapper on mobile */
    .hero-visuals { display: none !important; }
    
    .contact-card { padding: 2.5rem 1.25rem; }
    .research-card { padding: 1.75rem; }
    .leadership-card { padding: 1.75rem; }
    .lib-grid { grid-template-columns: 1fr; }
  }

  /* ── ABOUT GRID ── */
  .about-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  /* ── SERVICES GRID ── */
  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.75rem;
    margin-top: 3rem;
  }
  .service-icon-wrap {
    width: 52px; height: 52px;
    border-radius: var(--radius-sm);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.4rem;
    flex-shrink: 0;
  }

  /* ── PROJECTS ── */
  .project-links { display: flex; align-items: center; gap: 1.1rem; flex-wrap: wrap; }
  .project-problem {
    background: rgba(255,255,255,0.45);
    border-radius: var(--radius-sm);
    padding: 1.1rem 1.25rem;
    border-left: 3px solid var(--accent);
    margin-bottom: 1.25rem;
  }
  .project-bullets { list-style: none; display: flex; flex-direction: column; gap: 0.65rem; margin-bottom: 1.75rem; }
  .project-bullet {
    display: flex; align-items: flex-start; gap: 0.65rem;
    font-family: 'Nunito Sans', sans-serif; font-size: 0.95rem;
    color: var(--muted); line-height: 1.6;
  }
  .project-bullet svg { flex-shrink: 0; margin-top: 2px; }
  .tech-wrap { display: flex; flex-wrap: wrap; gap: 0.45rem; }

  /* Library card grid */
  .lib-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.75rem;
  }
  .lib-card { padding: 1.75rem; display: flex; flex-direction: column; }

  /* ── RESEARCH ── */
  .research-card {
    padding: 2.5rem;
    border-left: 4px solid var(--accent);
    display: flex; flex-direction: column; gap: 1rem;
  }
  .research-header {
    display: flex; justify-content: space-between;
    align-items: flex-start; flex-wrap: wrap; gap: 1rem;
  }
  .research-meta {
    display: flex; align-items: center; gap: 0.6rem;
  }
  .research-meta-label {
    font-family: 'Nunito Sans', sans-serif; font-size: 0.8rem;
    font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 0.05em;
  }
  .research-title {
    font-family: 'Outfit', sans-serif; font-size: 1.45rem;
    font-weight: 700; color: var(--text); line-height: 1.35;
  }

  /* ── LEADERSHIP GRID ── */
  .leadership-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
  .leadership-card { padding: 2.25rem; display: flex; flex-direction: column; }
  .leadership-header { display: flex; gap: 1.1rem; align-items: flex-start; margin-bottom: 1.35rem; }
  .leadership-icon {
    width: 52px; height: 52px; border-radius: var(--radius-sm);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .leadership-title { font-family: 'Outfit', sans-serif; font-size: 1.15rem; font-weight: 700; color: var(--text); letter-spacing: -0.01em; }
  .leadership-sub { font-family: 'Nunito Sans', sans-serif; font-size: 0.87rem; color: var(--faint); margin-top: 0.2rem; }
  .medal-row {
    background: rgba(255,255,255,0.45); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 0.9rem 1rem;
    display: flex; justify-content: space-between; align-items: center;
  }
  .medal-title { font-family: 'Nunito Sans', sans-serif; font-weight: 700; font-size: 0.9rem; color: var(--text); }
  .medal-sub   { font-family: 'Nunito Sans', sans-serif; font-size: 0.75rem; color: var(--faint); }
  .bullet-row { display: flex; align-items: flex-start; gap: 0.65rem; font-family: 'Nunito Sans', sans-serif; font-size: 0.9rem; color: var(--muted); line-height: 1.6; }

  /* ── CONTACT ── */
  .contact-card {
    padding: 3.5rem 2.25rem;
    text-align: center;
    position: relative; overflow: hidden;
  }
  .contact-email {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(1.3rem, 3.5vw, 2.2rem);
    font-weight: 700; color: var(--text);
    letter-spacing: -0.01em;
    margin-bottom: 0.5rem;
    word-break: break-all;
  }
  .contact-glow {
    position: absolute; top: -40%; left: 50%; transform: translateX(-50%);
    width: 350px; height: 350px;
    background: rgba(16,185,129,0.06);
    filter: blur(70px); border-radius: 50%; pointer-events: none;
  }
  .contact-icon-wrap {
    width: 72px; height: 72px;
    background: rgba(16,185,129,0.1);
    border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.5rem;
  }

  /* ── FOOTER ── */
  .footer {
    position: relative; z-index: 150;
    background: #EBEBEB;
    border-top: 1px solid var(--border);
    padding: 2.25rem 1.5rem;
    text-align: center;
  }
  .footer-name {
    font-family: 'Outfit', sans-serif; font-size: 1.4rem; font-weight: 700;
    color: var(--text); letter-spacing: -0.02em; margin-bottom: 0.4rem;
  }
  .footer-copy {
    font-family: 'Nunito Sans', sans-serif; font-size: 0.83rem;
    color: var(--faint); font-weight: 500;
  }
  .footer-icons { display: flex; justify-content: center; gap: 1.4rem; margin-top: 1.5rem; }
  .footer-icon-link { color: var(--faint); transition: color 0.2s; }
  .footer-icon-link:hover { color: var(--text); }

  /* ── TOAST ── */
  .toast-host {
    position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
    z-index: 9999; pointer-events: none;
  }
  .toast {
    background: rgba(17,24,39,0.95);
    color: #fff; border-radius: 100px;
    padding: 0.8rem 1.6rem;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600;
    display: flex; align-items: center; gap: 0.55rem;
    box-shadow: 0 10px 24px rgba(0,0,0,0.2);
    animation: toast-anim 3s ease-in-out forwards;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  @keyframes toast-anim {
    0%   { opacity: 0; transform: translateY(16px) scale(0.92); }
    10%  { opacity: 1; transform: translateY(0) scale(1); }
    90%  { opacity: 1; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(-12px) scale(0.95); }
  }

  /* ── EMPTY STATE ── */
  .empty-state {
    text-align: center; padding: 5rem 2rem;
    background: rgba(255,255,255,0.4);
    border: 1px dashed var(--border);
    border-radius: var(--radius-lg);
  }
  .empty-state h3 { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 700; color: var(--text); margin: 1rem 0 0.5rem; }

  /* ── RESPONSIVE: TABLET ── */
  @media (min-width: 640px) {
    .about-grid    { grid-template-columns: 1fr 1fr; }
    .hero-grid     { grid-template-columns: 1fr 1fr; }
    .hero-text     { text-align: left; align-items: flex-start; }
    .hero-status-badge { align-self: flex-start; }
    .hero-image-wrap { margin: 0; }
  }

  /* ── RESPONSIVE: DESKTOP ── */
  @media (min-width: 1025px) {
    .desktop-only { display: flex !important; }
    .mobile-only  { display: none !important; }
    .about-grid   { grid-template-columns: 5fr 7fr; gap: 4rem; }
  }

  /* ── RESPONSIVE: MOBILE ── */
  @media (max-width: 1024px) {
    .desktop-only { display: none !important; }
    .mobile-only  { display: flex !important; }
    :root { --section-y: 4rem; }
  }

  /* LIBRARY PAGE HEADER */
  .lib-header { padding: 0 0 3rem; }
`;

/* ─────────────────────────────────────────
   UTILITY HOOKS & HELPERS
───────────────────────────────────────── */
function useFadeSection(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.unobserve(el); }
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.unobserve(el);
  }, [ref]);
  return visible;
}

function FadeSection({ id, children, style = {} }) {
  const ref = useRef();
  const visible = useFadeSection(ref);
  return (
    <section id={id} ref={ref} className={`fade-up${visible ? " visible" : ""}`} style={style}>
      {children}
    </section>
  );
}

function Toast() {
  const [on, setOn] = useState(true);
  useEffect(() => { const t = setTimeout(() => setOn(false), 2800); return () => clearTimeout(t); }, []);
  if (!on) return null;
  return (
    <div className="toast">
      <CheckCircle size={16} color="#10B981" /> Email copied!
    </div>
  );
}

const scrollTo = (id, offset = 70) => {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.offsetTop - offset, behavior: "smooth" });
};

/* ─────────────────────────────────────────
   SCROLL TRACKER
───────────────────────────────────────── */
function ScrollTracker() {
  const [active, setActive]    = useState("");
  const [fill, setFill]        = useState(0);
  const [show, setShow]        = useState(false);
  const ref = useRef();

  const onScroll = useCallback(() => {
    setShow(window.scrollY > window.innerHeight * 0.45);

    const offset = window.innerHeight * 0.4;
    const line   = window.scrollY + offset;
    let cur = "";
    for (const id of TRACKER_SECTIONS) {
      const el = document.getElementById(id);
      if (el && line >= el.offsetTop - 80 && line < el.offsetTop - 80 + el.offsetHeight) cur = id;
    }
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) cur = "hireme";
    setActive(cur);

    const first = document.getElementById(TRACKER_SECTIONS[0]);
    const last  = document.getElementById(TRACKER_SECTIONS[TRACKER_SECTIONS.length - 1]);
    if (first && last) {
      const start = first.offsetTop - offset;
      const end   = last.offsetTop  - offset;
      const pct   = Math.min(100, Math.max(0, ((window.scrollY - start) / (end - start)) * 100));
      setFill(pct);

      if (ref.current) {
        ref.current.style.transform = window.scrollY > end
          ? `translateY(-${window.scrollY - end}px)` : "";
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const activeIdx = TRACKER_SECTIONS.indexOf(active);

  return (
    <div className={`tracker-wrap ${show ? "visible" : "hidden"}`} ref={ref}>
      <div className="tracker-track">
        <div className="tracker-line">
          <div className="tracker-line-bg" />
          <div className="tracker-line-fill" style={{ height: `${fill}%` }} />
        </div>
        {TRACKER_SECTIONS.map((id, i) => {
          const cls = i === activeIdx ? "active" : Math.abs(i - activeIdx) === 1 ? "adj" : "";
          return (
            <div key={id} className={`tracker-node ${cls}`} onClick={() => scrollTo(id)}>
              <div className="tracker-dot" />
              <span className="tracker-label">{TRACKER_LABELS[i]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   NAV
───────────────────────────────────────── */
function Nav({ view, toHome, toLibrary }) {
  const [open, setOpen] = useState(false);

  const go = useCallback((e, id) => {
    e.preventDefault(); setOpen(false);
    if (view !== "home") { toHome(); setTimeout(() => scrollTo(id), 120); return; }
    scrollTo(id);
  }, [view, toHome]);

  return (
    <nav className="nav">
      <div className="container nav-inner">
        {view === "home"
          ? <button className="nav-logo" onClick={(e) => go(e, "hero")}>R.M.L.K.</button>
          : <button className="btn btn-icon" style={{ color: "var(--text)", fontWeight: 700 }}
              onClick={toHome}>
              <ArrowLeft size={17} color="#10B981" /> Back
            </button>
        }

        {view === "home" && (
          <>
            {/* Desktop links */}
            <div className="nav-links desktop-only">
              {NAV_SECTIONS.map(s => s === "projects" ? (
                <div key={s} className="dropdown">
                  <button className="nav-link" onClick={(e) => go(e, s)}>
                    Projects <ChevronDown size={13} />
                  </button>
                  <div className="dropdown-panel">
                    <button className="dropdown-item" onClick={() => { setOpen(false); toLibrary(); }}>
                      Comprehensive Library
                    </button>
                  </div>
                </div>
              ) : (
                <button key={s} className="nav-link" onClick={(e) => go(e, s)}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <button className="btn btn-primary btn-sm desktop-only"
                onClick={(e) => go(e, "hireme")}>Hire Me</button>
              <button className="btn-icon mobile-only" style={{ color: "var(--text)" }}
                onClick={() => setOpen(o => !o)} aria-label="Menu">
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile drawer */}
      {open && view === "home" && (
        <div className="mobile-drawer">
          {NAV_SECTIONS.map(s => (
            <button key={s} className="mobile-nav-link" onClick={(e) => go(e, s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
          <button className="mobile-nav-link mobile-nav-link-accent"
            onClick={() => { setOpen(false); toLibrary(); }}>
            ↳ Full Project Library
          </button>
          <button className="btn btn-primary" style={{ justifyContent: "center", marginTop: "0.5rem" }}
            onClick={(e) => go(e, "hireme")}>Hire Me</button>
        </div>
      )}
    </nav>
  );
}

/* ─────────────────────────────────────────
   HERO
───────────────────────────────────────── */
function Hero({ copyEmail, toLibrary }) {
  return (
    <FadeSection id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: "var(--nav-h)", paddingBottom: "4rem" }}>
      <div className="container">
        <div className="hero-grid">

          {/* Text */}
          <div className="hero-text" style={{ display: "flex", flexDirection: "column" }}>
            <div className="hero-status-badge">
              <span className="status-dot" />
              <span className="status-text">{PERSONAL.status}</span>
            </div>

            <h1 className="heading heading-hero font-display" style={{ marginBottom: "0.9rem" }}>
              Hi, I'm Lochana.
            </h1>
            <p className="subheading" style={{ marginBottom: "1.25rem" }}>{PERSONAL.title}</p>
            <p className="body-text" style={{ marginBottom: "2.25rem", maxWidth: 520 }}>{PERSONAL.pitch}</p>

            <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
              <button className="btn btn-primary" onClick={() => scrollTo("projects")}>
                View Projects <ArrowRight size={17} />
              </button>
              <button id="btn-lib" className="btn btn-ghost" onClick={toLibrary}>
                Full Library
              </button>
            </div>

            <div style={{ display: "flex", gap: "1.1rem", alignItems: "center", flexWrap: "wrap" }}>
              {[{ href: PERSONAL.linkedin, Icon: Linkedin }, { href: PERSONAL.github, Icon: Github }, { href: PERSONAL.fiverr, Icon: Fiverr }].map(({ href, Icon }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="footer-icon-link">
                  <Icon size={21} />
                </a>
              ))}
              <div style={{ width: 1, height: 22, background: "var(--border)" }} />
              <button className="btn-icon" onClick={copyEmail}>
                <Mail size={17} /> {PERSONAL.email}
              </button>
            </div>
          </div>

          {/* Image and Badges */}
          <div className="hero-visuals" style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <div style={{ position: "relative", width: "100%", maxWidth: "380px" }}>
              <div className="hero-image-wrap" style={{ margin: "0 auto", width: "100%" }}>
                <div className="hero-ring-outer" />
                <div className="hero-ring-dashed" />
                <div className="hero-photo">
                  <img src="/profile.jpg" alt={PERSONAL.name}
                    onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                  <div className="hero-photo-fallback" style={{ display: "none" }}>
                    <Code size={40} style={{ opacity: 0.35, marginBottom: "0.75rem" }} />
                    <p className="body-text" style={{ fontSize: "0.8rem" }}>Add <strong>profile.jpg</strong><br/>to your <code>/public</code> folder</p>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="hero-badges-container">
                {[
                  { label: "Data Science",   sub: "Specialization", Icon: TrendingUp },
                  { label: "Machine Learning", sub: "Specialization", Icon: Database },
                ].map(({ label, sub, Icon }) => (
                  <div key={label} className="hero-badge">
                    <div className="hero-badge-icon"><Icon size={17} color="#10B981" /></div>
                    <div style={{ textAlign: "left" }}>
                      <div className="hero-badge-title">{label}</div>
                      <div className="hero-badge-sub">{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </FadeSection>
  );
}

/* ─────────────────────────────────────────
   ABOUT
───────────────────────────────────────── */
function About() {
  const allProjectTech = [...TOP_PROJECTS, ...OTHER_PROJECTS].flatMap(p => p.tech);
  const baseFlat = SKILLS.flatMap(c => c.items.map(i => i.toLowerCase()));
  const dynamic  = [...new Set(allProjectTech)].filter(t => !baseFlat.includes(t.toLowerCase()));

  return (
    <FadeSection id="about" style={{ padding: "var(--section-y) 0" }}>
      <div className="container">
        <div className="about-grid">

          {/* Bio */}
          <div>
            <p className="label">About</p>
            <h2 className="heading">The Engineer</h2>
            <div className="accent-bar" />
            <p className="body-text">{PERSONAL.about}</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "2rem" }}>
              {[
                { top: "NSBM & Plymouth", sub: "Undergraduate (Class of 2027)" },
                { top: "Sri Lanka", sub: "Pitipana, Homagama" },
              ].map(({ top, sub }) => (
                <div key={top} className="card" style={{ padding: "1.25rem" }}>
                  <p className="font-display" style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text)" }}>{top}</p>
                  <p className="body-text" style={{ fontSize: "0.82rem", marginTop: "0.2rem" }}>{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="card" style={{ padding: "2.25rem" }}>
            <p className="label">Architecture</p>
            <h2 className="heading">Technical Stack</h2>
            <div className="accent-bar" />

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {SKILLS.map(cat => (
                <div key={cat.category}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text)", marginBottom: "0.65rem" }}>
                    {cat.category}
                  </p>
                  <div className="tech-wrap">
                    {cat.items.map(t => <span key={t} className="chip">{t}</span>)}
                  </div>
                </div>
              ))}

              {dynamic.length > 0 && (
                <div style={{ padding: "1.25rem", background: "rgba(59,130,246,0.04)", border: "1px dashed rgba(59,130,246,0.3)", borderRadius: "var(--radius-sm)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.9rem" }}>
                    <Zap size={15} color="#3B82F6" />
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.78rem", color: "#3B82F6", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      From Projects
                    </p>
                  </div>
                  <div className="tech-wrap">
                    {dynamic.map(t => <span key={t} className="chip chip-blue">{t}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </FadeSection>
  );
}

/* ─────────────────────────────────────────
   SERVICES
───────────────────────────────────────── */
function Services() {
  return (
    <FadeSection id="services" style={{ padding: "var(--section-y) 0" }}>
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 3rem" }}>
          <p className="label">Specialization</p>
          <h2 className="heading">Services & Architecture</h2>
          <p className="body-text">End-to-end data engineering and intelligent AI systems designed to solve structural business bottlenecks.</p>
        </div>

        <div className="services-grid">
          {SERVICES.map(s => (
            <div key={s.id} className="card card-hover" style={{ padding: "2.5rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <div className="service-icon-wrap" style={{ background: `${s.accent}14` }}>
                <s.Icon size={26} color={s.accent} />
              </div>
              <p className="font-display" style={{ fontWeight: 800, fontSize: "1.3rem", color: "var(--text)", marginBottom: "0.85rem", letterSpacing: "-0.01em" }}>{s.title}</p>
              <p className="body-text" style={{ fontSize: "0.93rem" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </FadeSection>
  );
}

/* ─────────────────────────────────────────
   TOP PROJECTS
───────────────────────────────────────── */
function TopProjects({ toLibrary }) {
  const categories = [...new Set(TOP_PROJECTS.map(p => p.category))];

  return (
    <FadeSection id="projects" style={{ padding: "var(--section-y) 0" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem", marginBottom: "3.5rem" }}>
          <div>
            <p className="label">Showcase</p>
            <h2 className="heading">Featured Deployments</h2>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={toLibrary}>
            Search Full Library <ArrowRight size={15} />
          </button>
        </div>

        {TOP_PROJECTS.length === 0 ? (
          <div className="empty-state">
            <p className="body-text">Exciting new projects are currently under development.</p>
          </div>
        ) : (
          categories.map(cat => (
            <div key={cat} style={{ marginBottom: "4rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "2rem" }}>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text)", fontSize: "1.05rem", fontWeight: 700, whiteSpace: "nowrap" }}>{cat}</h3>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              </div>

              <div style={{ display: "grid", gap: "1.75rem" }}>
                {TOP_PROJECTS.filter(p => p.category === cat).map(p => (
                  <div key={p.id} className="card card-hover" style={{ padding: "2.5rem", position: "relative", overflow: "hidden" }}>
                    {/* Ambient glow */}
                    <div style={{ position: "absolute", right: -80, top: -80, width: 260, height: 260, borderRadius: "50%", background: `radial-gradient(circle, ${p.accent}18 0%, transparent 70%)`, pointerEvents: "none" }} />

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
                      <span className="chip chip-accent" style={{ background: `${p.accent}12`, color: p.accent, borderColor: `${p.accent}30` }}>{p.badge}</span>
                      <div className="project-links">
                        {p.github  && <a href={p.github}  target="_blank" rel="noopener noreferrer" className="btn-icon"><Github size={17} /> Source</a>}
                        {p.apiDocs && <a href={p.apiDocs} target="_blank" rel="noopener noreferrer" className="btn-icon"><Server size={17} /> API Docs</a>}
                        {p.live    && <a href={p.live}    target="_blank" rel="noopener noreferrer" className="btn-icon" style={{ color: p.accent }}><Activity size={17} /> Live Demo</a>}
                      </div>
                    </div>

                    <h3 className="font-display" style={{ fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: "1.1rem" }}>
                      {p.title}
                    </h3>

                    <div className="project-problem">
                      <p className="body-text" style={{ fontSize: "0.93rem" }}>
                        <strong style={{ color: "var(--text)" }}>The Problem: </strong>{p.problem}
                      </p>
                    </div>

                    <p className="body-text" style={{ marginBottom: "1.5rem" }}>{p.desc}</p>

                    {p.bullets && (
                      <ul className="project-bullets">
                        {p.bullets.map(b => (
                          <li key={b} className="project-bullet">
                            <CheckCircle size={17} color={p.accent} /> {b}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="tech-wrap">
                      {p.tech.map(t => <span key={t} className="chip" style={{ background: "rgba(255,255,255,0.55)" }}>{t}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </FadeSection>
  );
}

/* ─────────────────────────────────────────
   RESEARCH
───────────────────────────────────────── */
function Research() {
  if (!RESEARCH.length) return null;
  return (
    <FadeSection id="research" style={{ padding: "var(--section-y) 0" }}>
      <div className="container">
        <p className="label">Academia</p>
        <h2 className="heading">Research Papers</h2>

        <div style={{ display: "grid", gap: "1.5rem", marginTop: "2.5rem" }}>
          {RESEARCH.map(r => (
            <div key={r.id} className="card card-hover research-card">
              <div className="research-header">
                <div className="research-meta">
                  <BookOpen size={18} color="#10B981" />
                  <span className="research-meta-label">Academic Publication</span>
                </div>
                <span className="chip chip-status">{r.status}</span>
              </div>
              <p className="research-title">{r.title}</p>
              <p className="body-text">{r.abstract}</p>
              <div className="tech-wrap">
                {r.topics.map(t => <span key={t} className="chip">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </FadeSection>
  );
}

/* ─────────────────────────────────────────
   LEADERSHIP
───────────────────────────────────────── */
function Leadership() {
  return (
    <FadeSection id="leadership" style={{ padding: "var(--section-y) 0" }}>
      <div className="container">
        <p className="label">Discipline</p>
        <h2 className="heading">Beyond the Code</h2>
        <p className="body-text" style={{ marginBottom: "2.75rem", maxWidth: 500 }}>
          Execution, discipline, and leadership developed both inside and outside the lab.
        </p>

        <div className="leadership-grid">
          {LEADERSHIP.map(c => (
            <div key={c.id} className="card card-hover leadership-card">
              <div className="leadership-header">
                <div className="leadership-icon" style={{ background: `${c.iconColor}14` }}>
                  {c.isMedal ? <Award size={24} color={c.iconColor} /> : <Star size={24} color={c.iconColor} />}
                </div>
                <div>
                  <p className="leadership-title">{c.title}</p>
                  <p className="leadership-sub">{c.subtitle}</p>
                </div>
              </div>

              <p className="body-text" style={{ fontSize: "0.93rem", marginBottom: "1.75rem", flexGrow: 1 }}>{c.desc}</p>

              {c.isMedal ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {c.items.map(m => (
                    <div key={m.title} className="medal-row">
                      <div>
                        <p className="medal-title">{m.title}</p>
                        <p className="medal-sub">{m.tournament}</p>
                      </div>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "0.88rem", color: m.color }}>
                        {m.emoji} {m.medal}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                  {c.items.map(a => (
                    <li key={a.text} className="bullet-row">
                      <ArrowRight size={15} color={c.iconColor} style={{ flexShrink: 0, marginTop: 2 }} />
                      {a.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </FadeSection>
  );
}

/* ─────────────────────────────────────────
   CONTACT
───────────────────────────────────────── */
function Contact({ copyEmail }) {
  return (
    <FadeSection id="hireme" style={{ padding: "var(--section-y) 0" }}>
      <div className="container">
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <p className="label">Hire Me</p>
          <h2 className="heading" style={{ fontSize: "clamp(2.2rem,5vw,3.8rem)" }}>Let's Build Together</h2>
          <p className="body-text" style={{ maxWidth: 480, margin: "0 auto 2.75rem", fontSize: "1.05rem" }}>
            My inbox is always open. Whether you have a robust project, a fractional retainer opportunity, or just want to connect - I'll reply within 24 hours.
          </p>

          <div className="card contact-card">
            <div className="contact-glow" />
            <div className="contact-icon-wrap">
              <Mail size={36} color="#10B981" />
            </div>
            <p className="contact-email">{PERSONAL.email}</p>

            <div style={{ display: "flex", justifyContent: "center", gap: "0.85rem", flexWrap: "wrap", margin: "2rem 0" }}>
              <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${PERSONAL.email}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                <Mail size={19} /> Open Gmail
              </a>
              <button onClick={copyEmail} className="btn btn-ghost btn-lg">
                <Copy size={19} /> Copy Email
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              {[{ href: PERSONAL.linkedin, Icon: Linkedin, label: "LinkedIn" }, { href: PERSONAL.github, Icon: Github, label: "GitHub" }, { href: PERSONAL.fiverr, Icon: Fiverr, label: "Fiverr" }].map(({ href, Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                  <Icon size={15} /> {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FadeSection>
  );
}

/* ─────────────────────────────────────────
   FOOTER
───────────────────────────────────────── */
function Footer() {
  return (
    <footer className="footer">
      <p className="footer-name">{PERSONAL.shortName}</p>
      <p className="footer-copy">© 2026 {PERSONAL.name} · {PERSONAL.title}</p>
      <div className="footer-icons">
        {[{ href: PERSONAL.linkedin, Icon: Linkedin }, { href: PERSONAL.github, Icon: Github }, { href: PERSONAL.fiverr, Icon: Fiverr }].map(({ href, Icon }, i) => (
          <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="footer-icon-link"><Icon size={19} /></a>
        ))}
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────
   FULL PROJECT LIBRARY PAGE
───────────────────────────────────────── */
function Library() {
  const [filter, setFilter] = useState("all");
  const [results, setResults] = useState(OTHER_PROJECTS);

  useEffect(() => {
    let list = OTHER_PROJECTS;
    if (filter !== "all") list = list.filter(p => p.key === filter);
    setResults(list);
  }, [filter]);

  return (
    <div style={{ minHeight: "100vh", paddingTop: "calc(var(--nav-h) + 3rem)", paddingBottom: "5rem" }}>
      <div className="container lib-header" style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <FadeSection id="library-header">
          <p className="label">Archive</p>
          <h1 className="heading" style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}>Project Library</h1>
          <p className="body-text" style={{ marginTop: "0.5rem", marginBottom: "2.5rem", maxWidth: 560 }}>
            Browse the full archive of scripts, dashboards, and integrations.
          </p>

          <div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap", marginBottom: "3rem" }}>
            {FILTERS.map(f => (
              <button key={f.key}
                className={`filter-pill ${filter === f.key ? "filter-pill-active" : "filter-pill-inactive"}`}
                onClick={() => setFilter(f.key)}>{f.label}</button>
            ))}
          </div>

          {results.length > 0 ? (
            <div className="lib-grid">
              {results.map(p => (
                <div key={p.id} className="card card-hover lib-card" style={{ padding: "2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.75rem" }}>
                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.25rem", fontWeight: 800, color: "var(--text)", margin: 0, lineHeight: 1.3, letterSpacing: "-0.01em" }}>
                      {p.title}
                    </h3>
                    <div style={{ display: "flex", gap: "0.65rem", flexShrink: 0, marginTop: "0.2rem" }}>
                      {p.github  && <a href={p.github}  target="_blank" rel="noopener noreferrer" className="btn-icon"><Github size={18} /></a>}
                      {p.apiDocs && <a href={p.apiDocs} target="_blank" rel="noopener noreferrer" className="btn-icon"><Server size={18} /></a>}
                      {p.live    && <a href={p.live}    target="_blank" rel="noopener noreferrer" className="btn-icon" style={{ color: "#10B981" }}><Activity size={18} /></a>}
                    </div>
                  </div>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <span style={{ display: "inline-block", padding: "0.35rem 0.75rem", background: "rgba(16,185,129,0.08)", color: "#059669", borderRadius: "6px", fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.02em" }}>
                      {p.category}
                    </span>
                  </div>

                  <p className="body-text" style={{ fontSize: "0.92rem", marginBottom: "2rem", flexGrow: 1, lineHeight: 1.65 }}>{p.desc}</p>

                  <div className="tech-wrap" style={{ paddingTop: "1.25rem", borderTop: "1px dashed rgba(212,212,212,0.8)", gap: "0.5rem" }}>
                    {p.tech.map(t => <span key={t} className="chip" style={{ background: "rgba(255,255,255,0.7)", fontSize: "0.72rem", padding: "0.25rem 0.7rem", border: "1px solid rgba(212,212,212,0.5)" }}>{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Database size={42} color="#C0C0C0" />
              <h3>No results found</h3>
              <p className="body-text">Try selecting a different category.</p>
              <button className="btn btn-ghost" style={{ marginTop: "1.25rem" }}
                onClick={() => setFilter("all")}>Clear Filter</button>
            </div>
          )}
        </FadeSection>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ROOT APP
───────────────────────────────────────── */
export default function App() {
  const [view, setView] = useState("home");
  const [toastKey, setToastKey] = useState(0);
  const scrollPos = useRef(0);

  /* Browser history navigation */
  useEffect(() => {
    if (!window.history.state) window.history.replaceState({ view: "home" }, "", window.location.pathname);
    const onPop = (e) => {
      if (e.state?.view === "library") { setView("library"); window.scrollTo(0, 0); }
      else { setView("home"); setTimeout(() => window.scrollTo({ top: scrollPos.current, behavior: "instant" }), 0); }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const toLibrary = () => {
    scrollPos.current = window.scrollY;
    window.history.pushState({ view: "library" }, "", "#library");
    setView("library"); window.scrollTo(0, 0);
  };

  const toHome = () => {
    if (window.history.state?.view === "library") { window.history.back(); return; }
    window.history.pushState({ view: "home" }, "", window.location.pathname);
    setView("home");
    setTimeout(() => window.scrollTo({ top: scrollPos.current, behavior: "instant" }), 0);
  };

  const copyEmail = (e) => {
    if (e) e.preventDefault();
    navigator.clipboard.writeText(PERSONAL.email);
    setToastKey(k => k + 1);
  };

  return (
    <div style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <style>{CSS}</style>

      {view === "home" && <ScrollTracker />}

      <div className="main-offset">
        <Nav view={view} toHome={toHome} toLibrary={toLibrary} />

        {view === "home" ? (
          <>
            <Hero     copyEmail={copyEmail} toLibrary={toLibrary} />
            <About />
            <Services />
            <TopProjects toLibrary={toLibrary} />
            <Research />
            <Leadership />
            <Contact  copyEmail={copyEmail} />
          </>
        ) : (
          <Library />
        )}
      </div>

      <Footer />

      <div className="toast-host">
        {toastKey > 0 && <Toast key={toastKey} />}
      </div>
    </div>
  );
}