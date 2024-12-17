import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, fullWidth, ...props }, ref) => {
    return (
      <div
        className={cn("relative flex items-center", fullWidth ? "w-full" : "")}
      >
        {icon && (
          <span className="absolute left-3 inline-flex items-center text-muted-foreground">
            {icon}
          </span>
        )}
        <input
          type={type}
          className={cn(
            `flex h-9 w-full rounded-md border border-input bg-white text-black pr-3 ${
              icon ? "pl-10" : "pl-3"
            } py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`,
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
