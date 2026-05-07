import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, Terminal } from "lucide-react";

const CMD = "farcho@portfolio:~$ view_identity --identity ./profile.jpg";

export default function ImageLightbox({ src, alt, isOpen, onClose }) {
  const [typed, setTyped] = useState("");
  const [booted, setBooted] = useState(false);
  const overlayRef = useRef(null);
  const closeBtnRef = useRef(null);
  const bootTimeoutRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setTyped("");
      setBooted(false);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTyped(CMD.slice(0, i));
      if (i >= CMD.length) {
        clearInterval(interval);
        bootTimeoutRef.current = setTimeout(() => setBooted(true), 600);
      }
    }, 35);

    return () => {
      clearInterval(interval);
      if (bootTimeoutRef.current) clearTimeout(bootTimeoutRef.current);
    };
  }, [isOpen]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    closeBtnRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Profile image"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#05070E]/95 backdrop-blur-sm p-4"
      onClick={onClose}
      onKeyDown={(e) => { if (e.key === "Tab") e.preventDefault(); }}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-cyan-400/30 bg-[#0a0d1a] shadow-[0_0_80px_rgba(34,211,238,0.12)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal title bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-cyan-400/20 bg-[#05070E]">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <Terminal className="w-4 h-4 text-cyan-400 ml-2" />
            <span className="font-mono text-xs text-slate-500">
              farcho@portfolio:~/view_identity — bash
            </span>
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/10 hover:border-red-400/40 hover:text-red-300 text-slate-400 flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Typing command */}
          <div className="font-mono text-sm text-slate-400 min-h-[1.5em]">
            <span>{typed}</span>
            {!booted && (
              <span className="inline-block w-2 h-4 bg-cyan-400 ml-0.5 animate-pulse" />
            )}
          </div>

          {/* Loading bar */}
          {!booted && typed.length === CMD.length && (
            <div className="space-y-2 mt-3 mb-2">
              <div className="text-xs font-mono text-slate-500">
                > decrypting identity...
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse"
                  style={{ width: "60%" }}
                />
              </div>
            </div>
          )}

          {/* Revealed image */}
          <div
            className={`transition-all duration-700 ${
              booted ? "opacity-100 scale-100" : "opacity-0 scale-95 max-h-0 overflow-hidden"
            }`}
          >
            {booted && (
              <>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400/80 mt-3 mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Identity verified — {alt}
                </div>
                <div className="rounded-xl overflow-hidden border border-cyan-400/10 bg-black/30">
                  <img
                    src={src}
                    alt={alt}
                    className="w-full h-auto max-h-[65vh] object-contain scanline-reveal"
                  />
                </div>
                <div className="mt-3 text-xs font-mono text-slate-600 text-center">
                  [ Press ESC to close ]
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
