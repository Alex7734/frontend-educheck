import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/helpers/style/cn";

export interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> { }

const Tabs = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Root>, TabsProps>(
    ({ className, ...props }, ref) => (
        <TabsPrimitive.Root ref={ref} className={cn("flex flex-col", className)} {...props} />
    )
);
Tabs.displayName = "Tabs";

export interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> { }

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
    ({ className, ...props }, ref) => (
        <TabsPrimitive.List
            ref={ref}
            className={cn(
                "inline-flex items-center justify-center rounded-lg bg-grey-300 p-1 text-muted-foreground",
                className
            )}
            {...props}
        />
    )
);
TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> { }

const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
    ({ className, ...props }, ref) => (
        <TabsPrimitive.Trigger
            ref={ref}
            className={cn(
                "inline-flex min-w-[100px] items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all",
                "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
                "hover:bg-accent hover:text-accent-foreground",
                className
            )}
            {...props}
        />
    )
);
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> { }

const TabsContent = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Content>, TabsContentProps>(
    ({ className, ...props }, ref) => (
        <TabsPrimitive.Content
            ref={ref}
            className={cn("p-2", className)}
            {...props}
        />
    )
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };