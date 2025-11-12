"use client";
import { motion } from "framer-motion";
import Confetti from "@/components/ui/Confetti";
import { useConfetti } from "@/hooks/useConfetti";
import { useRouter } from "next/navigation";
import { Sparkles, Zap, Shield, Gift, Database, Bot, CheckCircle, ArrowRight } from "lucide-react";

// Animation variants for hero page
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

/**
 * ContribHub Hero Page
 * A user-friendly platform to contribute tools to the repo with AI analysis, IPFS storage, and cross-chain rewards
 */
export default function Home() {
  const { showConfetti } = useConfetti();
  const router = useRouter();

  const features = [
    {
      icon: <Database className="w-6 h-6" />,
      title: "IPFS Storage",
      description: "All contributions stored on decentralized IPFS for permanent, verifiable records",
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: "AI Analysis",
      description: "Automated quality checks and validation before merging contributions",
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: "Cross-Chain Rewards",
      description: "Choose your preferred network (Base, Avalanche, Arbitrum) for rewards",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Transparent Process",
      description: "Track every contribution from submission to merge with full transparency",
    },
  ];

  return (
    <div className="w-full flex flex-col min-h-screen" style={{ backgroundColor: "var(--background)" }}>
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
      
      {/* Hero Section */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6 py-16"
      >
        {/* Main Hero Content */}
        <div className="max-w-5xl w-full text-center mb-16">
          <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                backgroundColor: "#FF6A00",
                color: "white",
              }}
            >
              The easiest way to contribute Web3 tools with AI-powered validation and cross-chain rewards
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent"
          >
            ContribHub
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-2xl md:text-3xl font-semibold mb-4"
            style={{ color: "var(--foreground)" }}
          >
            Contribute Tools. Get Rewarded. Build Together.
          </motion.p>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto"
            style={{ color: "var(--secondary)", lineHeight: "1.8" }}
          >
            A user-friendly platform where developers contribute Web3 tools to an open-source repository. 
            Every contribution is stored on IPFS, analyzed by AI, and rewarded with cross-chain payments 
            on your preferred network. See past contributions, track your impact, and grow the Web3 ecosystem.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <motion.button
              onClick={() => router.push("/contribute")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg font-semibold text-lg text-white flex items-center gap-2 transition-all shadow-lg"
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
              <Sparkles className="w-5 h-5" />
              Start Contributing
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={() => router.push("/contribute/table")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg font-semibold text-lg transition-all border-2 flex items-center gap-2"
              style={{
                borderColor: "#FF6A00",
                color: "#FF6A00",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#FF6A0010";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              View Contributions
            </motion.button>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full mb-16"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg"
                  style={{
                    backgroundColor: "#FF6A0020",
                    color: "#FF6A00",
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                  {feature.title}
                </h3>
              </div>
              <p className="text-sm" style={{ color: "var(--secondary)", lineHeight: "1.6" }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          variants={itemVariants}
          className="max-w-4xl w-full"
        >
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: "var(--foreground)" }}>
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Submit Tool",
                description: "Fill out a simple form with tool details and upload to Filecoin storage",
                icon: <Zap className="w-8 h-8" />,
              },
              {
                step: "2",
                title: "AI Analysis",
                description: "Our AI agent validates quality, checks requirements, and scores your contribution",
                icon: <Bot className="w-8 h-8" />,
              },
              {
                step: "3",
                title: "Get Rewarded",
                description: "Receive cross-chain rewards on your preferred network when contribution is merged",
                icon: <Gift className="w-8 h-8" />,
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="relative rounded-xl p-6 border text-center"
                style={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white"
                  style={{
                    backgroundColor: "#FF6A00",
                  }}
                >
                  {item.step}
                </div>
                <div className="flex justify-center mb-4 mt-4"
                  style={{ color: "#FF6A00" }}
                >
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
                  {item.title}
                </h3>
                <p className="text-sm" style={{ color: "var(--secondary)", lineHeight: "1.6" }}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          variants={itemVariants}
          className="max-w-4xl w-full mt-16"
        >
          <div className="rounded-xl p-8 border"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--foreground)" }}>
              Why ContribHub?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "All contributions permanently stored on IPFS",
                "AI-powered quality validation",
                "Choose your reward network (Base, Avalanche, Arbitrum)",
                "Transparent contribution history",
                "Easy-to-use interface",
                "Cross-chain reward system",
              ].map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + idx * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#22c55e" }} />
                  <span style={{ color: "var(--foreground)" }}>{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}
