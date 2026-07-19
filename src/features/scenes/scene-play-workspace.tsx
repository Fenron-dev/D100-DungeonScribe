"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

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
  referencePanel,
  referencePanelLabel,
  journalPanelLabel,
  resizeLabel,
}: {
  journal: ReactNode;
  composer: ReactNode;
  tools: SceneTool[];
  toolLabel: string;
  closeLabel: string;
  referencePanel: ReactNode;
  referencePanelLabel: string;
  journalPanelLabel: string;
  resizeLabel: string;
}) {
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [journalSize, setJournalSize] = useState(72);
  const [referenceVisible, setReferenceVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const workspaceBodyRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const activeTool = tools.find(({ id }) => id === activeToolId) ?? null;
  const workspaceStyle: CSSProperties = {
    gridTemplateColumns: `minmax(0, ${journalSize}fr) 0.45rem minmax(18rem, ${100 - journalSize}fr)`,
  };

  useEffect(() => {
    if (activeTool) closeButtonRef.current?.focus();
  }, [activeTool]);

  useEffect(() => {
    const stopDragging = () => {
      draggingRef.current = false;
    };
    const resize = (event: PointerEvent) => {
      if (!draggingRef.current || !workspaceBodyRef.current) return;
      const bounds = workspaceBodyRef.current.getBoundingClientRect();
      const percentage = ((event.clientX - bounds.left) / bounds.width) * 100;
      setJournalSize(Math.min(82, Math.max(48, Math.round(percentage))));
    };
    window.addEventListener("pointermove", resize);
    window.addEventListener("pointerup", stopDragging);
    return () => {
      window.removeEventListener("pointermove", resize);
      window.removeEventListener("pointerup", stopDragging);
    };
  }, []);

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
        <button
          aria-pressed={referenceVisible}
          className="scene-tool-button scene-mobile-reference-toggle"
          onClick={() => setReferenceVisible((visible) => !visible)}
          type="button"
        >
          {referenceVisible ? journalPanelLabel : referencePanelLabel}
        </button>
      </div>
      <div
        className={`scene-workspace-body ${referenceVisible ? "show-reference" : "show-journal"}`}
        ref={workspaceBodyRef}
        style={workspaceStyle}
      >
        <div className="scene-journal-frame scene-journal-pane">{journal}</div>
        <div
          aria-label={resizeLabel}
          aria-orientation="vertical"
          aria-valuemax={82}
          aria-valuemin={48}
          aria-valuenow={journalSize}
          className="scene-pane-resizer"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") setJournalSize((size) => Math.max(48, size - 2));
            if (event.key === "ArrowRight") setJournalSize((size) => Math.min(82, size + 2));
            if (event.key === "Home") setJournalSize(48);
            if (event.key === "End") setJournalSize(82);
          }}
          onPointerDown={(event) => {
            draggingRef.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          role="separator"
          tabIndex={0}
        />
        <aside aria-label={referencePanelLabel} className="scene-reference-pane">
          {referencePanel}
        </aside>
      </div>
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
