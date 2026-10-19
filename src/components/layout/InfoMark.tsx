import { cn } from "@/lib/utils";

/** Знак справочной: «i» на информационном синем, как на указателях курорта. */
export function InfoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cn("h-10 w-10", className)}>
      <rect width="40" height="40" rx="10" className="fill-primary" />
      <circle cx="20" cy="11.5" r="3.2" fill="#fff" />
      <path d="M16 17.5h6.2v12.3H25V33H15v-3.2h2.8v-9.1H16z" fill="#fff" />
    </svg>
  );
}
