"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";

export default function CookieNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "true");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-50"
        >
          <div className="glass-premium p-6 rounded-[2rem] border border-white/10 shadow-2xl shadow-black/50 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent -z-10" />
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-500 shrink-0">
                <Cookie size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white mb-1">Privacidade & Cookies</h4>
                <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                  Utilizamos cookies e tecnologias de rastreamento para melhorar sua experiência e entender como você interage com o portfólio.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={accept}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-xl transition-all active:scale-95"
                  >
                    Aceitar tudo
                  </button>
                  <button
                    onClick={() => setShow(false)}
                    className="p-2.5 bg-white/5 hover:bg-white/10 text-neutral-400 rounded-xl transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
