import type { PropsWithChildren } from "react";

export function Header({ children }: PropsWithChildren) {
  return (
    <header className="min-h-(--header-height) px-4 md:px-6 flex flex-row gap-6 justify-start items-center">
      {children}
    </header>
  );
}
