"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mengecek apakah splash screen sudah pernah ditampilkan di sesi ini
    const splashShown = sessionStorage.getItem("splashShown");
    
    if (!splashShown) {
      setIsVisible(true);
      
      // Animasi masuk (isMounted) dengan sedikit delay agar transisi masuk terlihat mulus
      setTimeout(() => setIsMounted(true), 50);
      
      // Mulai proses memudar (fade out) setelah 2 detik
      const fadeOutTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 2000);

      // Hilangkan komponen dari DOM sepenuhnya setelah 2.7 detik
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        sessionStorage.setItem("splashShown", "true");
      }, 2700);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(hideTimer);
      };
    }
  }, []);

  // Jika tidak perlu ditampilkan (karena sudah pernah muncul), abaikan render
  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center bg-gradient-to-br from-pink-400 to-rose-500 transition-opacity duration-700 ease-in-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Aesthetic Decorators */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-white/20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 rounded-full bg-white/20 blur-2xl"></div>

      {/* Main Content (Logo & Text) */}
      <div className={`relative flex flex-col items-center transition-all duration-1000 ease-out transform ${
        !isMounted ? "scale-90 opacity-0 translate-y-4" : 
        isFadingOut ? "scale-110 opacity-0 blur-sm translate-y-0" : "scale-100 opacity-100 translate-y-0"
      }`}>
        <div className="w-28 h-28 mb-6 rounded-[2rem] bg-white shadow-2xl flex items-center justify-center p-3 shadow-pink-900/20 relative overflow-hidden">
          <Image 
            src="/favicon.png" 
            alt="Dompetku Logo" 
            width={96} 
            height={96} 
            className="rounded-[1.5rem]"
            priority
          />
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
          Dompetku
        </h1>
        <div className="w-12 h-1 bg-white/30 rounded-full my-4"></div>
        <p className="text-pink-50 font-medium tracking-wide">
          Pencatatan Keuangan Pintar
        </p>
      </div>
    </div>
  );
}
