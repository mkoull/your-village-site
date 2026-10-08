# Your Village: launch review and working plan

Reviewed 8 October 2026 against the integration repository and read-only public endpoint checks. This is a product and launch audit, not a claim of store approval, delivered enquiries, revenue or a completed security assessment. No real leads were submitted, providers contacted, accounts enrolled or paid services purchased during the review.

## Delivered in this review

- Public website release `fdfa7d8` is deployed at [Your Village](https://your-village-site.vercel.app/). Vercel recorded successful Production deployment `6926839364` on 8 October 2026. The production branch contains the public website only.
- The website now has a simpler searchable catalogue, deliberate save/removal actions, useful next steps in My village, an adaptive return CTA, refined cards/spacing/footer, and public native-app introduction, privacy and help pages. Structured data describes a website rather than implying a service business with confirmed suburb coverage.
- The native preview now prioritises a useful next action above the village scene. Tasks and existing support can be edited, reminders survive label edits, completed plans have a meaningful empty state, and saving failures remain visible until resolved.
- All 57 integration tests and 36 public-release tests passed. Website TypeScript and production builds passed. Website checks also passed on GitHub for the reviewed branch, main and integration branch.
- All 18 native tests, TypeScript and lint passed; iOS, Android and web exports completed. The browser preview is available at `http://127.0.0.1:8084/` on the development computer. This is not an installable binary.
- Browser checks covered all 22 public page routes at 320px: one H1 each, no horizontal overflow and no broken in-page anchors. Functional checks covered search/save/detail/next-step focus, preserved progress after Undo, builder lights, mobile navigation and returning-home state. Native browser checks covered saving, creating/editing/completing a plan step, editing existing support, and 320px/393px layouts. No browser console errors appeared in these checked journeys.
- The published `/mobile-app`, `/mobile-app/privacy` and `/mobile-app/support` return 200 and were checked in the browser. The live save-to-My-village-to-next-step flow works; the homepage recognises the saved choice. Live `GET /api/leads` still reports `acceptingEnquiries: false`; the private account API still returns 404. No delivery or physical-phone test is claimed.

GitHub Actions now checks website tests/types/builds and, on the integration branch, mobile tests/types/lint/exports. Branch protection and store publication are not configured by those workflows. The initial mobile cloud run identified two missing optional tooling peers in the Windows-generated lockfile. Commit `9e2cd79` adds only those entries; no existing dependency versions changed. The repaired lock passed a clean Linux-targeted install and the complete Ubuntu [Mobile checks run 37725308317](https://github.com/mkoull/your-village-site/actions/runs/37725308317), including tests, types, lint and all platform exports.

## The product to launch

**A calm place to bring together the support you have, find the help you need, and take one useful next step.**

The first user is a parent or carer carrying too much of the household load, including a mother beyond the newborn stage. They may already have friends, relatives or paid help. Their problem is the effort of working out what help would make a difference and following through. The outcome is practical support, not a full glowing map or a completed questionnaire.

The warm forest, cream and gold identity fits that promise. A premium product earns trust through clear actions, reliable saving, useful content and recovery from mistakes. More animation, dashboards, urgency or subscription screens would not address the main gaps.

**Activation:** someone finds a relevant support option, saves it and takes an intentional next step. On the website, that can be visiting the independent service after reading what to check. In the native app, it can also be adding a practical plan step. An external click alone must never count as a contact, booking or fulfilled outcome.

**Return loop:** identify one need → consider suitable help → record one next step → return or receive an optional reminder → update what happened → adjust the village. Existing support should feel as valuable as discovering something new. Keep this a gentle tool, without streaks, completion pressure or a demand to select all eight categories.

## Three surfaces, three honest promises

| Surface | What exists | Credible launch position |
| --- | --- | --- |
| Public website | Eight categories, eight independent service starting points, saved category shortlist, manual progress, optional browser remembering and exports | Useful discovery and planning website. It is not an exhaustive directory, a booking service or a verified provider network. |
| Native iPhone/Android app | Expo implementation with device-only saved support, existing-support labels, practical plan, local reminder code and private share preview | Prepare a small signed beta. Compiled bundles and browser previews are not installable releases or physical-device validation. |
| Account/provider web prototype | Local SQLite accounts, fictional preview providers, requests/offers, owner/provider views and unbilled referral records | Keep private. It needs real supply, production identity/storage and operating processes before taking customer requests. |

The public `/api/village/session` returned **404** in this review. The integration API additionally disables its SQLite backend when `VERCEL` is set (`app/api/village/[...action]/route.ts`). Publishing the integration branch to Vercel would not create a production marketplace.

The native app does not inherit website selections, have a common account or sync between devices. Avoid suggesting a seamless website-to-phone handoff until it exists. The current native web preview resets on reload; this is a preview limitation, not the installed app's intended storage behaviour.

## Highest-priority launch gates

| Priority | Gap and evidence | Required outcome | Owner/dependency |
| --- | --- | --- | --- |
| P0 for accepting enquiries | Live `GET /api/leads` returned `{ "acceptingEnquiries": false }`. Contact capture is intentionally unavailable. | Configure the existing private delivery adapter, verify sender, test receipt in the chosen inbox, define who responds, and handle failure visibly. Keep the recipient server-side. | Owner-controlled email service and Vercel environment access. |
| P0 for store release | No signed release or physical-phone test evidence. Build identifiers come from owner-supplied environment values. | Connect publisher accounts, build signed betas, test native storage/reminders/navigation/accessibility, then prepare store metadata and submit. | Expo plus Apple/Google publisher setup. |
| P0 for app support | Native app and account prototype require different privacy explanations. | Native-specific privacy/help pages are now public and linked from the native app. A help page must also provide working contact delivery before store submission. | Page publication verified; operational contact remains open. |
| P0 for real provider requests | Prototype has no production delivery, verified email, password recovery or self-service account deletion; preview suppliers are fictional. | Real approved provider records, durable backed-up storage, identity lifecycle, notifications and an agreed support/complaints process before accepting real requests. | Separate later launch; not a requirement to release the guest planner. |
| P1 before promotion | One public starting point per category; coverage and eligibility vary. | Show geographic/eligibility limits plainly, verify links on a schedule, and expand only with real useful alternatives. | Owner confirms launch geography; content stewardship. |
| P1 before intake scale | `/api/leads` bounds/validates bodies and checks browser origin, but has no durable abuse limits or deduplication. | Deployment/receiver rate limits, retry/deduplication strategy, monitoring and a test of rejection/timeout/recovery. | Chosen receiving service and host controls. |
| P1 before native distribution decision | Remaining mobile audit roots have no published patch. | Document actual exposure and mitigations, recheck before release and make an explicit release decision. Never label the audit clean. | Engineering; detail below. |

The Vercel connector again returned **403** when listing environment-variable metadata with decryption disabled. No values were exposed. There is no installed Vercel CLI or local `.vercel` linkage in this checkout for the mapped CLI fallback. This is an access limitation, not evidence that a particular credential is absent. The public endpoint is the current evidence that intake is closed.

The adapter already supports Resend or an HTTPS webhook (`app/api/leads/route.ts`, `lib/lead-handler.ts`). Resend's test domain is restricted to the account owner's address; production sending requires an owned, verified sender domain. A successful accepted message ID still needs an inbox receipt check. See [Resend's sender restriction](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain).

## Experience review: start to finish

| Moment | Standard to meet | Missing value or release check |
| --- | --- | --- |
| Arriving | Understand the benefit, location limits and the next action without reading a long explanation. | Keep one main action. Use actual product views, not invented testimonials or provider counts. Explain the phone app's availability accurately. |
| Choosing support | Card and light interactions clearly agree; no accidental removal or surprise navigation. | Website lights select; the saved village/native lights open details. Label their action in context rather than relying on glow alone. |
| Exploring | Explain what a category can help with and what happens after the next click. | A category is not a provider. Public examples are independent starting points, not approved partners. Preserve filters and scroll on return. |
| Deciding | See a useful real-world next step and know what to check. | Coverage, price source, access/referral requirements and family-stage restrictions matter more than decorative badges. PANDA and Tweddle are early-parenthood starting points; they do not cover every family stage. Several other examples focus on Melbourne. |
| Saving | Save in place with clear feedback; editing/removal should be deliberate and reversible. | Show category/progress saving as a personal record, never provider acknowledgement. Let people correct support labels and tasks without delete-and-recreate. |
| Acting | One clear next step leads to a real service or manageable plan action. | Keep independent-provider contact external and explicit. No suggestion that Village sent anything unless an actual delivery took place. |
| Returning | Immediately see the next useful action and what is already in place. | Prioritise upcoming steps and a useful empty state. Test force-close/reopen, denied reminder permission and interrupted writes on phones. |
| Sharing | Understand exactly what leaves the device. | Current native share excludes personal labels/tasks. A shared editable family plan is a separate, unbuilt capability, not what this share action does. |
| Getting help | Recover from errors and reach a responsible person. | FAQ and honest unavailable states are useful, but do not replace a working private support form for launch. |
| Leaving/clearing | Know what is removed and what remains. | Native clear removes local entries/reminders; website clearing does not retract exported copies or already submitted enquiries. There is no native cloud recovery. |

The public native landing, privacy and support routes are `/mobile-app`, `/mobile-app/privacy` and `/mobile-app/support`. Their publication is verified above. They accurately explain that phone downloads are not available yet; do not add store badges until they lead to an available build.

## The biggest product gaps after polish

1. **Useful service depth.** A visually rich interface currently sits over eight external examples. Improve the usefulness of each result and add real alternatives in the chosen area before presenting marketplace scale. Store a checked date and owner for every source; avoid unverified current availability.
2. **A reason to return.** The native plan/reminder flow is a plausible reason, but no evidence yet shows families prefer it to their current notes, messages or calendar. Observe repeated real use before adding accounts, elaborate onboarding or subscriptions.
3. **Shared support.** A partner or relative cannot currently collaborate on the same village. This is a promising later hypothesis because support involves others; validate the exact shared action people need before building permissions, invitations and cloud sync.
4. **An operational owner.** There is no verified intake, published operational support channel or provider-response process. Design cannot compensate for a request that nobody receives.
5. **A validated payer.** The referral ledger is a prototype with example economics, not agreed provider terms, invoicing or collected revenue. No willingness-to-pay evidence is recorded in the reviewed docs.

## A launch sequence with exit criteria

### Stage 1: a credible public website

Release the design/flow improvements, clear native-app status and truthful privacy/support pages. Confirm source links and coverage. Connect the inbox, verify real delivery with the owner, and assign handling of support/privacy requests before encouraging enquiries or beta sign-ups. A domain improves brand consistency and sender setup; purchase/ownership is an owner decision.

Exit: the public visitor can find relevant help, save it, return and reach Village if something fails. No broken destinations, fictional providers, false delivery confirmations or installation promises. Check the actual deployed version, not only local output.

### Stage 2: a small family beta on real phones

Use the guest native app as the first release scope. Invite a deliberately small cohort after the signed build and support channel are ready; this document does not authorise sending invitations. Include parents beyond newborn stages and people with varying existing support. Give them a real task from their week and watch them use the app without coaching.

Proposed test, not observed results: with 10 consenting families, aim for at least 7 to independently find/save a relevant option and define a useful next step. After a week, look for at least 5 returning voluntarily and concrete examples of reduced effort or obtained support. These are internal decision thresholds, not statistical proof or public claims. If people only enjoy the lights, do not know what to do next or cannot find relevant help, fix coverage and the core task before buying traffic or adding a paywall.

Track these outcomes through opt-in interviews initially. The native app currently has no analytics. Do not add silent collection of selected needs, progress, labels or task content. Any later measurement design needs a clear purpose, minimisation and updated disclosures.

### Stage 3: prove one provider proposition

Choose the first service area and a small set of categories where families actually seek help and providers can fulfil it. Validate the provider problem through 5–10 conversations and obtain an explicit pilot commitment before substantial platform work. Obtain permission before publishing a profile; collect accurate coverage, service terms, qualifications/check scope and contact preferences.

Proposed commercial starting hypothesis: free family discovery/planning, with a provider-paid product only when it demonstrably brings useful enquiries or saves administrative work. Test one clearly described pilot offer. Do not adopt the prototype's 10% / A$50-cap estimate as real pricing without agreement, or add clinical/community referral fees. Paid placements must be labelled and should not silently determine suitability recommendations.

Choose the model from actual evidence: a recurring provider fee needs recurring value; a qualified-enquiry fee needs a precise definition and dispute process; booking commission needs attribution, fulfilment and payment/refund operations. None is implemented commercially today. Before charging for digital app features or real-world services, review the relevant store payment rules for that exact offer.

Track contribution per provider as collected revenue less acquisition, onboarding, ongoing support, payment/processing and dispute costs. Track whether providers receive and value enquiries, not merely profile visits. If providers will not commit after seeing real relevant demand, revisit the proposition before building payment infrastructure.

### Stage 4: connect accounts only when shared use needs them

Choose one production identity/API/storage architecture for web and native, then add verification, recovery, deletion, scoped access, notification delivery, backups and operational monitoring. Migrate deliberately; do not expose the current SQLite preview API or relax same-origin protection to make phones connect. Keep identity and backend changes out of the public website visual release.

## Native security and store readiness

Read-only registry and dependency checks on 8 October 2026 found:

- `braces@3.0.3` is both installed and the latest published version, through Expo Metro → `metro-file-map` → `micromatch`. The current advisory lists no patched version for deeply nested pattern stack exhaustion: [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).
- `node-forge@1.4.0` is both installed and the latest published version, through Expo CLI and its code-signing certificate tooling. The current advisory lists no patched version for the RSA signature-verification issue: [GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv).

The mobile runbook's last full audit recorded 18 high findings propagated from those two roots. This review confirmed their versions, dependency paths and advisories; it did not rerun or replace the full audit. No compatible patch can currently be recommended from that evidence. Keep Metro local, use trusted build inputs, review the actual signing path and recheck before release. Build/development provenance is relevant to exposure but is not a waiver or a clean audit. Do not force an Expo downgrade to silence the report or invent an untested package override.

Before store submission, test a signed build on physical iPhone and Android: new install, offline catalogue, save/close/reopen, lock/unlock, keyboard/back behaviour, large text, VoiceOver/TalkBack, safe areas, notification denial/grant/delivery/tap/cancellation, native share cancellation and clear/recovery. Capture actual build screenshots. A web viewport test cannot validate these behaviours.

Apple requires working support contact information, complete submissions and meaningful app utility; its guidance directs beta testing to TestFlight. Approval remains Apple's decision. See [App Review Guidelines, sections 1.5, 2.1, 2.2 and 4.2](https://developer.apple.com/app-store/review/guidelines/).

EAS submission uploads binaries; it does not publish a reviewed app automatically. See [Expo's submission process](https://docs.expo.dev/deploy/submit-to-app-stores/). For affected new personal Google Play accounts, the current production-access requirement includes 12 testers continuously opted in for 14 days; confirm the owner's account type before planning dates. See [Google Play testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en).

## Owner decisions that unblock delivery

1. Confirm the first launch geography and audience boundaries; the product concept can stay broad while local service coverage is specific.
2. Connect the owner-controlled sender/domain and Vercel settings so the existing private recipient can receive enquiries; the recipient must remain hidden from public source/UI.
3. Connect Expo and the intended Apple/Google publisher accounts, approve actual account costs separately, and choose persistent app identifiers.
4. Identify who handles support, privacy requests and service complaints, with an internal operating process before promising response times.
5. Approve a narrow provider validation/pilot offer after the family beta produces evidence. A future business model is not decided by this audit.

The delivery evidence above supplements the website validation report and mobile runbook. Passing automated/browser checks is distinct from a signed build, store approval, physical-device testing or verified inbox delivery.
