import * as React from "react";
import { cn } from "../../utils/cn";

interface TabsContextValue {
    value: string;
    onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

function useTabs() {
    const context = React.useContext(TabsContext);
    if (!context) {
        throw new Error("Tabs components must be used within a Tabs component");
    }
    return context;
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    onValueChange: (value: string) => void;
    defaultValue?: string;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
    ({ className, value, onValueChange, ...props }, ref) => {
        return (
            <TabsContext.Provider value={{ value, onValueChange }}>
                <div
                    ref={ref}
                    className={cn("w-full", className)}
                    {...props}
                />
            </TabsContext.Provider>
        );
    }
);

Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500",
                className
            )}
            {...props}
        />
    );
});

TabsList.displayName = "TabsList";

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
    ({ className, value, ...props }, ref) => {
        const { value: selectedValue, onValueChange } = useTabs();

        return (
            <button
                ref={ref}
                type="button"
                role="tab"
                aria-selected={selectedValue === value}
                data-state={selectedValue === value ? "active" : "inactive"}
                onClick={() => onValueChange(value)}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    "data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm",
                    className
                )}
                {...props}
            />
        );
    }
);

TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
    ({ className, value, ...props }, ref) => {
        const { value: selectedValue } = useTabs();
        const isSelected = selectedValue === value;

        return (
            <div
                ref={ref}
                role="tabpanel"
                hidden={!isSelected}
                data-state={isSelected ? "active" : "inactive"}
                className={cn(
                    "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                    isSelected ? "animate-fadeIn" : "",
                    className
                )}
                {...props}
            />
        );
    }
);

TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent }; 