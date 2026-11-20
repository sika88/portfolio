import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth, isAdminSession } from "@/auth";
import { getContent } from "@/lib/admin-content";
import AdminEditor from "@/components/AdminEditor";

export const metadata: Metadata = {
  title: "Admin dashboard",
  robots: { index: false, follow: false },
};

async function Gate() {
  if (!isAdminSession(await auth())) redirect("/signin");
  const content = await getContent();
  return <AdminEditor initial={content} />;
}

export default function AdminPage() {
  return (
    <div className="adm">
      <Suspense fallback={<p className="adm-loading">Loading…</p>}>
        <Gate />
      </Suspense>
    </div>
  );
}