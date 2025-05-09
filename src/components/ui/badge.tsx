import { cn } from "@/helpers/style/cn";
import * as React from "react";

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "destructive" | "outline" | "success";
}

function Badge({
    className,
    variant = "default",
    ...props
}: BadgeProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                {
                    "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80": variant === "default",
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
                    "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80": variant === "destructive",
                    "text-foreground": variant === "outline",
                    "border-transparent bg-green-500 text-white shadow hover:bg-green-500/80": variant === "success",
                },
                className
            )}
            {...props}
        />
    );
}

export { Badge }; 