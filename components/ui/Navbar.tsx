"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ThemeToggle } from "./ThemeToggle";
import { SettingsModal } from "./SettingsModal";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeftRight, PlusCircle, Settings as SettingsIcon, GitFork, Server, Network } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="flex items-center justify-between px-6 py-4 border-b relative"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--background)"
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 z-10"
        >
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5" style={{ color: "#FF6A00" }} />
              <h1 className="text-lg font-bold">
                ContribHub
              </h1>
            </motion.div>
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4 flex-shrink-0 z-10"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/contribute">
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
                style={{
                  backgroundColor: "#FF6A00",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#FF7A10";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FF6A00";
                }}
              >
                Get started
              </button>
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-lg transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
              style={{
                backgroundColor: "transparent",
                color: "var(--foreground)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--muted)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              aria-label="Open settings"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ConnectButton showBalance={false} chainStatus="icon" />
          </motion.div>
        </motion.div>
        
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </motion.nav>
      
      {/* Bottom Navigation Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-center gap-2 px-6 py-3 border-b flex-wrap"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--background)"
        }}
      >
        {/* Tool Contribution Section */}
        <Link href="/contribute">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg transition-all text-sm flex items-center gap-1 cursor-pointer font-semibold ${
              pathname === "/contribute" || pathname === "/contribute/process" || pathname === "/contribute/table"
                ? "shadow-lg"
                : ""
            }`}
            style={{
              backgroundColor: pathname === "/contribute" || pathname === "/contribute/process" || pathname === "/contribute/table" ? "#FF6A00" : "transparent",
              color: pathname === "/contribute" || pathname === "/contribute/process" || pathname === "/contribute/table" ? "white" : "var(--foreground)",
            }}
            onMouseEnter={(e) => {
              if (!pathname.startsWith("/contribute")) {
                e.currentTarget.style.backgroundColor = "var(--muted)";
              }
            }}
            onMouseLeave={(e) => {
              if (!pathname.startsWith("/contribute")) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            <PlusCircle className="w-4 h-4" />
            Contribute Tools
          </motion.div>
        </Link>
        
        <Link href="/manage-storage">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg transition-all text-sm cursor-pointer inline-block font-semibold ${
              pathname === "/manage-storage"
                ? "shadow-lg"
                : ""
            }`}
            style={{
              backgroundColor: pathname === "/manage-storage" ? "#FF6A00" : "transparent",
              color: pathname === "/manage-storage" ? "white" : "var(--foreground)",
            }}
            onMouseEnter={(e) => {
              if (pathname !== "/manage-storage") {
                e.currentTarget.style.backgroundColor = "var(--muted)";
              }
            }}
            onMouseLeave={(e) => {
              if (pathname !== "/manage-storage") {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            Storage
          </motion.div>
        </Link>
        
        {/* Divider */}
        <div className="h-6 w-px mx-2" style={{ backgroundColor: "var(--border)" }} />
        
        {/* RPC Management Section */}
        <Link href="/fork-pr">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg transition-all text-sm flex items-center gap-1 cursor-pointer font-semibold ${
              pathname === "/fork-pr"
                ? "shadow-lg"
                : ""
            }`}
            style={{
              backgroundColor: pathname === "/fork-pr" ? "#FF6A00" : "transparent",
              color: pathname === "/fork-pr" ? "white" : "var(--foreground)",
            }}
            onMouseEnter={(e) => {
              if (pathname !== "/fork-pr") {
                e.currentTarget.style.backgroundColor = "var(--muted)";
              }
            }}
            onMouseLeave={(e) => {
              if (pathname !== "/fork-pr") {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            <GitFork className="w-4 h-4" />
            Fork & PR
          </motion.div>
        </Link>
        
        <Link href="/add-rpc">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg transition-all text-sm flex items-center gap-1 cursor-pointer font-semibold ${
              pathname === "/add-rpc"
                ? "shadow-lg"
                : ""
            }`}
            style={{
              backgroundColor: pathname === "/add-rpc" ? "#FF6A00" : "transparent",
              color: pathname === "/add-rpc" ? "white" : "var(--foreground)",
            }}
            onMouseEnter={(e) => {
              if (pathname !== "/add-rpc") {
                e.currentTarget.style.backgroundColor = "var(--muted)";
              }
            }}
            onMouseLeave={(e) => {
              if (pathname !== "/add-rpc") {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            <Server className="w-4 h-4" />
            Add RPC
          </motion.div>
        </Link>
        
        <Link href="/rpc">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg transition-all text-sm flex items-center gap-1 cursor-pointer font-semibold ${
              pathname === "/rpc"
                ? "shadow-lg"
                : ""
            }`}
            style={{
              backgroundColor: pathname === "/rpc" ? "#FF6A00" : "transparent",
              color: pathname === "/rpc" ? "white" : "var(--foreground)",
            }}
            onMouseEnter={(e) => {
              if (pathname !== "/rpc") {
                e.currentTarget.style.backgroundColor = "var(--muted)";
              }
            }}
            onMouseLeave={(e) => {
              if (pathname !== "/rpc") {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            <Network className="w-4 h-4" />
            Browse RPCs
          </motion.div>
        </Link>
      </motion.div>
    </>
  );
}
