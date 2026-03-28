const DEFAULT_PUBLIC_APP_URL = "http://localhost:3000";

function normalizePublicAppUrl(url: string): string {
  return url.replace(/\/$/, "");
}

function shouldAllowLocalFallback(): boolean {
  return process.env.NODE_ENV !== "production";
}

export function resolvePublicAppUrl(appUrl?: string): string {
  const normalizedInput = appUrl?.trim();

  if (!normalizedInput) {
    if (!shouldAllowLocalFallback()) {
      throw new Error("APP_URL must be configured in production");
    }

    return DEFAULT_PUBLIC_APP_URL;
  }

  try {
    const parsedUrl = new URL(normalizedInput);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("APP_URL must use http or https");
    }

    return normalizePublicAppUrl(parsedUrl.toString());
  } catch {
    throw new Error("APP_URL must be a valid absolute public URL");
  }
}

export function buildPublicAppUrl(path: string, appUrl?: string): string {
  const baseUrl = resolvePublicAppUrl(appUrl);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

export function buildHostedDashboardUrl(
  appUrl?: string,
  query?: Record<string, string>,
): string {
  const url = new URL(resolvePublicAppUrl(appUrl));
  url.pathname = "/";
  url.search = "";

  for (const [key, value] of Object.entries(query || {})) {
    url.searchParams.set(key, value);
  }

  return url.toString();
}
