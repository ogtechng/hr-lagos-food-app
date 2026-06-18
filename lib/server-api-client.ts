import "server-only";

import axios from "axios";
import { headers } from "next/headers";

function getServerApiBaseUrl(headersList: Headers) {
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}/api/v1`;
}

export async function createServerApiClient() {
  const headersList = await headers();
  const cookie = headersList.get("cookie");

  return axios.create({
    baseURL: getServerApiBaseUrl(headersList),
    headers: cookie ? { cookie } : undefined,
  });
}
