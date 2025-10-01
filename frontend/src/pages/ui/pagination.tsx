import * as React from "react";

interface PaginationProps {
  className?: string;
  children: React.ReactNode;
}

interface PaginationContentProps {
  className?: string;
  children: React.ReactNode;
}

interface PaginationItemProps {
  className?: string;
  children: React.ReactNode;
}

interface PaginationLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  isActive?: boolean;
  size?: 'default' | 'sm' | 'lg';
}

interface PaginationPreviousProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

interface PaginationNextProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

interface PaginationEllipsisProps {
  className?: string;
}

const Pagination = ({ className = '', ...props }: PaginationProps) => (
  <nav role="navigation" aria-label="pagination" className={`mx-auto flex w-full justify-center ${className}`} {...props} />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<HTMLUListElement, PaginationContentProps>(
  ({ className = '', ...props }, ref) => (
    <ul ref={ref} className={`flex flex-row items-center gap-1 ${className}`} {...props} />
  )
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, PaginationItemProps>(
  ({ className = '', ...props }, ref) => <li ref={ref} className={className} {...props} />
);
PaginationItem.displayName = "PaginationItem";

const PaginationLink = ({ className = '', isActive, size = 'default', ...props }: PaginationLinkProps) => {
  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 px-3',
    lg: 'h-11 px-8',
  };

  return (
    <a
      aria-current={isActive ? "page" : undefined}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isActive
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : 'hover:bg-accent hover:text-accent-foreground'
      } ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
};
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({ className = '', ...props }: PaginationPreviousProps) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={`gap-1 pl-2.5 ${className}`}
    {...props}
  >
    <span>←</span>
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className = '', ...props }: PaginationNextProps) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={`gap-1 pr-2.5 ${className}`}
    {...props}
  >
    <span>Next</span>
    <span>→</span>
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className = '', ...props }: PaginationEllipsisProps) => (
  <span
    aria-hidden
    className={`flex h-9 w-9 items-center justify-center ${className}`}
    {...props}
  >
    <span>...</span>
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};