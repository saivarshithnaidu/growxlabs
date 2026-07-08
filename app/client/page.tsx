import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ClientPage() {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  if (host.startsWith("client.")) {
    redirect("/dashboard");
  } else {
    redirect("/client/dashboard");
  }
}
