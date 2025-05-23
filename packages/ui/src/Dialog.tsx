"use client";
import * as React from "react";

// Basic CSS for animations and styling
const dialogStyles = `
  .dialog-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 50;
  }
  .dialog-overlay[data-state='open'] {
    animation: fadeIn 0.2s ease-in;
  }
  .dialog-overlay[data-state='closed'] {
    animation: fadeOut 0.2s ease-out;
  }
  .dialog-content {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 50;
    width: 100%;
    max-width: 24rem; /* 384px */
    background: white;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
  }
  .dialog-content[data-state='open'] {
    animation: zoomIn 0.2s ease-in;
  }
  .dialog-content[data-state='closed'] {
    animation: zoomOut 0.2s ease-out;
  }
  .dialog-close {
    position: absolute;
    right: 1rem;
    top: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
  }
  .dialog-close:hover {
    opacity: 1;
  }
  .dialog-close:focus {
    outline: none;
    box-shadow: 0 0 0 2px #3b82f6;
  }
  .dialog-header {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    text-align: center;
  }
  .dialog-footer {
    display: flex;
    flex-direction: column-reverse;
    gap: 0.5rem;
  }
  .dialog-title {
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1;
  }
  .dialog-description {
    font-size: 0.875rem;
    color: #6b7280;
  }
  @media (min-width: 640px) {
    .dialog-header {
      text-align: left;
    }
    .dialog-footer {
      flex-direction: row;
      justify-content: flex-end;
      gap: 0.5rem;
    }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  @keyframes zoomIn {
    from { transform: translate(-50%, -50%) scale(0.95); opacity: 0; }
    to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  }
  @keyframes zoomOut {
    from { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    to { transform: translate(-50%, -50%) scale(0.95); opacity: 0; }
  }
`;

// Dialog Context to manage open/close state
const DialogContext = React.createContext<{
  isOpen: boolean;
  open: () => void;
  close: () => void;
}>({
  isOpen: false,
  open: () => {},
  close: () => {},
});

// Dialog Root Component
const Dialog: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Inject styles when the Dialog component mounts
  React.useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = dialogStyles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []); // Empty dependency array ensures this runs once on mount

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <DialogContext.Provider value={{ isOpen, open, close }}>
      {children}
    </DialogContext.Provider>
  );
};

// Dialog Trigger Component
const DialogTrigger: React.FC<
  React.HTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }
> = ({ children, ...props }) => {
  const { open } = React.useContext(DialogContext);
  return (
    <button onClick={open} {...props}>
      {children}
    </button>
  );
};

// Dialog Portal Component (simplified, renders children in a div)
const DialogPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};

// Dialog Overlay Component
const DialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => {
  const { isOpen } = React.useContext(DialogContext);
  return (
    <div
      ref={ref}
      data-state={isOpen ? "open" : "closed"}
      className={`dialog-overlay ${className}`}
      {...props}
    />
  );
});
DialogOverlay.displayName = "DialogOverlay";

// Dialog Content Component
const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }
>(({ className = "", children, ...props }, ref) => {
  const { isOpen, close } = React.useContext(DialogContext);
  if (!isOpen) return null;

  return (
    <DialogPortal>
      <DialogOverlay />
      <div
        ref={ref}
        data-state={isOpen ? "open" : "closed"}
        className={`dialog-content ${className}`}
        {...props}
      >
        {children}
        <button className="dialog-close" onClick={close}>
          ✕
          <span className="sr-only">Close</span>
        </button>
      </div>
    </DialogPortal>
  );
});
DialogContent.displayName = "DialogContent";

// Dialog Close Component
const DialogClose: React.FC<React.HTMLAttributes<HTMLButtonElement>> = ({
  className = "",
  ...props
}) => {
  const { close } = React.useContext(DialogContext);
  return (
    <button className={`dialog-close ${className}`} onClick={close} {...props}>
      ✕
      <span className="sr-only">Close</span>
    </button>
  );
};
DialogClose.displayName = "DialogClose";

// Dialog Header Component
const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  ...props
}) => <div className={`dialog-header ${className}`} {...props} />;
DialogHeader.displayName = "DialogHeader";

// Dialog Footer Component
const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  ...props
}) => <div className={`dialog-footer ${className}`} {...props} />;
DialogFooter.displayName = "DialogFooter";

// Dialog Title Component
const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className = "", ...props }, ref) => (
  <h2 ref={ref} className={`dialog-title ${className}`} {...props} />
));
DialogTitle.displayName = "DialogTitle";

// Dialog Description Component
const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className = "", ...props }, ref) => (
  <p ref={ref} className={`dialog-description ${className}`} {...props} />
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};