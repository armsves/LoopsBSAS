"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ThemeToggle } from "./ThemeToggle";
import { SettingsModal } from "./SettingsModal";
import { motion } from "framer-motion";
import { Heart, Github, ChevronUp, ChevronDown, X, ArrowRight, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import GithubIcon from "./icons/Github";

export function Navbar() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const pathname = usePathname();

  return (
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
            <Heart className="w-5 h-5" style={{ color: "#22c55e", fill: "#22c55e" }} />
            <h1 className="text-lg font-bold">
              CHAIN.LOVE
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
        <Link href="https://github.com/FIL-Builders/fs-upload-dapp" target="_blank">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-sm cursor-pointer hover:opacity-70 transition-opacity"
          >
            github
          </motion.div>
        </Link>
        
        <div className="flex items-center gap-1 text-sm">
          <span>1/2</span>
          <div className="flex flex-col">
            <ChevronUp className="w-3 h-3" />
            <ChevronDown className="w-3 h-3 -mt-1" />
          </div>
        </div>
        
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <X className="w-4 h-4 cursor-pointer hover:opacity-70 transition-opacity" />
        </motion.div>
        
        <Link href="/contribute">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-sm cursor-pointer hover:opacity-70 transition-opacity"
          >
            itepaper
          </motion.div>
        </Link>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href="/">
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
  );
}
