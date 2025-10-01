import * as React from "react";

// Simple sheet/drawer implementation
interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface SheetTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface SheetContentProps {
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  children: React.ReactNode;
}

const SheetContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => {} });

const Sheet = ({ open: controlledOpen, onOpenChange, children }: SheetProps) => {
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
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
};

const SheetTrigger = ({ asChild, children }: SheetTriggerProps) => {
  const { setOpen } = React.useContext(SheetContext);
  
  const handleClick = () => {
    setOpen(true);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      ...children.props,
    });
  }

  return (
    <button onClick={handleClick}>
      {children}
    </button>
  );
};

const SheetContent = ({ side = 'right', className = '', children }: SheetContentProps) => {
  const { open, setOpen } = React.useContext(SheetContext);
  
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
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

  const sideClasses = {
    top: 'top-0 left-0 right-0 h-96',
    right: 'top-0 right-0 bottom-0 w-80',
    bottom: 'bottom-0 left-0 right-0 h-96',
    left: 'top-0 left-0 bottom-0 w-80',
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/50"
        onClick={() => setOpen(false)}
      />
      
      {/* Sheet content */}
      <div
        className={`fixed z-50 bg-background p-6 shadow-lg transition-transform ${sideClasses[side]} ${className}`}
      >
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

export { Sheet, SheetTrigger, SheetContent };