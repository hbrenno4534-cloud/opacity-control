import { useState, useEffect } from "react";

interface VaultDoorProps {
  isOpen: boolean;
  onAnimationComplete: () => void;
}

export default function VaultDoor({ isOpen, onAnimationComplete }: VaultDoorProps) {
  const [phase, setPhase] = useState<"idle" | "spinning" | "opening" | "done">("idle");

  useEffect(() => {
    if (isOpen && phase === "idle") {
      setPhase("spinning");
      const t1 = setTimeout(() => setPhase("opening"), 1200);
      const t2 = setTimeout(() => {
        setPhase("done");
        onAnimationComplete();
      }, 2400);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [isOpen, phase, onAnimationComplete]);

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      {/* Radial red glow */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(circle at center, hsl(358 85% 48% / 0.08), transparent 60%)",
      }} />

      <div className={`relative ${phase === "opening" ? "vault-open" : ""}`} style={{ perspective: "800px" }}>
        {/* Vault door circle */}
        <div
          className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full border-2 border-primary/30 ${
            phase === "spinning" ? "vault-spin" : ""
          }`}
          style={{
            background: "linear-gradient(135deg, hsl(0 3% 22%), hsl(0 3% 12%), hsl(0 3% 17%))",
            boxShadow: "0 0 60px hsl(358 85% 48% / 0.25), inset 0 0 40px hsl(0 0% 0% / 0.6)",
          }}
        >
          {/* Shine overlay */}
          <div className="absolute inset-0 rounded-full" style={{
            background: "linear-gradient(135deg, hsl(358 60% 50% / 0.12), transparent 50%, hsl(358 60% 50% / 0.04))",
          }} />

          {/* Center bolt */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-primary/40"
              style={{
                background: "radial-gradient(circle, hsl(0 3% 25%), hsl(0 3% 13%))",
                boxShadow: "0 0 25px hsl(358 85% 48% / 0.35)",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-primary/60" />
              </div>
            </div>
          </div>

          {/* Spokes */}
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <div
              key={deg}
              className="absolute top-1/2 left-1/2 h-0.5 bg-primary/15"
              style={{ width: "45%", transform: `rotate(${deg}deg)`, transformOrigin: "0 50%" }}
            />
          ))}

          {/* Rivets */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <div
              key={`r-${deg}`}
              className="absolute w-3 h-3 rounded-full border border-primary/20"
              style={{
                background: "radial-gradient(circle, hsl(0 3% 24%), hsl(0 3% 14%))",
                top: `${50 + 42 * Math.sin((deg * Math.PI) / 180)}%`,
                left: `${50 + 42 * Math.cos((deg * Math.PI) / 180)}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>

        {/* Status text */}
        <p className="mt-8 text-center text-xs text-primary font-bold tracking-[0.3em] uppercase animate-pulse">
          {phase === "spinning" ? "Autenticando..." : phase === "opening" ? "Acesso Liberado" : ""}
        </p>
      </div>
    </div>
  );
}
