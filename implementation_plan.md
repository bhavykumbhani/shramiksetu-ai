# Admin "Command Center" Overhaul

## Goal Description
Transform the current Admin Dashboard from a simple analytics overview into a fully functional "Command Center". The Admin needs the ability to deeply analyze all platform data (Workers, Contractors, Jobs, Grievances), directly intervene by messaging workers, and manage platform health (resolving grievances, monitoring jobs).

> [!IMPORTANT]
> ## User Review Required
> 1. **Messaging UI:** When an Admin sends a message to a worker, is it acceptable for it to appear in the Worker's existing Notification Bell (with a special red "URGENT: Admin Message" highlight), or do you want to build a completely separate "Inbox/Chat" page for workers? *Using the existing notification system will be much faster and cleaner.*
> 2. **Grievance Resolution:** When an Admin marks a Grievance as "Resolved", should the system automatically send a message to the worker notifying them?

## Open Questions
- Do you want Admins to have the power to forcefully delete a Contractor's Job Post if it violates labor laws? (We will build a "Hide Job" button for this).

---

## Proposed Changes

### 1. Backend APIs (Data Access & Actions)
We will create secure endpoints that only `ADMIN` roles can access.

#### [NEW] `src/app/api/admin/workers/route.ts`
- **GET:** Fetch a comprehensive, paginated list of all registered workers, their skills, and their employment snapshots.

#### [NEW] `src/app/api/admin/message/route.ts`
- **POST:** Allows the admin to send a direct message. This will create a `Notification` record (type: `ADMIN_MESSAGE`) tied to the target worker's `user_id`.

#### [NEW] `src/app/api/admin/grievances/[id]/route.ts`
- **PUT:** Allows the admin to update a grievance status (e.g., from `OPEN` to `RESOLVED` or `IN_PROGRESS`).

---

### 2. Admin Command Center UI

#### [MODIFY] `src/app/admin/dashboard/page.tsx`
We will rewrite the single-page dashboard into a professional **Sidebar Layout** with multiple tabs:

1. **📊 Analytics Tab (Default):** 
   - Retain the current District Risk Index and high-level metric cards.
   
2. **👷 Worker Directory Tab:** 
   - A detailed data grid listing all workers.
   - Includes a **"Send Message"** button next to each worker. Clicking it opens a modal allowing the admin to type a custom message (e.g., *"We noticed your wage complaint. Please visit the labor office on Monday."*) which is instantly delivered to the worker.

3. **⚖️ Grievance Desk Tab:**
   - A Kanban-style or list view of all grievances.
   - Admins can click a grievance, read the full description, and change its status to `RESOLVED`.
   
4. **🏢 Job Market Tab:**
   - A live feed of all Job Posts broadcasted by contractors to monitor the labor market and ensure fair wages are being offered.

---

## Verification Plan

### Automated/API Verification
- Verify that non-admin users (Workers/Contractors) receive a `403 Forbidden` if they try to hit the new `/api/admin/*` routes.

### Manual Verification
1. Log in as Admin.
2. Navigate to the "Worker Directory" tab.
3. Select a worker and send a custom direct message.
4. Log out, and log back in as that specific Worker.
5. Verify the Worker's dashboard notification bell receives the Admin message. 
6. Log back in as Admin, go to Grievance Desk, and resolve an open grievance.
