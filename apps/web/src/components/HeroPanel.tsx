import { categories } from "@itsweber/toolkit";
import type { Language } from "../lib/copy";
import { DockerRail } from "./DockerRail";
import { Metric } from "./Metric";

interface HeroPanelProps {
  language: Language;
  readyLabel: string;
  readyCount: number;
}

export function HeroPanel({ language, readyLabel, readyCount }: HeroPanelProps) {
  return (
    <section className="hero-panel">
      <div>
        <p className="eyebrow">
          {language === "de" ? "Container-ready IT Workbench" : "Container-ready IT workbench"}
        </p>
        <h1>It&rsquo;s Weber Tools</h1>
        <p>
          {language === "de"
            ? "Container-ready IT Workbench für Konvertierung, Netzwerk, Web, Docker und Datenarbeit. Lokal im Browser, sauber verpackt für Docker und Unraid."
            : "Container-ready IT workbench for conversion, network, web, Docker, and data tasks. Local in the browser, neatly packaged for Docker and Unraid."}
        </p>
      </div>
      <div className="hero-metrics" aria-label="Tool status">
        <Metric label={readyLabel} value={readyCount} />
        <Metric label={language === "de" ? "Kategorien" : "Categories"} value={categories.length} />
        <Metric label="Themes" value="3x3" />
      </div>
      <DockerRail language={language} />
    </section>
  );
}
