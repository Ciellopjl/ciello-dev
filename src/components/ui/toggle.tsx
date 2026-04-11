import * as React from "react"
import { cn } from "@/lib/utils"

interface ToggleProps {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  disabled?: boolean;
}

const Toggle = ({ pressed, onPressedChange, disabled }: ToggleProps) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onPressedChange(!pressed)}
      className={cn(
        "w-12 h-6 rounded-full transition-colors relative focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500/50",
        pressed ? "bg-red-600" : "bg-white/10",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div
        className={cn(
          "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
          pressed ? "translate-x-6" : "translate-x-0"
        )}
      />
    </button>
  );
};

export { Toggle };
