import * as React from "react";

import { Check } from "lucide-react";
interface BulletItemProps {
  children: React.ReactNode;
}

export function BulletItem({ children }: BulletItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/20 transition-all duration-200 hover:bg-muted/40 min-h-[44px]">
      <div className="flex-shrink-0 w-5 h-5 bg-secondary rounded-full flex items-center justify-center">
        <Check className="w-3 h-3 text-secondary-foreground" strokeWidth={3} />
      </div>
      <span className="text-sm font-medium text-foreground leading-tight">{children}</span>
    </div>
  );
}