import type { Metadata } from "next";
import { Suspense } from "react";
import SignInCard from "@/components/SignInCard";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <div className="signin">
      <div className="signin__stripe" aria-hidden="true" />
      <main className="signin__main">
        <Suspense fallback={null}>
          <SignInCard />
        </Suspense>
      </main>
    </div>
  );
}