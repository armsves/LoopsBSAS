"use client";

import { motion } from "framer-motion";
import { ChevronDown, Plus } from "lucide-react";
import GithubIcon from "./icons/Github";

export function GitHubRepoView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-xl p-6"
      style={{
        backgroundColor: "#1F1F23",
        border: "1px solid var(--border)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1"
            style={{
              backgroundColor: "#2A2A2E",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
            }}
          >
            main
            <ChevronDown className="w-3 h-3" />
          </button>
          <button className="p-1 rounded-md hover:bg-gray-700 transition-colors"
            style={{ color: "var(--foreground)" }}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <button className="px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1"
          style={{
            backgroundColor: "#2A2A2E",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          }}
        >
          &lt;&gt; Code
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Commit info */}
      <div className="flex items-center gap-2 mb-4 text-sm"
        style={{ color: "var(--secondary)" }}
      >
        <span className="truncate">gladiator439rimsk...</span>
        <span>162 commits</span>
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      </div>

      {/* File structure */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm py-1"
          style={{ color: "var(--foreground)" }}
        >
          <span className="w-4 h-4 flex items-center justify-center">📁</span>
          <span>.github</span>
          <span className="ml-auto text-xs" style={{ color: "var(--secondary)" }}>last month</span>
        </div>
        <div className="flex items-center gap-2 text-sm py-1"
          style={{ color: "var(--foreground)" }}
        >
          <span className="w-4 h-4 flex items-center justify-center">📁</span>
          <span>networks</span>
          <span className="ml-auto text-xs" style={{ color: "var(--secondary)" }}>2 weeks ago</span>
        </div>
        <div className="flex items-center gap-2 text-sm py-1"
          style={{ color: "var(--foreground)" }}
        >
          <span className="w-4 h-4 flex items-center justify-center">📁</span>
          <span>providers</span>
          <span className="ml-auto text-xs" style={{ color: "var(--secondary)" }}>4 months ago</span>
        </div>
      </div>

      {/* Bottom icons */}
      <div className="flex items-center gap-3 mt-6 pt-4 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="w-6 h-6 rounded border flex items-center justify-center"
          style={{ borderColor: "var(--border)" }}
        >
          <span className="text-xs">◆</span>
        </div>
        <div className="w-6 h-6 rounded border flex items-center justify-center"
          style={{ borderColor: "var(--border)" }}
        >
          <span className="text-xs">⭕</span>
        </div>
        <div className="w-6 h-6 rounded border flex items-center justify-center"
          style={{ borderColor: "var(--border)" }}
        >
          <span className="text-xs">ƒ</span>
        </div>
        <div className="w-6 h-6 rounded border flex items-center justify-center"
          style={{ borderColor: "var(--border)" }}
        >
          <span className="text-xs">▲</span>
        </div>
      </div>
    </motion.div>
  );
}

