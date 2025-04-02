"use client";

import type * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ExplanationModalProps {
  triggerText: string;
  title: string;
  children: React.ReactNode;
  triggerClassName?: string;
}

export function ExplanationModal({
  triggerText,
  title,
  children,
  triggerClassName,
}: ExplanationModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className={triggerClassName}>
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-2">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
