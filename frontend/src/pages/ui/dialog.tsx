import * as React from "react";

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface DialogContentProps {
  className?: string;
  children: React.ReactNode;
}

interface DialogHeaderProps {
  className?: string;
  children: React.ReactNode;
}

interface DialogFooterProps {
  className?: string;
  children: React.ReactNode;
}

interface DialogTitleProps {
  className?: string;
  children: React.ReactNode;
}

interface DialogDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

const DialogContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

const Dialog = ({ open: controlledOpen, onOpenChange, children }: DialogProps) => {
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
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger = ({ asChild, children }: DialogTriggerProps) => {
  const { setOpen } = React.useContext(DialogContext);

  const handleClick = () => setOpen(true);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick: handleClick });
  }

  return <button onClick={handleClick}>{children}</button>;
};

const DialogContent = ({ className = '', children }: DialogContentProps) => {
  const { open, setOpen } = React.useContext(DialogContext);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)} />
      <div className={`fixed left-1/2 top-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-background p-6 shadow-lg border rounded-lg ${className}`}>
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          ✕
        </button>
        {children}
      </div>
    </>
  );
};

const DialogHeader = ({ className = '', children }: DialogHeaderProps) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}>
    {children}
  </div>
);

const DialogFooter = ({ className = '', children }: DialogFooterProps) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}>
    {children}
  </div>
);

const DialogTitle = ({ className = '', children }: DialogTitleProps) => (
  <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h2>
);

const DialogDescription = ({ className = '', children }: DialogDescriptionProps) => (
  <p className={`text-sm text-muted-foreground ${className}`}>
    {children}
  </p>
);

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};