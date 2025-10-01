import * as React from "react";

// Simple alert dialog implementation
interface AlertDialogProps {
  children: React.ReactNode;
}

interface AlertDialogTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface AlertDialogContentProps {
  className?: string;
  children: React.ReactNode;
}

interface AlertDialogHeaderProps {
  className?: string;
  children: React.ReactNode;
}

interface AlertDialogFooterProps {
  className?: string;
  children: React.ReactNode;
}

interface AlertDialogTitleProps {
  className?: string;
  children: React.ReactNode;
}

interface AlertDialogDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

interface AlertDialogActionProps {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

interface AlertDialogCancelProps {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const AlertDialogContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

const AlertDialog = ({ children }: AlertDialogProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
};

const AlertDialogTrigger = ({ asChild, children }: AlertDialogTriggerProps) => {
  const { setOpen } = React.useContext(AlertDialogContext);

  const handleClick = () => setOpen(true);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick: handleClick });
  }

  return <button onClick={handleClick}>{children}</button>;
};

const AlertDialogContent = ({ className = '', children }: AlertDialogContentProps) => {
  const { open, setOpen } = React.useContext(AlertDialogContext);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)} />
      <div className={`fixed left-1/2 top-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white p-6 shadow-lg rounded-lg ${className}`}>
        {children}
      </div>
    </>
  );
};

const AlertDialogHeader = ({ className = '', children }: AlertDialogHeaderProps) => (
  <div className={`flex flex-col space-y-2 text-center sm:text-left ${className}`}>
    {children}
  </div>
);

const AlertDialogFooter = ({ className = '', children }: AlertDialogFooterProps) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}>
    {children}
  </div>
);

const AlertDialogTitle = ({ className = '', children }: AlertDialogTitleProps) => (
  <h2 className={`text-lg font-semibold ${className}`}>
    {children}
  </h2>
);

const AlertDialogDescription = ({ className = '', children }: AlertDialogDescriptionProps) => (
  <p className={`text-sm text-muted-foreground ${className}`}>
    {children}
  </p>
);

const AlertDialogAction = ({ className = '', onClick, children }: AlertDialogActionProps) => {
  const { setOpen } = React.useContext(AlertDialogContext);

  const handleClick = () => {
    if (onClick) onClick();
    setOpen(false);
  };

  return (
    <button
      className={`inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

const AlertDialogCancel = ({ className = '', onClick, children }: AlertDialogCancelProps) => {
  const { setOpen } = React.useContext(AlertDialogContext);

  const handleClick = () => {
    if (onClick) onClick();
    setOpen(false);
  };

  return (
    <button
      className={`inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-semibold ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};