import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.ComponentPropsWithoutRef<"section"> {
  padding?: "none" | "default" | "custom"; // Padding options
  verticalPadding?: string; // Custom vertical padding class
  horizontalPadding?: string; // Custom horizontal padding class
  outside?: React.ReactNode; // Content outside `max-w-content`
  noMaxWidth?: boolean; // Option to disable the `max-w-content` wrapper
  containerClassName?: string; // Custom class for the container
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      padding = "default",
      verticalPadding = "py-8", // Default vertical padding
      horizontalPadding = "px-4", // Default horizontal padding
      className,
      containerClassName,
      outside,
      noMaxWidth = false,
      children,
      ...props
    },
    ref
  ) => {
    // Compute padding classes based on props
    const paddingClasses =
      padding === "none"
        ? ""
        : padding === "custom"
        ? `${verticalPadding} ${horizontalPadding}`
        : "py-8 px-4"; // Default padding

    return (
      <section
        ref={ref}
        className={cn(
          "relative w-full", // Ensures full width for the section
          paddingClasses, // Apply padding
          className // Allow additional custom styles
        )}
        {...props}
      >
        {/* Render content outside max-width container */}
        {outside}

        {/* Conditionally render the max-width container */}
        {noMaxWidth ? (
          children
        ) : (
          <div
            className={cn(
              "max-w-content relative mx-auto w-full h-full",
              containerClassName
            )}
          >
            {children}
          </div>
        )}
      </section>
    );
  }
);

Section.displayName = "Section";

export { Section };
