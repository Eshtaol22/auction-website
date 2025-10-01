import * as React from "react";

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
}

interface CarouselContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CarouselItemProps {
  children: React.ReactNode;
  className?: string;
}

interface CarouselPreviousProps {
  className?: string;
}

interface CarouselNextProps {
  className?: string;
}

const CarouselContext = React.createContext<{
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  itemCount: number;
  setItemCount: (count: number) => void;
}>({
  currentIndex: 0,
  setCurrentIndex: () => {},
  itemCount: 0,
  setItemCount: () => {},
});

const Carousel = ({ children, className = '' }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [itemCount, setItemCount] = React.useState(0);

  return (
    <CarouselContext.Provider value={{ currentIndex, setCurrentIndex, itemCount, setItemCount }}>
      <div className={`relative ${className}`}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
};

const CarouselContent = ({ children, className = '' }: CarouselContentProps) => {
  const { currentIndex, setItemCount } = React.useContext(CarouselContext);
  
  React.useEffect(() => {
    const count = React.Children.count(children);
    setItemCount(count);
  }, [children, setItemCount]);

  return (
    <div className={`overflow-hidden ${className}`}>
      <div 
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {children}
      </div>
    </div>
  );
};

const CarouselItem = ({ children, className = '' }: CarouselItemProps) => {
  return (
    <div className={`min-w-full ${className}`}>
      {children}
    </div>
  );
};

const CarouselPrevious = ({ className = '' }: CarouselPreviousProps) => {
  const { currentIndex, setCurrentIndex, itemCount } = React.useContext(CarouselContext);

  const handlePrevious = () => {
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : itemCount - 1);
  };

  return (
    <button
      onClick={handlePrevious}
      className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg ${className}`}
    >
      ←
    </button>
  );
};

const CarouselNext = ({ className = '' }: CarouselNextProps) => {
  const { currentIndex, setCurrentIndex, itemCount } = React.useContext(CarouselContext);

  const handleNext = () => {
    setCurrentIndex(currentIndex < itemCount - 1 ? currentIndex + 1 : 0);
  };

  return (
    <button
      onClick={handleNext}
      className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg ${className}`}
    >
      →
    </button>
  );
};

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};