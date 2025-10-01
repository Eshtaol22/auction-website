import * as React from "react";

// Simple accordion implementation without external dependencies
interface AccordionProps {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface AccordionItemProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

interface AccordionTriggerProps {
  className?: string;
  children: React.ReactNode;
}

interface AccordionContentProps {
  className?: string;
  children: React.ReactNode;
}

const AccordionContext = React.createContext<{
  openItems: string[];
  toggleItem: (value: string) => void;
}>({
  openItems: [],
  toggleItem: () => {},
});

const AccordionItemContext = React.createContext<{
  value: string;
  isOpen: boolean;
}>({
  value: '',
  isOpen: false,
});

const Accordion = ({ type = 'single', collapsible = false, className = '', children }: AccordionProps) => {
  const [openItems, setOpenItems] = React.useState<string[]>([]);

  const toggleItem = (value: string) => {
    setOpenItems(prev => {
      if (type === 'single') {
        return prev.includes(value) ? [] : [value];
      } else {
        return prev.includes(value) 
          ? prev.filter(item => item !== value)
          : [...prev, value];
      }
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={className}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

const AccordionItem = ({ value, className = '', children }: AccordionItemProps) => {
  const { openItems } = React.useContext(AccordionContext);
  const isOpen = openItems.includes(value);

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div className={`border-b ${className}`}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

const AccordionTrigger = ({ className = '', children }: AccordionTriggerProps) => {
  const { toggleItem } = React.useContext(AccordionContext);
  const { value, isOpen } = React.useContext(AccordionItemContext);

  return (
    <button
      className={`flex justify-between items-center w-full py-4 font-medium text-left hover:underline ${className}`}
      onClick={() => toggleItem(value)}
    >
      {children}
      <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
        ▼
      </span>
    </button>
  );
};

const AccordionContent = ({ className = '', children }: AccordionContentProps) => {
  const { isOpen } = React.useContext(AccordionItemContext);

  if (!isOpen) return null;

  return (
    <div className={`pb-4 pt-0 ${className}`}>
      {children}
    </div>
  );
};

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
};