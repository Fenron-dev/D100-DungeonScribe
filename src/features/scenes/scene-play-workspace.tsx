"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export interface SceneTool {
  id: string;
  label: string;
  content: ReactNode;
  danger?: boolean;
}

export function ScenePlayWorkspace({
  journal,
  composer,
  tools,
  toolLabel,
  closeLabel,
}: {
  journal: ReactNode;
  composer: ReactNode;
  tools: SceneTool[];
  toolLabel: string;
  closeLabel: string;
}) {
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const activeTool = tools.find(({ id }) => id === activeToolId) ?? null;

  useEffect(() => {
    if (activeTool) closeButtonRef.current?.focus();
  }, [activeTool]);

  return (
    <section className="scene-play-workspace">
      <div className="scene-tool-row" aria-label={toolLabel}>
        {tools.map((tool) => (
          <button
            className={`scene-tool-button ${tool.danger ? "scene-tool-danger" : ""}`}
            key={tool.id}
            onClick={() => setActiveToolId(tool.id)}
            type="button"
          >
            {tool.label}
          </button>
        ))}
      </div>
      <div className="scene-journal-frame">{journal}</div>
      <div className="scene-composer-frame">{composer}</div>
      {activeTool ? (
        <div
          className="scene-tool-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setActiveToolId(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setActiveToolId(null);
          }}
          role="presentation"
        >
          <section
            aria-labelledby={`scene-tool-${activeTool.id}-title`}
            aria-modal="true"
            className="scene-tool-dialog"
            role="dialog"
          >
            <header>
              <h2 id={`scene-tool-${activeTool.id}-title`}>{activeTool.label}</h2>
              <button
                aria-label={closeLabel}
                className="scene-tool-close"
                onClick={() => setActiveToolId(null)}
                ref={closeButtonRef}
                type="button"
              >
                ×
              </button>
            </header>
            <div className="scene-tool-dialog-content">{activeTool.content}</div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
