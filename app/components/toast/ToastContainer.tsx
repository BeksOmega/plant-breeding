"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import { AnimatePresence } from "motion/react";
import Toast from "./Toast";
import clsx from "clsx";

export interface ToastData {
  id: string;
  content: ReactNode;
  disableAnimation?: boolean;
}

interface ToastContextType {
  showToast: (
    content: ReactNode,
    duration?: number,
    disableAnimation?: boolean
  ) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Hook to access toast functionality
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

/**
 * ToastProvider component - provides toast context and renders the toast container.
 * Should be placed at the root of your app.
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const removeToast = useCallback((id: string) => {
    // Clear timeout if it exists
    const timeout = timeoutRefs.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutRefs.current.delete(id);
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (
      content: ReactNode,
      duration: number = 5000,
      disableAnimation?: boolean
    ): string => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, content, disableAnimation }]);

      // Set up auto-dismiss timeout (skip if duration is 0 or less)
      if (duration > 0) {
        const timeout = setTimeout(() => {
          removeToast(id);
        }, duration);

        timeoutRefs.current.set(id, timeout);
      }

      return id;
    },
    [removeToast]
  );

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
      timeoutRefs.current.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div
        className={clsx("fixed top-0 left-0", "z-50", "flex flex-col gap-2")}
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <Toast key={toast.id} disableAnimation={toast.disableAnimation}>
              {toast.content}
            </Toast>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
