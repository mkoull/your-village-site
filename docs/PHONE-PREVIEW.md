# Private phone preview

The phone preview shares the existing local build through a temporary HTTPS tunnel. It creates a dedicated synthetic family account, separate from the local role-switching accounts. The marketing deployment is unchanged.

Run the built app with `npm run app:preview`, then `node scripts/phone-preview-gateway.mjs`. The gateway listens only on `127.0.0.1:3103`. Connect a Cloudflare Quick Tunnel to that port and set `origin` in the ignored `.village-data/phone-preview.json` to the exact assigned HTTPS origin. The private entry address is that origin plus `/phone#` plus the generated `invite` value. Do not publish that configuration file or include its credentials in logs or commits.

The invitation exchanges its fragment for an HTTP-only, Secure, SameSite cookie and removes the fragment from the visible URL. A fixed server-side session limits every forwarded API call to the dedicated family. The gateway rejects anonymous API access, incorrect origins, expired access, role shortcuts, registration/login endpoints, provider/owner APIs and marketing submissions. The local-only preview checks in the app remain unchanged. No port forwarding or firewall rule is required.

The invitation and access cookie expire after 24 hours. The tunnel address works only while the computer, local app, gateway and tunnel are running. To stop access, stop the gateway/tunnel or set the configuration expiry in the past. A replacement tunnel needs its new origin configured and a fresh link given to the user. This is a temporary personal preview, not public app hosting.

On iPhone, open the invitation in Safari, then use Share → Add to Home Screen → Add. The app supplies Apple web-app metadata, an Apple touch icon and PNG manifest icons. Manifest and icons are publicly readable because they contain no account information. Private pages and API responses are not cached.

Validation: 49 automated tests pass, including invitation, cookie, origin, expiry, API allowlist and upstream session isolation checks. Type checking and production builds pass. The live HTTPS invitation was browser-checked at phone width: it opens the family account, hides role-switching controls, saves a provider and shows it in My village. Physical iPhone installation is for the user to verify.
