import type { ReactNode } from "react";

export default function AdminField({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`admin-field ${className}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}
