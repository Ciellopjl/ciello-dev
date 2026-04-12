"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/constants/routes";
import { DEVELOPER_INFO } from "@/constants/developer";
import { Menu, X, Github } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Bloquear scroll quando menu estiver aberto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4",
        isScrolled ? "bg-background/80 backdrop-blur-xl border-b border-white/5 py-3" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.a
          href="#home"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-black tracking-tighter text-gradient group flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full border-2 border-red-500/20 overflow-hidden bg-neutral-900 flex-shrink-0 group-hover:border-red-500/50 transition-colors">
            <img 
              src={DEVELOPER_INFO.profileImage} 
              alt={DEVELOPER_INFO.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image doesn't exist yet
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${DEVELOPER_INFO.name}&background=EF4444&color=fff`;
              }}
            />
          </div>
          <span>
            {DEVELOPER_INFO.name.split(" ")[0]}
            <span className="text-foreground group-hover:text-red-500 transition-colors">.</span>
          </span>
        </motion.a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.name}
            </motion.a>
          ))}
          <motion.a
            href="#contact"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-4 py-2 bg-foreground text-background rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Contratar
          </motion.a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu — Side Drawer (70% Width) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Clickable Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Side Drawer Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-0 right-0 bottom-0 w-[70%] z-[70] bg-[#0a0a0a] border-l border-white/5 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
            >
              {/* Background Profile Blur — Decorative */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10 overflow-hidden">
                 <img 
                   src={DEVELOPER_INFO.profileImage} 
                   alt="" 
                   className="w-full h-full object-cover scale-150 grayscale"
                 />
              </div>

              {/* Top Bar inside menu */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-red-500/20 overflow-hidden">
                      <img src={DEVELOPER_INFO.profileImage} alt={DEVELOPER_INFO.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-lg font-black">{DEVELOPER_INFO.name.split(" ")[0]}<span className="text-red-500">.</span></span>
                 </div>
                 <button 
                   onClick={() => setMobileMenuOpen(false)}
                   className="p-2 rounded-xl bg-white/5 border border-white/10"
                 >
                   <X size={20} />
                 </button>
              </div>

              {/* Menu Links Content */}
              <div className="flex-1 flex flex-col justify-center px-8">
                <div className="space-y-2">
                  {NAV_LINKS.map((link, i) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.2 }}
                    >
                      <a
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="group flex items-center gap-3 text-3xl font-black text-neutral-500 hover:text-white transition-all py-3"
                      >
                        <span className="text-[10px] font-bold text-red-600/50 group-hover:text-red-500 transition-colors uppercase tracking-[0.2em] w-6">
                          0{i + 1}
                        </span>
                        {link.name}
                      </a>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Action */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-10"
                >
                  <a 
                    href="#contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-4 bg-red-600 text-white rounded-xl flex items-center justify-center font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-red-600/10 active:scale-95 transition-all text-center"
                  >
                    Vamos Conversar?
                  </a>
                </motion.div>
              </div>

              {/* Footer socials */}
              <div className="p-6 border-t border-white/5 bg-black/20 flex flex-col gap-4">
                 <div className="flex gap-5">
                    {DEVELOPER_INFO.github && (
                      <a href={DEVELOPER_INFO.github} target="_blank" className="text-neutral-500 hover:text-red-500 transition-colors">
                        <Github size={18}/>
                      </a>
                    )}
                    {DEVELOPER_INFO.instagram && (
                      <a href={DEVELOPER_INFO.instagram} target="_blank" className="text-neutral-500 hover:text-red-500 transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                      </a>
                    )}
                 </div>
                 <span className="text-[9px] font-bold text-neutral-700 uppercase tracking-widest">© 2026 Ciello Victor</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </nav>
  );
}
