import { BarLoader } from "react-spinners";
import { Suspense } from "react";

export default function DashboardLayout({ children }) {
  return (
    <Suspense
      fallback={<BarLoader className="mt-4" width={"100%"} color="#EAE0D5" />}
    >
      {children}
    </Suspense>
  );
}
