import * as React from "react";

// CSS styles for the button component
const buttonStyles = `
  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem; /* gap-2 */
    white-space: nowrap;
    border-radius: 0.375rem; /* rounded-md */
    font-size: 0.875rem; /* text-sm */
    font-weight: 500; /* font-medium */
    transition: background-color 0.2s, color 0.2s; /* transition-colors */
    outline: none;
  }
  .button:focus-visible {
    box-shadow: 0 0 0 2px #3b82f6, 0 0 0 4px rgba(255, 255, 255, 0.5); /* focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 */
  }
  .button:disabled {
    pointer-events: none; /* disabled:pointer-events-none */
    opacity: 0.5; /* disabled:opacity-50 */
  }
  .button svg {
    pointer-events: none; /* [&_svg]:pointer-events-none */
    width: 1rem; /* [&_svg]:size-4 */
    height: 1rem; /* [&_svg]:size-4 */
    flex-shrink: 0; /* [&_svg]:shrink-0 */
  }
  /* Variant: default */
  .button-default {
    background: #2563eb; /* bg-primary (Tailwind blue-600) */
    color: white; /* text-primary-foreground */
  }
  .button-default:hover:not(:disabled) {
    background: #1d4fd8; /* hover:bg-primary/90 */
  }
  /* Variant: destructive */
  .button-destructive {
    background: #dc2626; /* bg-destructive (Tailwind red-600) */
    color: white; /* text-destructive-foreground */
  }
  .button-destructive:hover:not(:disabled) {
    background: #b91c1c; /* hover:bg-destructive/90 */
  }
  /* Variant: outline */
  .button-outline {
    border: 1px solid #e5e7eb; /* border-input */
    background: white; /* bg-background */
    color: #111827; /* default text color */
  }
  .button-outline:hover:not(:disabled) {
    background: #f3f4f6; /* hover:bg-accent */
    color: #1f2937; /* hover:text-accent-foreground */
  }
  /* Variant: secondary */
  .button-secondary {
    background: #6b7280; /* bg-secondary (Tailwind gray-500) */
    color: white; /* text-secondary-foreground */
  }
  .button-secondary:hover:not(:disabled) {
    background: #4b5563; /* hover:bg-secondary/80 */
  }
  /* Variant: ghost */
  .button-ghost {
    background: transparent;
    color: #111827; /* default text color */
  }
  .button-ghost:hover:not(:disabled) {
    background: #f3f4f6; /* hover:bg-accent */
    color: #1f2937; /* hover:text-accent-foreground */
  }
  /* Variant: link */
  .button-link {
    background: transparent;
    color: #2563eb; /* text-primary */
    text-decoration: underline;
    text-underline-offset: 4px; /* underline-offset-4 */
  }
  .button-link:hover:not(:disabled) {
    text-decoration: underline; /* hover:underline */
  }
  /* Size: default */
  .button-size-default {
    height: 2.5rem; /* h-10 */
    padding: 0.5rem 1rem; /* px-4 py-2 */
  }
  /* Size: sm */
  .button-size-sm {
    height: 2.25rem; /* h-9 */
    padding: 0 0.75rem; /* px-3 */
    border-radius: 0.375rem; /* rounded-md */
  }
  /* Size: lg */
  .button-size-lg {
    height: 2.75rem; /* h-11 */
    padding: 0 2rem; /* px-8 */
    border-radius: 0.375rem; /* rounded-md */
  }
  /* Size: icon */
  .button-size-icon {
    height: 2.5rem; /* h-10 */
    width: 2.5rem; /* w-10 */
  }
`;

// Inject styles into the document
const injectStyles = () => {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = buttonStyles;
  document.head.appendChild(styleSheet);
  return () => {
    document.head.removeChild(styleSheet);
  };
};

// Call injectStyles once when the module is loaded
let cleanupStyles: (() => void) | null = null;
if (typeof window !== "undefined") {
  cleanupStyles = injectStyles();
}

// Button variants and sizes
const buttonVariants = ({
  variant = "default",
  size = "default",
}: {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}) => {
  const variantClasses = {
    default: "button-default",
    destructive: "button-destructive",
    outline: "button-outline",
    secondary: "button-secondary",
    ghost: "button-ghost",
    link: "button-link",
  };

  const sizeClasses = {
    default: "button-size-default",
    sm: "button-size-sm",
    lg: "button-size-lg",
    icon: "button-size-icon",
  };

  return `${variantClasses[variant]} ${sizeClasses[size]}`;
};

// Button component
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? "span" : "button"; // Use span for asChild to avoid button nesting issues
    return (
      <Comp
        className={`button ${buttonVariants({ variant, size })} ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };