import { ReactNode } from "react";

interface BoxedLayoutProps {
  children: ReactNode;
}

const BoxedLayout = ({ children }: BoxedLayoutProps) => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-full max-w-xl rounded-lg shadow-lg bg-background text-foreground p-6 flex flex-col gap-3">
        {children}
      </div>
    </div>
  );
};

export default BoxedLayout;
