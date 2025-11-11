"use client";
import { motion } from "framer-motion";
import Confetti from "@/components/ui/Confetti";
import { useConfetti } from "@/hooks/useConfetti";
import Github from "@/components/ui/icons/Github";
import { GitHubRepoView } from "@/components/ui/GitHubRepoView";
import { MonitoringGraph } from "@/components/ui/MonitoringGraph";

// Animation variants for smooth tab transitions using Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "smooth",
    },
  },
};

/**
 * Root page component - Web3 services database homepage
 * Shows information about the open source DB for Web3 services
 */
export default function Home() {
  const { showConfetti } = useConfetti();

  return (
    <div className="w-full flex flex-col min-h-fit" style={{ backgroundColor: "var(--background)" }}>
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            pointerEvents: "none",
          }}
        />
      )}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full mx-auto px-6 py-8 max-w-7xl"
      >
        {/* Top Section - Two Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Left - Description Panel */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl p-8"
            style={{
              backgroundColor: "#1F1F23",
              border: "1px solid var(--border)",
            }}
          >
            <h2 className="text-2xl font-bold mb-4">
              The open source DB for Web3 services
            </h2>
            <p className="text-base mb-6" style={{ color: "var(--secondary)", lineHeight: "1.6" }}>
              A community-driven database of Web3 services - including RPCs, wallets, explorers, bridges, oracles, dev tools and more. Explore, compare and contribute to help other developers stop wasting time on searching for the right service.
            </p>
            <motion.a
              href="https://github.com/FIL-Builders/fs-upload-dapp"
              target="_blank"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                className="px-6 py-3 rounded-lg font-medium text-white flex items-center gap-2 transition-all"
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
                <Github />
                Explore on GitHub
              </button>
            </motion.a>
          </motion.div>

          {/* Top Right - GitHub Repository View */}
          <GitHubRepoView />
        </div>

        {/* Bottom Section - Two Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bottom Left - Monitoring Graph */}
          <MonitoringGraph />

          {/* Bottom Right - Load Balancing Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl p-6"
            style={{
              backgroundColor: "#1F1F23",
              border: "1px solid var(--border)",
            }}
          >
            <h3 className="text-lg font-bold mb-4">
              Automated load balancing with performance monitoring
            </h3>
            <p className="text-sm" style={{ color: "var(--secondary)", lineHeight: "1.6" }}>
              Ensure your app stays fast and reliable with automated load balancing across multiple RPC providers. Monitor latency and performance metrics in real-time to optimize your Web3 infrastructure.
            </p>
          </motion.div>
        </div>

      </motion.main>
    </div>
  );
}
