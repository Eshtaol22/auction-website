import * as React from "react";

interface CollapsibleProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface CollapsibleTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface CollapsibleContentProps {
  className?: string;
  children: React.ReactNode;
}

const CollapsibleContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

const Collapsible = ({ open: controlledOpen, onOpenChange, children }: CollapsibleProps) => {
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
    <CollapsibleContext.Provider value={{ open, setOpen }}>
      <div>
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
};

const CollapsibleTrigger = ({ asChild, children }: CollapsibleTriggerProps) => {
  const { open, setOpen } = React.useContext(CollapsibleContext);

  const handleClick = () => {
    setOpen(!open);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick: handleClick });
  }

  return (
    <button onClick={handleClick}>
      {children}
    </button>
  );
};

const CollapsibleContent = ({ className = '', children }: CollapsibleContentProps) => {
  const { open } = React.useContext(CollapsibleContext);
  const contentRef = React.useRef<HTMLDivElement>(null);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      className={`overflow-hidden transition-all duration-300 ease-in-out ${className}`}
    >
      {children}
    </div>
  );
};

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
};