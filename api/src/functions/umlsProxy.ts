import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

const UMLS_BASE = "https://uts-ws.nlm.nih.gov/rest";

async function umlsProxy(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const restOfPath = request.params.restOfPath || "";

  // Build target URL
  const targetUrl = new URL(`${UMLS_BASE}/${restOfPath}`);

  // Copy query params from the incoming request
  const incomingUrl = new URL(request.url);
  incomingUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });

  // Inject API key from server-side environment variable
  const apiKey = process.env.UMLS_API_KEY;
  if (!apiKey) {
    context.error("UMLS_API_KEY environment variable not configured");
    return { status: 500, body: "UMLS_API_KEY not configured on server" };
  }
  targetUrl.searchParams.set("apiKey", apiKey);

  try {
    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: { "Accept": "application/json" },
    });

    let body = await response.text();

    // Rewrite absolute UMLS URLs in response body to proxy-relative paths
    // so the client follows embedded links through the proxy
    body = body.replaceAll(UMLS_BASE, "/api/umls");

    return {
      status: response.status,
      headers: { "Content-Type": response.headers.get("Content-Type") || "application/json" },
      body: body,
    };
  } catch (error) {
    context.error("UMLS proxy error:", error);
    return { status: 502, body: "Failed to proxy request to UMLS API" };
  }
}

app.http("umlsProxy", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "umls/{*restOfPath}",
  handler: umlsProxy,
});
