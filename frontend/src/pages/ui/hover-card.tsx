import * as React from "react";

interface HoverCardProps {
  children: React.ReactNode;
}

interface HoverCardTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface HoverCardContentProps {
  className?: string;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactNode;
}

const HoverCardContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

const HoverCard = ({ children }: HoverCardProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <HoverCardContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">
        {children}
      </div>
    </HoverCardContext.Provider>
  );
};

const HoverCardTrigger = ({ asChild, children }: HoverCardTriggerProps) => {
  const { setOpen } = React.useContext(HoverCardContext);

  const handleMouseEnter = () => setOpen(true);
  const handleMouseLeave = () => setOpen(false);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    });
  }

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
    </div>
  );
};

const HoverCardContent = ({ className = '', align = 'center', side = 'bottom', children }: HoverCardContentProps) => {
  const { open } = React.useContext(HoverCardContext);

  if (!open) return null;

  const alignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
    end: 'right-0',
  };

  const sideClasses = {
    top: 'bottom-full mb-2',
    right: 'left-full ml-2 top-0',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2 top-0',
  };

  return (
    <div
      className={`absolute z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none ${sideClasses[side]} ${alignmentClasses[align]} ${className}`}
    >
      {children}
    </div>
  );
};

export { HoverCard, HoverCardTrigger, HoverCardContent };