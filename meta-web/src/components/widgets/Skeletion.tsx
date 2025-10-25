import type React from "react";

type SkeletonProps = {
  width?: string | number
  height?: string | number
  variant?: "circle" | "rect"
}

const Skeleton: React.FC<SkeletonProps> = ({ width = "100%", height = "100%", variant = "rect" }) => {
  const style = { width, height };
  return <span className={`skeleton ${variant === "circle" ? 'circle' : ""}`} style={style}></span>
}

export default Skeleton;
