declare module 'lucide-react/dist/esm/icons';
declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";
declare module "*.webp";
declare module 'lucide-react';

interface ImportMetaEnv {
  readonly VITE_HCAPTCHA_SITEKEY: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "lucide-react/dist/esm/icons/*" {
  import { FC, SVGProps } from "react";
  const Icon: FC<SVGProps<SVGSVGElement>>;
  export default Icon;
}

declare module "*.webp" {
  const value: string;
  export default value;
}