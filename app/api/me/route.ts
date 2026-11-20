import { auth, isAdminSession } from "@/auth";

export async function GET() {
  const session = await auth();
  return Response.json({ admin: isAdminSession(session) });
}