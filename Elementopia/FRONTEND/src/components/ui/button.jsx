import React from "react";

export const Button = React.forwardRef(({ className = "", variant = "default", size = "default", ...props }, ref) => {
  const base = "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
    outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-xl px-8",
  };
  return (
    <button ref={ref} className={`${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`} {...props} />
  );
});
Button.displayName = "Button";
