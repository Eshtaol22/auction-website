import * as React from "react";

// Simple menubar implementation
const Menubar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`flex h-10 items-center space-x-1 rounded-md border bg-background p-1 ${className}`}
      {...props}
    />
  )
);
Menubar.displayName = "Menubar";

const MenubarMenu = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
      {React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child, { open, setOpen } as any)
          : child
      )}
    </div>
  );
};

const MenubarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { open?: boolean; setOpen?: (open: boolean) => void }>(
  ({ className = '', open, setOpen, ...props }, ref) => (
    <button
      ref={ref}
      className={`flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground ${className}`}
      onClick={() => setOpen?.(!open)}
      {...props}
    />
  )
);
MenubarTrigger.displayName = "MenubarTrigger";

const MenubarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { open?: boolean }>(
  ({ className = '', open, ...props }, ref) => {
    if (!open) return null;
    return (
      <div
        ref={ref}
        className={`absolute z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md ${className}`}
        {...props}
      />
    );
  }
);
MenubarContent.displayName = "MenubarContent";

const MenubarItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
      {...props}
    />
  )
);
MenubarItem.displayName = "MenubarItem";

const MenubarSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`-mx-1 my-1 h-px bg-muted ${className}`} {...props} />
  )
);
MenubarSeparator.displayName = "MenubarSeparator";

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
};