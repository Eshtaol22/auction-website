import * as React from "react";

// Simple drawer implementation
interface DrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface DrawerTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface DrawerContentProps {
  className?: string;
  children: React.ReactNode;
}

interface DrawerHeaderProps {
  className?: string;
  children: React.ReactNode;
}

interface DrawerFooterProps {
  className?: string;
  children: React.ReactNode;
}

interface DrawerTitleProps {
  className?: string;
  children: React.ReactNode;
}

interface DrawerDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

const DrawerContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

const Drawer = ({ open: controlledOpen, onOpenChange, children }: DrawerProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const setOpen = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      {children}
    </DrawerContext.Provider>
  );
};

const DrawerTrigger = ({ asChild, children }: DrawerTriggerProps) => {
  const { setOpen } = React.useContext(DrawerContext);

  const handleClick = () => setOpen(true);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick: handleClick });
  }

  return <button onClick={handleClick}>{children}</button>;
};

const DrawerContent = ({ className = '', children }: DrawerContentProps) => {
  const { open, setOpen } = React.useContext(DrawerContext);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)} />
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-background border-t rounded-t-lg p-6 ${className}`}>
        {children}
      </div>
    </>
  );
};

const DrawerHeader = ({ className = '', children }: DrawerHeaderProps) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}>
    {children}
  </div>
);

const DrawerFooter = ({ className = '', children }: DrawerFooterProps) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}>
    {children}
  </div>
);

const DrawerTitle = ({ className = '', children }: DrawerTitleProps) => (
  <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h2>
);

const DrawerDescription = ({ className = '', children }: DrawerDescriptionProps) => (
  <p className={`text-sm text-muted-foreground ${className}`}>
    {children}
  </p>
);

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};