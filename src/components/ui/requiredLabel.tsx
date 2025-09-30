import { Label } from "@radix-ui/react-label";


export function RequiredLabel({ children, htmlFor, className, style }: { children: React.ReactNode; htmlFor: string; className?: string; style?: React.CSSProperties }) {
  return (
    <Label htmlFor={htmlFor} className={`flex items-start gap-1 ${className}`} style={style}>
      {children}
      <span className="text-destructive mr-1">*</span>
    </Label>
  );
}
