"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { MapPin } from "lucide-react";

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const PARTICLE_COUNT = 60;
    const MAX_DIST = 140;

    type Particle = {
      x: number; y: number;
      vx: number; vy: number;
      r: number;
    };

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    }));

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(245, 166, 35, ${0.15 * (1 - dist / MAX_DIST)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(245, 166, 35, 0.4)";
        ctx.fill();
      });
    }

    function update() {
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });
    }

    function loop() {
      update();
      draw();
      animId = requestAnimationFrame(loop);
    }

    loop();

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
    />
  );
}

function FloatingShapes() {
  const shapes = [
    { size: 320, x: "75%", y: "-10%", delay: 0,   duration: 8  },
    { size: 180, x: "85%", y: "40%",  delay: 1.5, duration: 10 },
    { size: 100, x: "60%", y: "70%",  delay: 0.8, duration: 12 },
    { size: 60,  x: "20%", y: "80%",  delay: 2,   duration: 9  },
  ];

  return (
    <>
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gold/5 pointer-events-none"
          style={{ width: s.size, height: s.size, left: s.x, top: s.y }}
          animate={{ y: [0, -24, 0], scale: [1, 1.04, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const contentY  = useTransform(scrollY, [0, 400], [0, -60]);
  const particleY = useTransform(scrollY, [0, 400], [0, -30]);
  const shapesY   = useTransform(scrollY, [0, 400], [0, -90]);

  const stats = [
    { value: 10, suffix: "+", label: "Years of service" },
    { value: 3,  suffix: "",  label: "Service categories" },
    { value: 50, suffix: "+", label: "Clients served" },
  ];

  return (
    <section
      ref={containerRef}
      className="bg-navy relative overflow-hidden min-h-[90vh] flex flex-col justify-between"
    >
      <motion.div className="absolute inset-0" style={{ y: particleY }}>
        <ParticleCanvas />
      </motion.div>

      <motion.div className="absolute inset-0" style={{ y: shapesY }}>
        <FloatingShapes />
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gold/30 to-transparent" />

      <motion.div
        className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 flex-1 flex flex-col justify-center"
        style={{ y: contentY }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold text-xs px-4 py-1.5 rounded-full mb-6 w-fit"
        >
          <MapPin size={12} />
          Port Moresby, Papua New Guinea
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5 max-w-2xl"
        >
          Moving PNG{" "}
          <span className="text-gold">Forward</span>,{" "}
          <br className="hidden md:block" />
          One Service at a Time
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-white/60 text-base md:text-lg leading-relaxed mb-8 max-w-xl"
        >
          Reliable bus services, waste management, and heavy equipment
          solutions for Port Moresby and beyond. Built for PNG, committed
          to our community.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/services"
            className="bg-gold text-navy font-bold text-sm px-8 py-3.5 rounded hover:bg-gold-dark transition-colors duration-200 text-center"
          >
            Our Services
          </Link>
          <Link
            href="/contact"
            className="border border-white/30 text-white font-medium text-sm px-8 py-3.5 rounded hover:bg-white/10 transition-colors duration-200 text-center"
          >
            Contact Us
          </Link>
        </motion.div>
      </motion.div>

      <div className="relative border-t border-white/10 bg-navy/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.15 }}
                className="py-6 px-4 text-center"
              >
                <p className="text-white font-bold text-2xl md:text-3xl">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-white/40 text-xs mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}