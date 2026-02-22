import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "default" | "sm" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsButton extends ButtonBaseProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  href?: undefined;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "btn-glow bg-sage text-white hover:bg-sage-dark active:bg-sage-dark shadow-sm hover:shadow-lg",
  secondary:
    "border border-border text-text-body hover:border-sage hover:text-sage bg-transparent hover:shadow-sm",
  ghost:
    "text-text-body hover:text-sage bg-transparent",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-5 py-2 text-sm",
  default: "px-7 py-3 text-[15px]",
  lg: "px-9 py-4 text-base",
};

export default function Button({
  variant = "primary",
  size = "default",
  className,
  children,
  href,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 font-medium rounded-[100px] transition-all duration-300 ease-out hover:-translate-y-[2px] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-sage focus-visible:outline-offset-2 cursor-pointer whitespace-nowrap",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
