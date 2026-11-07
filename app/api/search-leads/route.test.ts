import assert from "node:assert/strict";
import { register } from "node:module";
import test from "node:test";

// next has no "exports" map, so Node's ESM loader cannot resolve the route's
// "next/server" import without the file extension (Next's bundler can).
register(
  "data:text/javascript," +
    encodeURIComponent(
      'export function resolve(specifier, context, next) { return next(specifier === "next/server" ? "next/server.js" : specifier, context); }'
    )
);

const { POST } = await import("./route.ts");

// Dataset items shaped like johnvc/google-maps-places-api output: two places
// (the second has no phone or website), then an error row and a free-tier
// notice row, which carry no place name.
const datasetItems = [
  {
    searchTerm: "Restaurants in Guntur",
    position: 1,
    title: "Sample Spice Kitchen",
    address: "12 Main Road, Guntur, Andhra Pradesh 522001",
    latitude: 16.3067,
    longitude: 80.4365,
    rating: 4.4,
    ratingCount: 812,
    type: "Restaurant",
    types: ["Restaurant", "Andhra restaurant"],
    phoneNumber: "+91 90000 00001",
    website: "https://example.com/spice-kitchen",
    cid: "1000000000000000001",
    placeId: "ChIJAAAAAAAAAAAAAAAAAAAAAA1",
    cached: false,
    fetchedAt: "2026-10-24T09:00:00Z",
  },
  {
    searchTerm: "Restaurants in Guntur",
    position: 2,
    title: "Sample Tiffin Centre",
    address: "4 Station Road, Guntur, Andhra Pradesh 522002",
    latitude: 16.2991,
    longitude: 80.4575,
    rating: 3.9,
    ratingCount: 41,
    type: "Restaurant",
    types: ["Restaurant"],
    cid: "1000000000000000002",
    placeId: "ChIJAAAAAAAAAAAAAAAAAAAAAA2",
    cached: false,
    fetchedAt: "2026-10-24T09:00:00Z",
  },
  { error_message: "The data service is temporarily unavailable. Please retry shortly." },
  {
    free_tier_notice: true,
    notice: "free_tier_limit_reached",
    message: "Free monthly allowance reached for this Actor.",
  },
];

function searchRequest() {
  return new Request("http://localhost/api/search-leads", {
    method: "POST",
    body: JSON.stringify({ category: "Restaurants", city: "Guntur", radius: "100" }),
  });
}

function withToken(token: string) {
  const origToken = process.env.APIFY_API_TOKEN;
  process.env.APIFY_API_TOKEN = token;
  return () => {
    if (origToken === undefined) delete process.env.APIFY_API_TOKEN;
    else process.env.APIFY_API_TOKEN = origToken;
  };
}

test("search-leads runs johnvc/google-maps-places-api and maps places to leads", async (t) => {
  t.after(withToken("test-token"));
  const fetchMock = t.mock.method(globalThis, "fetch", async () => Response.json(datasetItems, { status: 201 }));

  const res = await POST(searchRequest());

  assert.equal(fetchMock.mock.callCount(), 1);
  const [url, init] = fetchMock.mock.calls[0].arguments;
  assert.equal(
    url,
    "https://api.apify.com/v2/acts/johnvc~google-maps-places-api/run-sync-get-dataset-items?token=test-token"
  );
  assert.equal(init?.method, "POST");
  assert.deepEqual(JSON.parse(String(init?.body)), {
    searchTerms: ["Restaurants in Guntur"],
    maxResultsPerSearch: 20,
    language: "en",
  });

  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), {
    leads: [
      {
        business_name: "Sample Spice Kitchen",
        phone: "+91 90000 00001",
        website: "https://example.com/spice-kitchen",
        address: "12 Main Road, Guntur, Andhra Pradesh 522001",
        rating: 4.4,
        category: "Restaurants",
        city: "Guntur",
      },
      {
        business_name: "Sample Tiffin Centre",
        address: "4 Station Road, Guntur, Andhra Pradesh 522002",
        rating: 3.9,
        category: "Restaurants",
        city: "Guntur",
      },
    ],
  });
});

test("search-leads returns Apify's error when the run does not succeed", async (t) => {
  t.after(withToken("test-token"));
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({ error: { type: "run-failed", message: "Actor run did not succeed" } }, { status: 400 })
  );

  const res = await POST(searchRequest());

  assert.equal(res.status, 500);
  const body = await res.json();
  assert.match(body.error, /^Apify run error: /);
  assert.match(body.error, /run-failed/);
});
