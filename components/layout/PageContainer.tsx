import { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
};

export function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="flex-1 overflow-auto">
      <div className="mx-auto w-full max-w-7xl p-6">
        {children}
      </div>
    </main>
  );
}