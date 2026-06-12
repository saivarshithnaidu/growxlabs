/**
 * Utility to construct absolute URLs for navigating between the main domain and subdomains.
 * This ensures clean cross-origin transitions and prevents client-side routing conflicts or cached redirect loops.
 */
export function getAbsoluteUrl(path: string, currentHostname?: string): string {
  const defaultBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://growxlabs.tech";

  // Resolve hostname
  let hostname = "";
  let protocol = "https:";
  let port = "";

  if (currentHostname) {
    const parts = currentHostname.split(":");
    hostname = parts[0];
    if (parts[1]) {
      port = parts[1];
    }
  } else if (typeof window !== "undefined") {
    hostname = window.location.hostname;
    protocol = window.location.protocol;
    port = window.location.port;
  } else if (defaultBaseUrl) {
    try {
      const parsed = new URL(defaultBaseUrl);
      hostname = parsed.hostname;
      protocol = parsed.protocol;
      port = parsed.port;
    } catch {
      hostname = "growxlabs.tech";
    }
  }

  if (!hostname) {
    return path;
  }

  const portString = port ? `:${port}` : "";
  let isLocal = hostname.includes("localhost") || hostname.includes("127.0.0.1");
  if (isLocal) {
    protocol = "http:";
  }

  // Determine target subdomain
  let targetSub = "";
  let cleanPath = path;

  if (path.startsWith("/courses")) {
    targetSub = "courses";
    cleanPath = path.replace(/^\/courses/, "") || "/";
  } else if (path.startsWith("/careers")) {
    targetSub = "careers";
    cleanPath = path.replace(/^\/careers/, "") || "/";
  }

  // Prepend locale if present in cleanPath (e.g. /en-IN/courses -> /courses)
  // Let's strip locale prefixes for target subdomains since they resolve locales internally
  cleanPath = cleanPath.replace(/^\/(en-IN|en-US|en-GB|en-AU|en)(\/|$)/, "$2");
  if (cleanPath === "") {
    cleanPath = "/";
  }

  if (targetSub) {
    if (isLocal) {
      return `${protocol}//${targetSub}.localhost${portString}${cleanPath === "/" ? "" : cleanPath}`;
    } else {
      const baseHost = hostname.replace(/^(admin\.|client\.|restaurant\.|hotel\.|realestate\.|courses\.|careers\.)/, '');
      return `${protocol}//${targetSub}.${baseHost}${cleanPath === "/" ? "" : cleanPath}`;
    }
  }

  // Links to main domain (like /privacy, /terms, etc.)
  if (isLocal) {
    return `${protocol}//localhost${portString}${path}`;
  } else {
    const baseHost = hostname.replace(/^(admin\.|client\.|restaurant\.|hotel\.|realestate\.|courses\.|careers\.)/, '');
    return `${protocol}//${baseHost}${path}`;
  }
}
