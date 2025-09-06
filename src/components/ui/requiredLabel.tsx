import { Label } from "@radix-ui/react-label";


export function RequiredLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) {
  return (
    <Label htmlFor={htmlFor} className="flex items-start gap-1">
      {children}
      <span className="text-destructive">*</span>
    </Label>
  );
}
