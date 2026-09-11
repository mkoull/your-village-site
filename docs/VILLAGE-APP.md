# Village app — first working build

The app at `/app` turns the existing discovery website into a working family/provider request flow. It uses the same circle logo, warm colours, typefaces and eight-category catalogue. The website and its saved category plan are preserved; `/my-village` links into the app when its backend is enabled.

## Try it locally

Use Node 24, then run `npm ci`, `npm run build`, and `npm run app:preview`. Open `http://127.0.0.1:3101/app`.

Choose **Try the family app**. Use **Try another view** to see the provider and owner sides. These are example accounts in a shared local workspace. Six fictional providers are seeded once. Names, prices, availability and referral fees in this mode are examples, not real businesses or commercial agreements. Use synthetic data only.

The preview is bound to loopback and its API refuses preview access through a non-local host. Preview data is kept in `.village-data/preview.sqlite`, ignored by Git. It persists through refreshes and server restarts. Switching views changes the account, not the underlying data.

## Working journeys

1. Browse by category, suburb or provider name, open a profile, save it to a family account, then send a consented availability request to that provider's in-app inbox.
2. The provider reads the request, messages the family, offers a total price and arrangement, or declines. Providers can update their public price and availability description.
3. The family accepts the exact offer shown. A concurrently revised offer requires fresh acceptance. Either party can cancel before delivery; the note remains in the conversation.
4. The provider marks the support delivered and paid; the family then confirms receipt and payment. This is a record of their confirmations, not a payment processor receipt.
5. Eligible first completions create one unbilled referral estimate. Ten percent is capped at A$50. A second booking between the same family/provider does not create another first-booking fee. Clinical/community categories have no referral fee. Disputes void any recorded estimate; the owner can record a resolution and close the request without a fee.
6. Providers can register and submit a listing. Applications remain private until owner review and publication; pausing removes them from discovery and prevents new requests. Existing conversations remain available to their participants.

## Architecture and trade-offs

```text
Family / Provider / Owner screens
              |
        Same-origin JSON API
              |
 Session and role checks -> validation -> state transition
              |
   SQLite transaction + conversation event + referral record
```

- `lib/app-store.ts`: server-only data access and domain rules, using prepared statements and Node's built-in SQLite API. No database credentials or password hashes are returned to clients.
- `lib/app-api.ts`: bounded JSON, exact-origin write checks, persistent rate limits, no-store responses, and HTTP-only, SameSite session cookies. Pilot HTTPS adds Secure cookies. Sessions are random tokens, hashed in the database and revocable on logout.
- `app/api/village/[...action]/route.ts`: lazy connection and explicit runtime configuration. A preview database cannot be reopened as a pilot database.
- `components/app`: shared session, identity-scoped data fetching, family discovery, accounts, requests and separate provider/owner screens. Changing routes or accounts cannot reuse another account's cached view. No request content is stored in localStorage or sessionStorage.
- `content/services.ts`: canonical category identifiers. `content/preview-providers.ts` contains isolated fictional seed data.
- Request writes use a family-scoped idempotency key and content fingerprint. Completion/fee creation is transactional and first-referral uniqueness is enforced by the database.
- A manifest and scalable app icon support a standalone home-screen presentation where supported. No service worker caches private pages. This is a web app, not an App Store or Google Play binary.

SQLite avoids an external service or new dependency for this working local build. It requires one Node process with persistent disk, backups and a suitable operational environment. Node 24's SQLite API is experimental. The synchronous store and simple global authentication rate limit suit a small controlled pilot, not large public traffic. Move to a managed database and identity service before broad deployment.

Official implementation references: [Node SQLite](https://nodejs.org/docs/latest-v24.x/api/sqlite.html), [Next.js data security](https://nextjs.org/docs/app/guides/data-security).

## Runtime modes

- `VILLAGE_APP_MODE=preview`: fictional local workspace; loopback access only. The `app:preview` script sets this for its child process.
- `VILLAGE_APP_MODE=pilot`: requires an absolute `VILLAGE_DB_PATH` on persistent disk and an exact HTTPS `VILLAGE_APP_ORIGIN` without a trailing slash. No preview shortcuts or seed data. Never point this at the preview database.
- Missing configuration: app disabled with a useful link back to existing services.
- `VERCEL` set: app backend disabled. Vercel's ephemeral filesystem is not used for customer data; marketing routes still work. A public app needs durable hosting/storage configured first.

For a controlled pilot owner, set `VILLAGE_APP_MODE`, `VILLAGE_DB_PATH`, `VILLAGE_OWNER_NAME`, `VILLAGE_OWNER_EMAIL`, and `VILLAGE_OWNER_PASSWORD` in the operator environment and run `npm run app:create-owner`. This creates an owner only when none exists and refuses to replace an existing account. Clear the bootstrap credential environment variables afterwards. Never commit secrets or pass passwords in command-line arguments.

## Verification

The automated suite covers password/session handling, access across family/provider/owner roles, request idempotency, suburb and consent validation, stale offer acceptance, transitions, fee rounding/capping and uniqueness, disputes, listing review/ownership, restart persistence, HTTP guards and analytics exclusion. Existing website tests remain in the same suite.

Browser validation uses only synthetic accounts in the local preview. It covers save → request → offer → acceptance → delivery → family confirmation → A$14 unbilled referral for an A$140 example. Provider account creation, private application, publication into discovery and pausing are also exercised through the UI. Mobile layout and further recovery checks are recorded in the task's completion report.

Initial-build checks: 39 tests passed, TypeScript passes, and the production build passes. The existing website audit reports 19 pages, 46 internal links/assets, two missing-page cases and three metadata resources with no failures. Main app screens have one H1 and no horizontal overflow at 320px; the family and owner screens were visually checked at 390px and desktop. Profile saving, empty-search recovery, suburb filtering (including online services), database/session persistence through server restarts, and the website-to-app link were checked. All eight original category choices remained intact. The final browser error log was empty. Native installation and real email/payment delivery are not claimed as tested.

## Before inviting real users

This first build does not send email, process payments, verify professional credentials or connect real providers. Accounts currently have no email verification, password recovery or self-service deletion. Establish an operational support contact and retention/deletion process, add notifications and recovery, configure durable backed-up hosting, and onboard real providers with agreed publishing and commercial terms before a public launch. The UI explains these limits at the relevant decisions.

The referral ledger is not invoicing, collected revenue or tax reporting. Prices on an offer are entered by its provider; agreements, payments, cancellation charges and refunds remain directly between the parties. Provider publication is administrative approval, not a clinical or suitability endorsement.

## Experience review

See [App experience review](APP-EXPERIENCE-REVIEW.md) for the September 11 improvements and current validation: 46 tests pass, TypeScript and the production build pass, and the updated journeys are checked in the browser. The app remains a local preview, separate from the live marketing website.
