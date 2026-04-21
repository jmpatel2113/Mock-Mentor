export function getAppUrl(request) {
  const configuredUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  const requestUrl = new URL(request.url);
  const isLocalhost = requestUrl.hostname === "localhost" || requestUrl.hostname === "127.0.0.1";

  if (process.env.NODE_ENV !== "production" || isLocalhost) {
    return requestUrl.origin;
  }

  throw new Error("APP_URL must be configured in production.");
}
