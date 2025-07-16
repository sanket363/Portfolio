import { useScrollProgress } from "@/hooks/use-scroll-progress";

export function ScrollIndicator() {
  const scrollProgress = useScrollProgress();

  return (
    <div 
      className="scroll-indicator"
      style={{ transform: `scaleX(${scrollProgress})` }}
    />
  );
}
