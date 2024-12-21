'use client';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastLoading,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, Check, X } from 'lucide-react';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, isPending, description, action, ...props }) {
        return isPending ? (
          <ToastLoading key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            {/* <ToastClose /> */}
          </ToastLoading>) : (
          <Toast key={id} {...props}>
            <div className="flex items-center justify-center">
              {
                props.variant == "success" ? 
                <div className='rounded-xl bg-[#2E303C] p-2 text-green-500 mr-2'>
                  <Check />
                </div> : <div className='rounded-xl bg-[#2E303C] p-2 text-red-500 mr-2'>
                  <AlertCircle />
                </div>
              }
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
            </div>
            <div className='absolute right-3 top-5 rounded-xl p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600'>
              <X size={20} className='cursor-pointer' onClick={() => { dismiss(id) }} />
            </div>
            {/* <ToastClose className='right-4 top-5 text-2xl' /> */}
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
