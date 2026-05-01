import { categories, tools } from "@itsweber/toolkit";
import type { Language } from "../lib/copy";

interface AboutPageProps {
  language: Language;
  readyCount: number;
}

export function AboutPage({ language, readyCount }: AboutPageProps) {
  const de = language === "de";
  const totalTools = tools.length;

  return (
    <div className="about-v2">
      {/* HERO */}
      <section className="about-hero-v2">
        <div className="about-hero-content">
          <span className="about-eyebrow">· itsweber · tools · phase-3 · {de ? "über" : "about"}</span>
          <h1>
            {de ? (
              <>It&rsquo;s Weber<br /><em>Tools.</em></>
            ) : (
              <>It&rsquo;s Weber<br /><em>Tools.</em></>
            )}
          </h1>
          <p className="about-lede">
            {de
              ? "Eine schnelle, self-hosted IT Workbench für Docker, Unraid und den Alltag in Infrastruktur-Projekten. Lokal, leicht, kein Login."
              : "A fast self-hosted IT workbench for Docker, Unraid, and daily infrastructure work. Local, lightweight, no login."}
          </p>
          <div className="about-links">
            <a href="https://github.com/itsweber-official/itsweber-tools" className="about-link" target="_blank" rel="noopener noreferrer">
              <span>↗</span> GitHub
            </a>
            <a href="/manifest.itsweber-tools.json" className="about-link">
              <span>↗</span> CMS Manifest
            </a>
          </div>
        </div>

        <div className="about-stat-block">
          <div className="about-stat">
            <span className="about-stat-num">{readyCount}</span>
            <span className="about-stat-label">{de ? "Tools bereit" : "tools ready"}</span>
          </div>
          <div className="about-stat">
            <span className="about-stat-num">{categories.length}</span>
            <span className="about-stat-label">{de ? "Kategorien" : "categories"}</span>
          </div>
          <div className="about-stat">
            <span className="about-stat-num">{totalTools}</span>
            <span className="about-stat-label">{de ? "Tools geplant" : "tools planned"}</span>
          </div>
          <div className="about-stat">
            <span className="about-stat-num">0</span>
            <span className="about-stat-label">{de ? "Server-Roundtrips" : "server roundtrips"}</span>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <div className="about-sect-h">
        <span className="about-sect-num">· 01</span>
        <h2>{de ? <>Kern<em>prinzipien.</em></> : <>Core<em> principles.</em></>}</h2>
      </div>

      <section className="about-pillars">
        <article className="pillar-card">
          <span className="pillar-num">01</span>
          <h3>{de ? "Docker zuerst" : "Docker first"}</h3>
          <p>{de
            ? "Statisches nginx-Image, Port 8080, kein DB-Overhead. Ein einziges docker run-Kommando."
            : "Static nginx image, port 8080, no database overhead. A single docker run command."}</p>
          <div className="pillar-code">
            <code>docker run -p 8080:80 itsweber/tools</code>
          </div>
        </article>

        <article className="pillar-card">
          <span className="pillar-num">02</span>
          <h3>{de ? "Privacy by default" : "Privacy by default"}</h3>
          <p>{de
            ? "0 Telemetrie, 0 Cookies, 0 Server-Roundtrips. Alle Tools laufen im Browser via Web APIs."
            : "0 telemetry, 0 cookies, 0 server roundtrips. All tools run in the browser via Web APIs."}</p>
          <div className="pillar-trust">
            <span className="pillar-trust-badge">⬡ local · only</span>
            <span className="pillar-trust-sub">{de ? "Web Crypto API · localStorage" : "Web Crypto API · localStorage"}</span>
          </div>
        </article>

        <article className="pillar-card">
          <span className="pillar-num">03</span>
          <h3>{de ? "Operator-First" : "Operator-first"}</h3>
          <p>{de
            ? "Docker, Nginx, .htaccess, Unraid — was andere Toolkits ignorieren. Gebaut für Infrastructure Engineers."
            : "Docker, Nginx, .htaccess, Unraid — what other toolkits ignore. Built for infrastructure engineers."}</p>
        </article>

        <article className="pillar-card">
          <span className="pillar-num">04</span>
          <h3>{de ? "Kein Login" : "No login"}</h3>
          <p>{de
            ? "Favoriten, History, Theme, Sprache — alles in localStorage. Keine Accounts, keine Clouds."
            : "Favorites, history, theme, language — all in localStorage. No accounts, no clouds."}</p>
        </article>
      </section>

      {/* ROADMAP */}
      <div className="about-sect-h">
        <span className="about-sect-num">· 02</span>
        <h2>{de ? <>Road<em>map.</em></> : <>Road<em>map.</em></>}</h2>
        <span className="about-sect-meta">↘ {de ? "phasenplan" : "phase plan"}</span>
      </div>

      <section className="about-roadmap">
        {[
          { phase: "Phase 1", label: de ? "Fundament" : "Foundation", status: "done", desc: de ? "Toolkit, Build, Monorepo, 20+ Tools" : "Toolkit, build, monorepo, 20+ tools" },
          { phase: "Phase 2", label: de ? "Erweiterung" : "Expansion", status: "done", desc: de ? "Weitere Kategorien, Crypto, Network, Ops" : "More categories, Crypto, Network, Ops" },
          { phase: "Phase 3", label: "UI v2",                          status: "active", desc: de ? "Discovery Hub, Workbench v2, Settings, Design-System" : "Discovery Hub, Workbench v2, Settings, design system" },
          { phase: "Phase 4", label: de ? "Pipes" : "Pipes",           status: "planned", desc: de ? "Tool-Verkettung, Pipe-Editor, History, Templates" : "Tool chaining, pipe editor, history, templates" },
          { phase: "Phase 5", label: de ? "Release" : "Release",       status: "planned", desc: de ? "Unraid Live-Test, Docker Hub, itsweber.de Product Page" : "Unraid live test, Docker Hub, itsweber.de product page" },
        ].map((row) => (
          <div key={row.phase} className={`roadmap-row ${row.status}`}>
            <span className="roadmap-phase">{row.phase}</span>
            <span className="roadmap-label">{row.label}</span>
            <span className="roadmap-desc">{row.desc}</span>
            <span className="roadmap-status">{row.status}</span>
          </div>
        ))}
      </section>

      {/* TECH STACK */}
      <div className="about-sect-h">
        <span className="about-sect-num">· 03</span>
        <h2>{de ? <>Tech<em>stack.</em></> : <>Tech<em>stack.</em></>}</h2>
      </div>

      <section className="about-stack">
        {[
          ["React 19", de ? "UI-Framework" : "UI framework"],
          ["TypeScript", de ? "Typsicherheit" : "Type safety"],
          ["Vite", de ? "Build-Tool" : "Build tool"],
          ["pnpm workspaces", de ? "Monorepo" : "Monorepo"],
          ["@itsweber/toolkit", de ? "Tool-Registry" : "Tool registry"],
          ["@itsweber/ui", de ? "Themes & Token" : "Themes & tokens"],
          ["Geist / Geist Mono", de ? "Typografie" : "Typography"],
          ["Web Crypto API", de ? "Krypto-Tools" : "Crypto tools"],
        ].map(([tech, role]) => (
          <div key={tech} className="stack-row">
            <span className="stack-tech">{tech}</span>
            <span className="stack-role">{role}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
