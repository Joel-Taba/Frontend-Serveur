"use client";

import type { EcosystemTool } from "@/lib/tools";
import { ToolIcon, ExternalLinkIcon, ClockIcon } from "./catalogueIcons";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ToolCard({ tool }: { tool: EcosystemTool }) {
  const { t } = useLanguage();
  const pending = tool.status === "en-developpement";

  const body = (
    <>
      <span className="tool-card-icon">
        <ToolIcon />
      </span>
      <span className="tool-card-body">
        <span className="tool-card-title">{tool.name}</span>
        <span className="tool-card-description">{tool.description}</span>
      </span>
      <span className={`tool-card-status${pending ? " is-pending" : ""}`}>
        {pending ? (
          <>
            <ClockIcon /> {t.catalogue.toolInDevelopment}
          </>
        ) : (
          <>
            {t.catalogue.toolOpen} <ExternalLinkIcon />
          </>
        )}
      </span>
    </>
  );

  if (tool.href) {
    return (
      <a className="tool-card" href={tool.href} target="_blank" rel="noopener noreferrer">
        {body}
      </a>
    );
  }

  return <div className="tool-card tool-card-disabled">{body}</div>;
}
