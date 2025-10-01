import * as React from "react";

// Simple context menu implementation
interface ContextMenuProps {
  children: React.ReactNode;
}

interface ContextMenuTriggerProps {
  children: React.ReactNode;
}

interface ContextMenuContentProps {
  className?: string;
  children: React.ReactNode;
}

interface ContextMenuItemProps {
  className?: string;
  disabled?: boolean;
  onSelect?: () => void;
  children: React.ReactNode;
}

interface ContextMenuSeparatorProps {
  className?: string;
}

const ContextMenuContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
}>({
  open: false,
  setOpen: () => {},
  position: { x: 0, y: 0 },
  setPosition: () => {},
});

const ContextMenu = ({ children }: ContextMenuProps) => {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  return (
    <ContextMenuContext.Provider value={{ open, setOpen, position, setPosition }}>
      {children}
    </ContextMenuContext.Provider>
  );
};

const ContextMenuTrigger = ({ children }: ContextMenuTriggerProps) => {
  const { setOpen, setPosition } = React.useContext(ContextMenuContext);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setOpen(true);
  };

  return (
    <div onContextMenu={handleContextMenu}>
      {children}
    </div>
  );
};

const ContextMenuContent = ({ className = '', children }: ContextMenuContentProps) => {
  const { open, setOpen, position } = React.useContext(ContextMenuContext);

  React.useEffect(() => {
    const handleClickOutside = () => setOpen(false);
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    if (open) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      className={`fixed z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md ${className}`}
      style={{ left: position.x, top: position.y }}
    >
      {children}
    </div>
  );
};

const ContextMenuItem = ({ className = '', disabled, onSelect, children }: ContextMenuItemProps) => {
  const { setOpen } = React.useContext(ContextMenuContext);

  const handleClick = () => {
    if (!disabled && onSelect) {
      onSelect();
    }
    setOpen(false);
  };

  return (
    <div
      className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground ${
        disabled ? 'pointer-events-none opacity-50' : 'hover:bg-accent hover:text-accent-foreground'
      } ${className}`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

const ContextMenuSeparator = ({ className = '' }: ContextMenuSeparatorProps) => (
  <div className={`-mx-1 my-1 h-px bg-muted ${className}`} />
);

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
};