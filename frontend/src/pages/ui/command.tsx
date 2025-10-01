import * as React from "react";

interface CommandProps {
  className?: string;
  children: React.ReactNode;
}

interface CommandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

interface CommandListProps {
  className?: string;
  children: React.ReactNode;
}

interface CommandEmptyProps {
  children: React.ReactNode;
}

interface CommandGroupProps {
  heading?: string;
  className?: string;
  children: React.ReactNode;
}

interface CommandItemProps {
  className?: string;
  onSelect?: () => void;
  children: React.ReactNode;
}

interface CommandSeparatorProps {
  className?: string;
}

const CommandContext = React.createContext<{
  search: string;
  setSearch: (search: string) => void;
}>({
  search: '',
  setSearch: () => {},
});

const Command = ({ className = '', children }: CommandProps) => {
  const [search, setSearch] = React.useState('');

  return (
    <CommandContext.Provider value={{ search, setSearch }}>
      <div className={`flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground ${className}`}>
        {children}
      </div>
    </CommandContext.Provider>
  );
};

const CommandInput = ({ className = '', placeholder = 'Search...', ...props }: CommandInputProps) => {
  const { search, setSearch } = React.useContext(CommandContext);

  return (
    <div className="flex items-center border-b px-3">
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mr-2 h-4 w-4 shrink-0 opacity-50"
      >
        <path
          d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className={`flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    </div>
  );
};

const CommandList = ({ className = '', children }: CommandListProps) => {
  return (
    <div className={`max-h-[300px] overflow-y-auto overflow-x-hidden ${className}`}>
      {children}
    </div>
  );
};

const CommandEmpty = ({ children }: CommandEmptyProps) => {
  return (
    <div className="py-6 text-center text-sm">
      {children}
    </div>
  );
};

const CommandGroup = ({ heading, className = '', children }: CommandGroupProps) => {
  return (
    <div className={`overflow-hidden p-1 text-foreground ${className}`}>
      {heading && (
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          {heading}
        </div>
      )}
      {children}
    </div>
  );
};

const CommandItem = ({ className = '', onSelect, children }: CommandItemProps) => {
  return (
    <div
      className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground ${className}`}
      onClick={onSelect}
    >
      {children}
    </div>
  );
};

const CommandSeparator = ({ className = '' }: CommandSeparatorProps) => {
  return <div className={`-mx-1 h-px bg-border ${className}`} />;
};

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
};