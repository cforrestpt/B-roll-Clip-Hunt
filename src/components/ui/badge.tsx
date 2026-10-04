import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase",
  {
    variants: {
      variant: {
        default: "border-border bg-bg-subtle text-fg-muted",
        accent: "border-border-strong bg-primary/10 text-fg",
        receipts: "border-receipt/30 bg-receipt/10 text-receipt",
        entity: "border-entity/30 bg-entity/10 text-entity",
        concept: "border-concept/30 bg-concept/10 text-concept",
        cultural: "border-cultural/30 bg-cultural/10 text-cultural",
        drop: "border-drop/30 bg-drop/10 text-drop",
        success: "border-success/30 bg-success/10 text-success",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
