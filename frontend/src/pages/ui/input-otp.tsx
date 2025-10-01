import * as React from "react";

interface InputOTPProps {
  maxLength: number;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

interface InputOTPGroupProps {
  className?: string;
  children: React.ReactNode;
}

interface InputOTPSlotProps {
  index: number;
  className?: string;
}

interface InputOTPSeparatorProps {
  className?: string;
}

const InputOTPContext = React.createContext<{
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
}>({
  value: '',
  onChange: () => {},
  maxLength: 6,
});

const InputOTP = ({ maxLength, value = '', onChange, className = '' }: InputOTPProps) => {
  const [internalValue, setInternalValue] = React.useState('');
  const currentValue = value || internalValue;

  const handleChange = (newValue: string) => {
    if (newValue.length <= maxLength) {
      if (onChange) {
        onChange(newValue);
      } else {
        setInternalValue(newValue);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      handleChange(currentValue.slice(0, -1));
    } else if (/^[0-9]$/.test(e.key)) {
      handleChange(currentValue + e.key);
    }
  };

  return (
    <InputOTPContext.Provider value={{ value: currentValue, onChange: handleChange, maxLength }}>
      <div
        className={`flex items-center gap-2 ${className}`}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {Array.from({ length: maxLength }, (_, i) => (
          <InputOTPSlot key={i} index={i} />
        ))}
      </div>
    </InputOTPContext.Provider>
  );
};

const InputOTPGroup = ({ className = '', children }: InputOTPGroupProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      {children}
    </div>
  );
};

const InputOTPSlot = ({ index, className = '' }: InputOTPSlotProps) => {
  const { value } = React.useContext(InputOTPContext);
  const char = value[index] || '';

  return (
    <div
      className={`relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md ${className}`}
    >
      {char}
      {index === value.length && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-pulse bg-foreground" />
        </div>
      )}
    </div>
  );
};

const InputOTPSeparator = ({ className = '' }: InputOTPSeparatorProps) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="h-px w-3 bg-border" />
    </div>
  );
};

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };