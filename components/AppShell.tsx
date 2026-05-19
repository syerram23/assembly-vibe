"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { ClaudeCodeTerminal } from "./ClaudeCodeTerminal";

/*
 * Client wrapper holding the Claude Code terminal open/closed state.
 * The terminal is a persistent right-side panel — toggled from AppHeader
 * or via ⌘J / Ctrl+J anywhere in the app.
 */

export function AppShell({ children }: { children: ReactNode }) {
  const [terminalOpen, setTerminalOpen] = useState(false);

  const toggle = useCallback(() => setTerminalOpen((v) => !v), []);
  const close = useCallback(() => setTerminalOpen(false), []);

  // Keyboard shortcut: Cmd/Ctrl + J toggles terminal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return (
    <div className="appshell">
      <AppSidebar />
      <div className={"appshell-main " + (terminalOpen ? "with-terminal" : "")}>
        <AppHeader terminalOpen={terminalOpen} onToggleTerminal={toggle} />
        <main className="appshell-page">{children}</main>
      </div>
      <ClaudeCodeTerminal open={terminalOpen} onClose={close} />

      <style>{`
        .appshell {
          display: flex;
          min-height: 100vh;
          background: #fff;
        }
        .appshell-main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          transition: margin-right 0.28s cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .appshell-main.with-terminal {
          margin-right: 460px;
        }
        .appshell-page {
          flex: 1;
          padding: 36px 40px 96px;
          max-width: 1280px;
          width: 100%;
          margin-inline: auto;
        }
        @media (max-width: 1280px) {
          .appshell-main.with-terminal { margin-right: 0; }
        }
        @media (max-width: 980px) {
          .appshell { flex-direction: column; }
          .appshell-page { padding: 24px 24px 80px; }
        }
      `}</style>
    </div>
  );
}
