import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

const RXNAV_BASE = "https://rxnav.nlm.nih.gov/REST";

async function rxnavProxy(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const restOfPath = request.params.restOfPath || "";

  // Build target URL
  const targetUrl = new URL(`${RXNAV_BASE}/${restOfPath}`);

  // Copy query params from the incoming request
  const incomingUrl = new URL(request.url);
  incomingUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });

  try {
    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: { "Accept": "application/json" },
    });

    const body = await response.text();

    return {
      status: response.status,
      headers: { "Content-Type": response.headers.get("Content-Type") || "application/json" },
      body: body,
    };
  } catch (error) {
    context.error("RxNav proxy error:", error);
    return { status: 502, body: "Failed to proxy request to RxNav API" };
  }
}

app.http("rxnavProxy", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "rxnav/{*restOfPath}",
  handler: rxnavProxy,
});
