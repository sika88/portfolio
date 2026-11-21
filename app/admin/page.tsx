import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth, isAdminSession } from "@/auth";
import { getContent } from "@/lib/admin-content";
import AdminEditor from "@/components/AdminEditor";
import { getBackgrounds } from "@/lib/backgrounds";

export const metadata: Metadata = {
  title: "Admin dashboard",
  robots: { index: false, follow: false },
};

async function Gate() {
  if (!isAdminSession(await auth())) redirect("/signin");
  const [content, backgrounds] = await Promise.all([getContent(), getBackgrounds()]);
  return <AdminEditor initial={content} backgrounds={backgrounds} />;
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