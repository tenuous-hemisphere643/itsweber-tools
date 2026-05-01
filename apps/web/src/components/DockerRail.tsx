import type { Language } from "../lib/copy";

export function DockerRail({ language }: { language: Language }) {
  return (
    <aside className="docker-rail" aria-label="Docker deployment">
      <span className="rail-status">docker-ready</span>
      <code>ghcr.io/itsweber-official/itsweber-tools:latest</code>
      <dl>
        <div>
          <dt>Port</dt>
          <dd>8080:80</dd>
        </div>
        <div>
          <dt>Image</dt>
          <dd>nginx static</dd>
        </div>
        <div>
          <dt>{language === "de" ? "Datenbank" : "Database"}</dt>
          <dd>{language === "de" ? "keine" : "none"}</dd>
        </div>
      </dl>
    </aside>
  );
}
