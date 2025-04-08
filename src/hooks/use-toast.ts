'use client';

import { useState, useEffect } from 'react';

type ToastProps = {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
};

type Toast = ToastProps & {
  id: string;
};

// Basic toast implementation - in a real app you might want to use a library
export function toast(props: ToastProps) {
  const event = new CustomEvent('toast', {
    detail: {
      ...props,
      id: Math.random().toString(36).substring(2, 9),
    },
  });
  
  window.dispatchEvent(event);
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  useEffect(() => {
    const handleToast = (event: Event) => {
      const toast = (event as CustomEvent<Toast>).detail;
      setToasts((prev) => [...prev, toast]);
      
      // Auto-dismiss after duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, toast.duration || 3000);
    };
    
    window.addEventListener('toast', handleToast);
    return () => window.removeEventListener('toast', handleToast);
  }, []);
  
  return { toasts, dismiss: (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)) };
}
