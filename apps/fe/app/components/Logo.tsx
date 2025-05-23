interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo = ({ size = "md", className = "" }: LogoProps) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const combinedClassName = `font-bold flex items-center gap-2 ${sizeClasses[size]} ${className}`;

  return (
    <div className={combinedClassName}>
      <div className="w-6 h-6 rounded-md bg-canvas-primary flex items-center justify-center text-white">
        <span className="font-mono font-bold transform -translate-y-0.5">C</span>
      </div>
      <span>CollabCanvas</span>
    </div>
  );
};

export default Logo;
