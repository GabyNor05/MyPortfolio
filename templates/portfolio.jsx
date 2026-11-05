import React, { useState, useEffect, useRef } from 'react';

// Example Initial Project Seeding Array mapped from your system logic
const INITIAL_PROJECTS = [
  {
    id: "proj-001",
    title: "ForageScan",
    type: "UX Design",
    solution: "Mobile App",
    year: 2025,
    logo: "forageScan",
    thumbnail: "/images/project1.jpg",
    scenario: "Module brief",
    tagline: "Empowering safe foraging through technology.",
    shortDescription: "A mobile app that helps users identify edible mushrooms and avoid toxic lookalikes.",
    fullDescription: "Forage Scan is a mobile app that uses image-recognition to help users identify edible mushrooms and avoid toxic lookalikes, addressing the risk of poisoning. It includes a community submission feature for expert review of unidentified species, promoting citizen science. Offline functionality allows access to identification tools in remote areas, and an in-app journal enables users to document their findings.",
    actions: [
      { label: "Figma Prototype", icon: "figma", url: "https://www.figma.com" },
      { label: "Behance Case Study", icon: "behance", url: "https://behance.net" }
    ],
    technologies: ["Figma", "User Research", "Prototyping"],
    collaborators: [{ name: "Alex Jones", url: "" }],
    reflection: "Demonstrated how design can bridge safety, education, and community."
  }
];

export default function Portfolio() {
  // ── STATE VARIABLES ──
  const [theme, setTheme] = useState('dark');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [ringPos, setRingPos] = useState({ x: 0, y: 0 });
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // ── HOOKS & PERFORMANCE EFFECTS ──
  useEffect(() => {
    // Sync theme configuration down to the document element for daisyUI
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
      setIsScrolled(window.scrollY > 20);
      setShowBackToTop(window.scrollY > 400);
    };

    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Soft easing delay calculations for the animated structural outer cursor ring
  useEffect(() => {
    let animationFrameId;
    const easeRing = () => {
      setRingPos((prev) => {
        const dx = cursorPos.x - prev.x;
        const dy = cursorPos.y - prev.y;
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15,
        };
      });
      animationFrameId = requestAnimationFrame(easeRing);
    };
    animationFrameId = requestAnimationFrame(easeRing);
    return () => cancelAnimationFrame(animationFrameId);
  }, [cursorPos]);

  // Project Filtering Logic
  const filteredProjects = activeFilter === 'all' 
    ? INITIAL_PROJECTS 
    : INITIAL_PROJECTS.filter(p => p.type.toLowerCase().includes(activeFilter));

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <div className="font-body min-h-screen text-base-content bg-base-100 transition-colors duration-500 ease-out-smooth select-text selection:bg-primary selection:text-white">
      
      {/* ── CUSTOM MOUSE CURSORS ── */}
      <div 
        className="fixed w-2 h-2 bg-primary rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-[width,height,opacity] duration-200 mix-blend-screen hidden md:block"
        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px`, width: isHovering ? '0px' : '8px', height: isHovering ? '0px' : '8px' }}
      />
      <div 
        className="fixed border-[1.5px] border-primary rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 opacity-50 transition-[width,height,opacity] duration-300 ease-out-smooth hidden md:block"
        style={{ 
          left: `${ringPos.x}px`, 
          top: `${ringPos.y}px`, 
          width: isHovering ? '54px' : '36px', 
          height: isHovering ? '54px' : '36px',
          opacity: isHovering ? 0.2 : 0.5
        }}
      />

      {/* ── DIGITAL GRAIN & NOISE LAYER ── */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.04] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />

      {/* ── TOP SCROLL PROGRESS INDICATOR BAR ── */}
      <div 
        className="fixed top-0 left-0 h-[2px] z-[200] bg-gradient-to-r from-primary via-secondary to-[#ba9fe1] transition-[width] duration-75 ease-linear shadow-[0_0_6px_var(--glow)]"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ── BACK TO TOP CONTROL TRIGGER ── */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 z-90 w-11 h-11 border-[0.5px] border-[var(--border-mid)] bg-base-300 flex items-center justify-center text-neutral cursor-pointer shadow-lg transition-all duration-300 ease-spring ${showBackToTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'} hover:bg-primary hover:text-white hover:-translate-y-1`}
        aria-label="Back to top"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </button>

      {/* ── STICKY NAVIGATION BAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-10 h-15 border-bottom border-[0.5px] border-[var(--border)] backdrop-blur-[18px] transition-all duration-500 ${isScrolled ? 'bg-base-100/60 shadow-xl' : 'bg-base-100/30'}`}>
        <div className="font-display text-xl font-light tracking-wide">
          gaby <span className="text-primary italic font-normal">norris</span>
        </div>
        
        <div className="hidden sm:flex gap-8">
          {['projects', 'about', 'contact'].map((section) => (
            <a 
              key={section}
              href={`#${section}`} 
              className="text-[13px] font-normal text-neutral tracking-wider relative transition-colors duration-200 hover:text-base-content group"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
              <span className="absolute bottom-[-2px] left-0 window-w-0 h-[1px] bg-primary w-0 group-hover:w-100 class transition-all duration-300 ease-out-smooth" />
            </a>
          ))}
        </div>

        <button 
          onClick={toggleTheme}
          className="theme-toggle flex items-center gap-[6px] bg-base-300 border-[0.5px] border-[var(--border-mid)] rounded-pill px-[14px] py-[5px] text-[12px] font-body text-neutral cursor-pointer transition-all duration-250 hover:bg-[var(--bg-hover)] hover:text-base-content"
          aria-label="Toggle structural canvas theme"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {theme === 'dark' ? (
            <>
              <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
              </svg>
              <span>Light mode</span>
            </>
          ) : (
            <>
              <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              <span>Dark mode</span>
            </>
          )}
        </button>
      </nav>

      <main className="relative z-10">
        
        {/* ── HERO HERO HERO ── */}
        <section id="hero" className="min-h-screen flex flex-col justify-center px-6 md:px-10 max-w-[1100px] mx-auto pt-24 relative overflow-hidden">
          {/* Ambient Blurred Vector Background Orbs */}
          <div className="absolute w-[600px] h-[600px] top-[5%] -left-[150px] rounded-full blur-[90px] pointer-events-none bg-gradient-radial from-[rgba(95,91,175,0.28)] to-transparent animate-[orbFloat1_12s_ease-in-out_infinite]" />
          <div className="absolute w-[400px] h-[400px] bottom-[15%] -right-[80px] rounded-full blur-[90px] pointer-events-none bg-gradient-radial from-[rgba(86,141,228,0.20)] to-transparent animate-[orbFloat2_9s_ease-in-out_infinite]" />
          
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-16 items-center relative z-10">
            <div className="max-w-[580px] space-y-4">
              <p className="text-[14px] text-neutral tracking-wider animate-[slideUp_0.7s_0.2s_cubic-bezier(0.22,1,0.36,1)_forwards]">Hello, I'm</p>
              <h1 className="font-display text-[clamp(3.5rem,8vw,6rem)] font-light leading-none animate-[slideUp_0.8s_0.35s_cubic-bezier(0.22,1,0.36,1)_forwards]">
                Gaby<br /><em className="text-primary italic font-normal">Norris</em>
              </h1>
              <p className="font-display text-[1.4rem] font-light text-neutral italic animate-[slideUp_0.8s_0.5s_cubic-bezier(0.22,1,0.36,1)_forwards]">
                Interactive Developer &amp; UX Designer
              </p>
              <p className="text-[15px] text-neutral leading-relaxed max-w-[480px] animate-[slideUp_0.8s_0.65s_cubic-bezier(0.22,1,0.36,1)_forwards]">
                Second-year student at Open Window Institute, crafting digital experiences that live at the intersection of code and design. I build things that feel as intentional as they look.
              </p>
              
              <div className="flex gap-3 flex-wrap pt-4 animate-[slideUp_0.8s_0.8s_cubic-bezier(0.22,1,0.36,1)_forwards]">
                <a href="https://github.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-[10px] rounded-pill text-[13px] font-medium bg-primary text-white transition-all duration-250 hover:scale-[1.02] hover:shadow-[0_8px_24px_var(--glow)]" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                  GitHub
                </a>
                <a href="#projects" className="inline-flex items-center gap-2 px-5 py-[10px] rounded-pill text-[13px] font-medium border-[0.5px] border-[var(--border-mid)] text-neutral transition-all duration-250 hover:bg-base-300 hover:text-base-content hover:scale-[1.02]" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                  View Work
                </a>
              </div>
            </div>

            {/* Avatar Cluster Area Frame */}
            <div className="relative w-[220px] h-[220px] mx-auto md:mx-0 animate-[avatarIn_1s_0.5s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
              <div className="absolute inset-[-12px] rounded-full animate-spin bg-gradient-to-r from-primary via-secondary to-primary [mask-image:radial-gradient(farthest-side,transparent_calc(100%-1.5px),#fff_calc(100%-1.5px))]" style={{ animationDuration: '8s' }} />
              <div className="w-[220px] h-[220px] rounded-full bg-base-300 flex items-center justify-center font-display text-[5rem] font-light text-primary overflow-hidden relative z-10">
                GN
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral text-[11px] tracking-widest uppercase">
            <span>Scroll</span>
            <div className="w-[1px] h-[50px] bg-gradient-to-b from-primary to-transparent animate-[scrollPulse_2s_ease-in-out_infinite]" />
          </div>
        </section>

        <hr className="border-t-[0.5px] border-[var(--border)] max-w-[1100px] mx-auto" />

        {/* ── PROJECTS GRID SECTION ── */}
        <section id="projects" className="py-24 px-6 md:px-10 max-w-[1100px] mx-auto">
          <div className="text-[11px] font-medium tracking-widest uppercase text-primary mb-4">Selected Work</div>
          <h2 className="font-display text-[clamp(2.5rem,5vw,3.8rem)] font-light leading-tight mb-2">Case <em className="text-primary italic font-normal">Studies</em></h2>
          <p className="text-[14px] text-neutral mb-10">Exploring standard web solutions, mobile workflows, and interactive tool designs.</p>

          <div className="flex flex-wrap items-center gap-2 mb-10">
            {['all', 'ux design', 'development'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-[6px] rounded-pill text-[12px] font-medium transition-all duration-250 ${activeFilter === filter ? 'bg-primary text-white shadow-md' : 'bg-transparent text-neutral border-[0.5px] border-[var(--border-mid)] hover:text-base-content hover:bg-base-300'}`}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {filter.toUpperCase()}
              </button>
            ))}
            <div className="text-[11px] text-neutral ml-auto py-[6px] hidden sm:block">
              Showing {filteredProjects.length} projects
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProject(p)}
                className="group bg-base-200 border-[0.5px] border-[var(--border)] rounded-lg overflow-hidden cursor-pointer flex flex-col transition-all duration-350 ease-spring hover:-translate-y-[6px] hover:scale-[1.01] hover:border-[var(--border-mid)] hover:shadow-2xl"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div className="h-40 bg-gradient-to-br from-[#101d30] to-[#1a2d50] flex items-center justify-center text-4xl relative overflow-hidden transition-transform duration-400 group-hover:scale-[1.04]">
                  🚀
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-base-200" />
                </div>
                
                <div className="p-5 flex-1 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-medium tracking-wide uppercase px-[10px] py-[3px] rounded-pill bg-primary/20 text-[#90bbf0]">
                      {p.type}
                    </span>
                    <span className="text-[11px] text-neutral">{p.year}</span>
                  </div>
                  <h3 className="font-display text-[1.35rem] font-normal leading-tight group-hover:text-primary transition-colors">{p.title}</h3>
                  <p className="text-[12px] text-neutral italic">{p.solution}</p>
                  <p className="text-[13px] text-neutral/80 leading-relaxed flex-1">{p.shortDescription}</p>
                  
                  <div className="flex justify-between items-center mt-4 pt-2 border-t-[0.5px] border-[var(--border)]">
                    <span className="text-[12px] font-medium text-primary flex items-center gap-1 group-hover:gap-[9px] transition-all">
                      View Case Study &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-t-[0.5px] border-[var(--border)] max-w-[1100px] mx-auto" />

        {/* ── ABOUT MATRIX SECTION ── */}
        <section id="about" className="py-24 px-6 md:px-10 max-w-[1100px] mx-auto">
          <div className="text-[11px] font-medium tracking-widest uppercase text-primary mb-4">Background Context</div>
          <h2 className="font-display text-[clamp(2.5rem,5vw,3.8rem)] font-light leading-tight mb-10">About <em className="text-primary italic font-normal">Myself</em></h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <div className="bg-base-200 border-[0.5px] border-[var(--border)] rounded-lg p-7 transition-all hover:border-[var(--border-mid)] md:col-span-2">
              <h3 className="font-display text-xl mb-2">My Philosophy</h3>
              <p className="text-[14px] text-neutral leading-relaxed">I sit natively between the technical parameters of programmatic building and clean layout composition rules. I believe interface logic should work dynamically without compromising aesthetic restraint.</p>
            </div>
            <div className="bg-base-200 border-[0.5px] border-[var(--border)] rounded-lg p-7 transition-all hover:border-[var(--border-mid)]">
              <h3 className="font-display text-xl mb-2">UX/UI Tracking</h3>
              <p className="text-[14px] text-neutral leading-relaxed">Creating systematic wireframe maps, managing detailed research constraints, and assembling prototypes built directly on verified user data models.</p>
            </div>
            <div className="bg-base-200 border-[0.5px] border-[var(--border)] rounded-lg p-7 transition-all hover:border-[var(--border-mid)]">
              <h3 className="font-display text-xl mb-2">Interactive Code</h3>
              <p className="text-[14px] text-neutral leading-relaxed">Writing valid layouts across custom front-end frameworks, ensuring asset optimization scales dynamically across device dimensions.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-xl mb-4">Technical Stack</h3>
            <div className="flex flex-wrap gap-2">
              {["React", "Node.js", "Tailwind CSS", "Mongoose", "MongoDB", "Figma", "UI Design", "User Testing", "Prototyping"].map((tech) => (
                <span key={tech} className="px-[14px] py-[6px] rounded-pill text-[12px] font-medium bg-base-300 border-[0.5px] border-[var(--border)] text-neutral hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 hover:-translate-y-[2px]">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        <hr className="border-t-[0.5px] border-[var(--border)] max-w-[1100px] mx-auto" />

        {/* ── CONTACT GRID FORM SECTION ── */}
        <section id="contact" className="py-24 px-6 md:px-10 max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-12 items-start">
            <div>
              <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-light leading-none mb-4">
                Let's <br /><em className="text-primary italic font-normal">Connect</em>
              </h2>
              <p className="text-[14px] text-neutral leading-relaxed">
                Have a project concept or structural challenge you want to map out together? Fill out the details, and let's structure something pristine.
              </p>
            </div>

            <form onSubmit={handleContactSubmit} className="flex flex-col gap-[14px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium tracking-wider uppercase text-neutral">Your Name</label>
                  <input type="text" required placeholder="John Doe" className="bg-base-200 border-[0.5px] border-[var(--border-mid)] rounded-md p-[10px] text-[14px] text-base-content outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium tracking-wider uppercase text-neutral">Email Address</label>
                  <input type="email" required placeholder="john@example.com" className="bg-base-200 border-[0.5px] border-[var(--border-mid)] rounded-md p-[10px] text-[14px] text-base-content outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium tracking-wider uppercase text-neutral">Message</label>
                <textarea required placeholder="Outline your requirements..." className="h-[110px] bg-base-200 border-[0.5px] border-[var(--border-mid)] rounded-md p-[10px] text-[14px] text-base-content outline-none resize-none focus:border-primary focus:ring-1 focus:ring-primary/20" />
              </div>

              <button type="submit" className="px-7 py-3 rounded-pill text-[14px] font-medium bg-primary text-white flex items-center gap-2 self-start transition-all duration-250 hover:brightness-110 hover:-translate-y-0.5 hover:shadow-lg" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                Send Message &rarr;
              </button>

              {formSubmitted && (
                <div className="bg-primary/10 border-[0.5px] border-[var(--border-mid)] rounded-md p-[14px] text-[13px] text-primary animate-fade-in">
                  ✓ Connection requested successfully. Talk soon!
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="text-center p-12 border-t-[0.5px] border-[var(--border)] text-[12px] text-neutral relative z-10">
        &copy; {new Date().getFullYear()} Gaby Norris. Crafted with <span className="text-primary">React &amp; Tailwind</span>.
      </footer>

      {/* ── METADATA DYNAMIC MODAL BOX OVERLAY ── */}
      {selectedProject && (
        <div 
          onClick={() => setSelectedProject(null)}
          className="fixed inset-0 z-[200] bg-[#0a0814]/88 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-350"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-base-200 border-[0.5px] border-[var(--border-mid)] rounded-lg w-100 max-w-[680px] max-h-[88vh] overflow-y-auto transform scale-100 transition-transform duration-400 ease-spring p-7 relative"
          >
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-md border-[0.5px] border-white/10 rounded-pill px-[14px] py-[5px] text-[12px] text-white/70 cursor-pointer hover:bg-black/60 hover:text-white transition-colors"
            >
              Close (Esc)
            </button>

            <div className="mt-4">
              <h2 className="font-display text-[2.2rem] font-normal text-base-content leading-none mb-2">{selectedProject.title}</h2>
              
              <div className="flex gap-2 flex-wrap items-center mb-5">
                <span className="text-[11px] uppercase tracking-wider text-primary font-medium">{selectedProject.type}</span>
                <span className="text-neutral text-xs">•</span>
                <span className="text-neutral text-xs">{selectedProject.year}</span>
              </div>

              <div className="text-[11px] font-medium tracking-widest uppercase text-primary mt-5 mb-1.5">Project Scope</div>
              <p className="text-[14px] text-neutral leading-relaxed">{selectedProject.fullDescription}</p>

              <div className="text-[11px] font-medium tracking-widest uppercase text-primary mt-5 mb-1.5">Core Insights</div>
              <p className="text-[14px] text-neutral italic leading-relaxed">{selectedProject.reflection}</p>

              <div className="text-[11px] font-medium tracking-widest uppercase text-primary mt-5 mb-2">Technologies Mapped</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.technologies.map(t => (
                  <span key={t} className="text-[12px] px-3 py-1 rounded-pill bg-base-300 border-[0.5px] border-[var(--border)] text-neutral">{t}</span>
                ))}
              </div>

              <div className="flex gap-2 mt-6 pt-4 border-t-[0.5px] border-[var(--border)]">
                {selectedProject.actions.map(a => (
                  <a key={a.label} href={a.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-pill text-[13px] bg-primary text-white hover:brightness-110 transition-all">
                    {a.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}