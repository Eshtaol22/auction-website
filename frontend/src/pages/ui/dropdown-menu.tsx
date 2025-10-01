import * as React from "react";

// Simple dropdown menu implementation without external dependencies
interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface DropdownMenuContentProps {
  align?: 'start' | 'center' | 'end';
  className?: string;
  children: React.ReactNode;
}

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface DropdownMenuSeparatorProps {
  className?: string;
}

const DropdownMenuContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => {} });

const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [open, setOpen] = React.useState(false);
  
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = ({ asChild, children }: DropdownMenuTriggerProps) => {
  const { setOpen } = React.useContext(DropdownMenuContext);
  
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

const DropdownMenuContent = ({ align = 'center', className = '', children }: DropdownMenuContentProps) => {
  const { open, setOpen } = React.useContext(DropdownMenuContext);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, setOpen]);

  if (!open) return null;

  const alignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
    end: 'right-0',
  };

  return (
    <div
      ref={contentRef}
      className={`absolute top-full mt-1 z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md ${alignmentClasses[align]} ${className}`}
    >
      {children}
    </div>
  );
};

const DropdownMenuItem = ({ className = '', children, onClick, ...props }: DropdownMenuItemProps) => {
  const { setOpen } = React.useContext(DropdownMenuContext);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      onClick(e);
    }
    setOpen(false);
  };

  return (
    <div
      className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
};

const DropdownMenuSeparator = ({ className = '' }: DropdownMenuSeparatorProps) => (
  <div className={`-mx-1 my-1 h-px bg-muted ${className}`} />
);

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
};