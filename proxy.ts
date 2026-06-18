import type { NextRequest } from "next/server";

import { updateAdminSession } from "@/app/api/_supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateAdminSession(request);
}

export default proxy;

export const config = {
  matcher: ["/admin/:path*"],
};
