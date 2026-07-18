"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export interface SceneTab {
  id: string;
  label: string;
  content: ReactNode;
}

export function SceneTabs({
  ariaLabel,
  defaultTabId,
  tabs,
}: {
  ariaLabel: string;
  defaultTabId?: string;
  tabs: SceneTab[];
}) {
  const [activeId, setActiveId] = useState(
    tabs.some(({ id }) => id === defaultTabId) ? defaultTabId ?? "" : tabs[0]?.id ?? "",
  );
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function selectByKeyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const lastIndex = tabs.length - 1;
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? lastIndex
        : event.key === "ArrowRight"
          ? index === lastIndex ? 0 : index + 1
          : index === 0 ? lastIndex : index - 1;
    const nextTab = tabs[nextIndex];
    if (!nextTab) return;
    setActiveId(nextTab.id);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div className="scene-tabs">
      <div className="scene-tab-list" role="tablist" aria-label={ariaLabel}>
        {tabs.map((tab, index) => {
          const selected = tab.id === activeId;
          return (
            <button
              aria-controls={`${tab.id}-panel`}
              aria-selected={selected}
              className="scene-tab"
              id={`${tab.id}-tab`}
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              onKeyDown={(event) => selectByKeyboard(event, index)}
              ref={(element) => { tabRefs.current[index] = element; }}
              role="tab"
              tabIndex={selected ? 0 : -1}
              type="button"
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => (
        <section
          aria-labelledby={`${tab.id}-tab`}
          className="scene-tab-panel"
          hidden={tab.id !== activeId}
          id={`${tab.id}-panel`}
          key={tab.id}
          role="tabpanel"
          tabIndex={0}
        >
          {tab.content}
        </section>
      ))}
    </div>
  );
}
