# Full-Stack Engineering Decisions

## Audit Findings

### Priority Summary

The three reported incidents drove my triage. Each maps to specific findings,
which I'd fix first, in this order:

**1. "Customer saw another customer's bookings" — broken tenant isolation (CRITICAL)**

- `GET /api/bookings` trusts `?tenantId=` from any caller
- `GET /api/bookings/:id` doesn't verify the booking's tenant
- `PATCH /api/bookings/:id/status` doesn't verify tenant
- `POST /api/bookings` doesn't verify `petId`/`sitterId` belong to the tenant

**2. "Double-booking — two sitters, same pet, same time" — broken overlap detection (CRITICAL)**

- Overlap check only looks at sitter conflicts, never pet conflicts (the reported incident exactly)
- Interval logic is incomplete (overnight slots, boundary cases)
- Overlap query uses `getAllBookings()` instead of scoping to the tenant

**3. "Dashboard shows stale data / filters reset" — frontend race (HIGH)**

- Concurrent fetches (15s poll + user actions) resolve out of order; a late
  response repaints stale data over a filtered view (see Frontend Approach)

Everything below the headline issues is triaged by severity. This audit is
intentionally not exhaustive — within the time box I prioritized the three
reported incidents and tenant isolation over typing, validation, and
architectural items. Those are still logged below and I'd address them in
severity order. I've separated genuine defects from code-quality/preference
items so the distinction is explicit.

---

### CRITICAL — Tenant isolation (incident #1)

What: `GET /api/bookings` honors a client-supplied `?tenantId=` ("tenant override for admin views") with no check that the caller is an admin — in fact no role check at all. Any authenticated user can read any tenant's bookings by passing the param.
File: `server/src/routes/bookings.ts`
Why: Any authenticated user can list another tenant's bookings — matches the
"saw another customer's bookings" report.
Sev: critical
Fix: Default to tenantId from Auth and add role check for override.

What: `GET /api/bookings/:id` does not verify the booking belongs to the
caller's tenant.
File: `server/src/routes/bookings.ts`, `server/src/services/booking-service.ts`
Why: Knowing a booking ID is enough to read another tenant's booking.
Sev: critical
Fix: In service layer check that the booking is part of the correct tenant

What: `PATCH /api/bookings/:id/status` does not verify the booking belongs to
the caller's tenant.
File: `server/src/routes/bookings.ts`, `server/src/services/booking-service.ts`
Why: Any user who knows a booking ID can change another tenant's booking status.
Sev: critical
Fix: In service layer check that the booking is part of the correct tenant

What: `POST /api/bookings` does not verify that `petId`/`sitterId` exist or
belong to the authenticated tenant.
File: `server/src/services/booking-service.ts`
Why: Cross-tenant or bogus IDs can create orphan or inconsistent bookings.
Sev: critical
Fix: Add check for pet and sitter and cross reference their tenant. Also confirm the sitter and pet are part of the specific booking

### CRITICAL — Double-booking (incident #2)

What: Overlap detection is incorrect — it only checks sitter conflicts and
never checks whether the pet is already booked. Interval logic is also
incomplete (overnight slots, boundary cases).
File: `server/src/services/booking-service.ts`
Why: This is the reported incident — two sitters assigned to the same
pet at the same time. Also misses overlapping sitter slots at boundaries.
Sev: critical
Fix: Filter bookings for pet as well as sitter. Then fix the issues with the interval logic. If a booking crosses the midnight boundary we must make sure the end date is on the next day.

What: Overlap check uses `store.getAllBookings()` instead of scoping to the
tenant (and the relevant sitter/date window).
File: `server/src/services/booking-service.ts`
Why: Wrong scope and unnecessary work; tenant isolation should be enforced in
the query itself.
Sev: high
Fix: Add tenant check to filter for getAllBookings

### CRITICAL — Authentication & identity

What: Auth does not authenticate anyone — headers are trusted with no token,
password, or signature.
File: `server/src/middleware/auth.ts`
Why: Acceptable as a challenge stub, but must not ship as-is. Flagging so the
boundary is explicit.
Sev: critical (noted as intended stub)

What: `userId` is accepted from headers but never verified as a valid user for
the tenant (only `tenantId` is checked against the store).
File: `server/src/middleware/auth.ts`
Why: Callers can impersonate arbitrary user IDs within a valid tenant.
Sev: critical

### HIGH — Other defects

What: Date filtering uses `scheduledDate.startsWith(date)` on ISO strings.
File: `server/src/services/booking-service.ts`
Why: Timezone boundaries break prefix matching (see seed comments on
`booking_006` / `booking_011`); bookings appear on the wrong day or vanish from
filtered views.
Sev: high

What: Pagination offset is computed as `page * limit` while `page` is 1-based
from the client.
File: `server/src/services/booking-service.ts`
Why: Page 1 skips the first `limit` rows; every page returns the wrong slice.
Sev: high

What: Pet and booking `notes` are stored and returned as raw strings; seed data
includes HTML/script payloads.
File: `server/src/store/seed.ts`, API responses
Why: Stored XSS. The render site that executes this is `renderBookings` in the
client (see Frontend Approach) — the API should sanitize and/or clients must
escape.
Sev: high

What: Scheduling/audit timestamps are modeled as `string` instead of a date
type in the domain.
File: `server/src/types/index.ts`, services
Why: A scheduling app should model dates/times in the domain to avoid repeated
parsing and fragile string comparisons (e.g. the `startsWith` bug above).
Sev: high

### MEDIUM — Cross-cutting API issues (apply to all booking & pet routes)

What: No request validation at the API boundary (body, query, params). This
includes unbounded/unchecked `page` & `limit`, `status` accepted as a free
string, and `date` passed through untyped.
File: `server/src/routes/bookings.ts`, `server/src/routes/pets.ts`
Why: Malformed or malicious input reaches the services and store unchecked;
invalid enums/dates should be rejected at the seam, not deep in filtering.
Sev: medium (high where it touches pets/bookings reads)

What: HTTP semantics are inconsistent — routes return `200` for errors and
missing resources (`POST`/`PATCH` return `{ success: false }` with `200`;
`GET /:id` returns `200` with `{ error: 'not found' }` instead of `404`).
File: `server/src/routes/bookings.ts`, `server/src/routes/pets.ts`
Why: The docs describe a REST API; clients expect `4xx`/`5xx` and `404` for
missing resources. `200` should mean a verified success.
Sev: medium

What: Handlers rely on `as` casts for params/query/body and attach auth via
`(request as any).auth` instead of Fastify generics / JSON Schema / request
augmentation.
File: `server/src/middleware/auth.ts`, `server/src/routes/*.ts`
Why: Bypasses type safety; typed routing or schema validation would catch
misuse at compile time and supports a no-`as` lint rule.
Sev: medium

What: `X-User-Role` is not validated against allowed values before being cast
to `AuthContext['role']`.
File: `server/src/middleware/auth.ts`
Why: Unknown roles slip through; authorization logic can't rely on a closed set.
Sev: medium

What: Status changes overwrite the booking record with no status history or
audit trail.
File: `server/src/services/booking-service.ts`
Why: Can't reconstruct who changed what or roll back; weak for compliance and
debugging.
Sev: medium

What: Host, port, and listen options are hard-coded rather than read from
config/env.
File: `server/src/index.ts`
Why: Environment-specific deploys need external configuration.
Sev: medium

What: No companion input type (e.g. `PagingParams`) for list requests to pair
with the existing `PaginatedResult<T>`.
File: `server/src/types/index.ts`
Why: Shared pagination types reduce duplication and casting.
Sev: medium

### NEEDS-CLARIFICATION — possible owner-scoping gap

What: `GET /api/pets/:id` checks tenant but not whether the caller owns (or is
otherwise authorized for) that pet.
File: `server/src/routes/pets.ts`
Why: Depends on intended access model. If this is a staff-only admin dashboard,
tenant-wide pet access may be intended and this is fine. If a customer-facing
per-owner view exists, owner-scoped access needs an explicit check. The reported
incident was a customer seeing another customer's bookings, which tenant + owner
scoping on bookings already addresses. Flagging the assumption rather than
asserting a bug.
Sev: medium (conditional on access model)

### LOW — Code quality & preferences (not incident-related)

What: Date/time logic uses ad hoc `Date`/string handling. Consider a
timezone-aware library and consistent domain date types.
File: `server/src/services/booking-service.ts`
Why: Reduces the class of subtle scheduling bugs like the `startsWith` issue
above. (The bug itself is High and logged separately; this is the preventative
recommendation.)
Sev: low (preference / hardening)

What: Event-bus subscribers are registered at module-import time rather than
during server startup.
File: `server/src/services/event-emitter.ts`, `server/src/index.ts`
Why: Wiring lifecycle to bootstrap keeps orchestration clearer as more services
emit/listen. Works fine as-is — this is organizational, not a defect.
Sev: low

What: Event handlers use `any` for event payloads.
File: `server/src/services/event-emitter.ts`
Why: Loses type safety for domain events; harder to evolve the contract safely.
Sev: low

What: `catch (error: any)` exposes raw `error.message` in responses.
File: `server/src/routes/bookings.ts`
Why: Leaks implementation detail; map to stable, client-safe error shapes.
Sev: low

What: Route definitions and handler logic live in the same files; no separate
route table / controllers, no shared per-handler wrapper to reassert auth and
boilerplate.
File: `server/src/routes/*.ts`
Why: Harder to scan, test, and apply guards consistently.
Sev: low

What: Admin and staff share routes and a single `AuthContext` shape; the
`/api/` path guard lives in bootstrap rather than the auth middleware.
File: `server/src/middleware/auth.ts`, `server/src/index.ts`, `server/src/routes/*.ts`
Why: Role-scoped entry points and centralized auth behavior reduce accidental
cross-role access and keep bootstrap focused on wiring.
Sev: low

## API Design

The API has REST correctness issues: success and failure both return 200 (errors come back as { success: false } or { error } with a 200 status), and missing resources return 200 rather than 404. The ideally the fix would be aligning status to outcome — 400 for invalid input, 404 for missing/cross-tenant resources, 409 for booking conflicts, 5xx only for genuine server faults. I implemented request validation at the boundary (JSON Schema on POST /bookings) so malformed input is rejected/normalized before it reaches the service. For errors, I'd try to standardize on one consistent error shape for all endpoints.
RFC 7807 (application/problem+json) makes more sense once there are external/third-party consumers but at this point it would likely be premature.

## Architecture Observations

The Feature segregation is good: auth in middleware, bookings vs. pets as separate verticals, but within the vertical the layers get coupled. The service depends directly on the concrete store, mixing business rules with data access; routes combine routing and handler logic; and tenant authorization was enforced inconsistently across route and service layers (I moved it into the service so it's a single enforced invariant).

The highest-value structural changes: (1) a repository abstraction so the service depends on an interface, not the in-memory store — this is also the precondition for swapping in a real database; (2) modeling dates/times as proper types rather than strings, and giving bookings a real start/end rather than a single scheduledDate, so multi-day and timezone cases stop being bugs.

Currently the domain would be considered anemic at best, which is fine for the stage the application is at. The above changes would go a long way to setting the stage for introducing a richer domain which models invariants such as no overlapping bookings or valid status transitions and enforces them as part of the model. There is already a concept of domain events which may be a bit premature but is a good pattern to be aware of and be ready to take advantage of when the need arises.

## Frontend Approach

I made minimal frontend changes — the one real fix was a race condition behind the "filters reset randomly" issue: the 15s poll and filter changes both call fetchBookings with no sequencing, so a stale response could repaint over a newer one. I guarded it with a request index so only the latest request renders. I also flagged that renderBookings injects notes into innerHTML unescaped — the render site for the backend XSS finding.
For production I'd use React with a data-fetching library e.g. TanStack Query. The race I fixed by hand is exactly the class of bug those handle natively — request dedup, cancellation, stale-response resolution. A framework handles a considerable number of safety behaviors by default so the code can concern itself with higher level issues.

### Findings (audit)

What: `fetchBookings` is async with no request sequencing, while a 15-second
poll and user filter changes both call it. Responses can resolve out of order,
so a slower/older request (typically the background poll) repaints stale,
unfiltered data over a freshly filtered view. The filter dropdowns keep their
values but the list reverts — matching the "filters reset randomly" report.
File: `client/app.js` (`fetchBookings`, the `setInterval` poll)
Why: Race between concurrent fetches; last-to-resolve wins regardless of which
was requested most recently. The poll makes it intermittent and unpredictable.
Sev: high
Fix: Guard each fetch with a request id and ignore superseded
responses (or use `AbortController` to cancel in-flight requests). The handler
already snapshots `currentFilters` as a parameter, which is the right shape to
build on.

What: `renderBookings` interpolates `booking.notes` (and `petId`/`sitterId`)
straight into `innerHTML`.
File: `client/app.js`
Why: This is the execution site for the stored-XSS finding in the audit — seed
notes contain script payloads that run here. Escape on render or sanitize
server-side.
Sev: high

What: Pagination buttons use inline `onclick="goToPage(...)"` (requiring a
global) while status buttons use `addEventListener`.
File: `client/app.js`
Why: Inconsistent event handling; the inline-handler path needs a global and is
harder to maintain/CSP-harden.
Sev: low

## Improvement Implemented

I implemented the JSON schema validation on the booking post. That end point is arguably the most important one and it serves as a proof of concept and template for implementing the rest of the end points. I chose this task as it was not as involved as the others but represented a high value because one pattern resolves several of the findings. Furthermore, maintaining the integrity of the system starts at the seams. It can easily be extended to the other endpoints validating the query string parameters and the url parameters closing the loop on a number of potential bugs.

## Improvements Proposed

What: Replace ad-hoc date handling and manipulation with consistent date type usage starting at the seams, the request and database. Native date type or a modern date library would be recommended
Why: This will avoid a number of different bugs (startsWith issue, multi day overlap issue), and reduce mental overhead.
Effort: Moderate. Dates are tricky to deal with, which is exactly the reason for this suggestion. Using a date library will reduce some of the friction due to superior apis, but the updates will require thorough testing
Trade-offs: Moving to proper and consistent date type usage seems important enough, that it's not about whether to do it, it's about whether to use a library or native date type. Native date type can definitely work, however, as you can see from the "add 1 day" implementation it is far from intuitive. There are several new date libraries that replace moment and are much more light weight. That said, there is also a new native date api "Temporal" that is available in the latest versions of browsers and node 26+. If the app is currently using node 26 I would recommend using temporal, otherwise, I would suggest using a library.

What: Implement the repository pattern. Add a layer of abstraction between the service logic and the database.
Why: Currently the app is using an in-memory database. That database needs to be replaced with something more durable in production. With data access sprinkled through the service logic replacing the data storage will mean touching important sensitive business logic that really shouldn't be concerned with where the data comes from. On the same note, removing the data access logic from the business logic will make the logic easier to think about, reducing bugs, easy to test by creating a seam for mock implementations and more portable.
Effort: Moderate. The effort will be in extracting the logic, but it will generally not require much new logic so it would be largely mechanical
Trade-offs: The app has been reaping the benefits of not using the pattern, which are largely around rapid development. Should the app undergo much or any growth, those benefits will start to be liabilities. If the in-memory database is going to be replaced then that would be the appropriate time to implement the pattern as all the data access logic will be being touched anyway. Otherwise, I would suggest implementing the pattern iteratively as features are touched/changed.

## AI Usage

The full initial backend audit, all the findings and reasoning I did myself which took over an hour. I then gave it to cursor to clean up the writing and catch any gaps. Cursor found an additional 5 or 6 issues which I reviewed against the code. The bug fixes and implemented improvement I coded my self, although there were probably some auto complete help involved there. I always check autocomplete though because it tends to want to do way more than you want or expect.
I used Claude as a reviewer/sounding board on the Decisions.md, consolidating findings, reviewing severity rankings etc. There are always back and forth discussion with Claude about the best/correct way to do things. There were a couple of severity ratings where we disagreed, and I also had to push back on what validations should go into the bookings endpoint schema to name a few.
The analysis, architecture and DDD opinions I wrote on my own as those are the important decisions that I've made that I will have to be able to speak to.
