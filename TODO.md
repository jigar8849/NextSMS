# TODO for Resident Billing Real Data Implementation

## Backend Changes
- [ ] Add getBills function in backend/controllers/residentController.js to fetch ResidentBill for logged-in resident, populate billTemplate, map to frontend format.
- [ ] Add GET /api/bills route in backend/routes/resident.js, using isAuthenticated middleware.

## Frontend Changes
- [ ] Create frontend/src/app/api/resident/bills/route.ts to proxy GET request to backend /resident/api/bills.
- [ ] Update frontend/src/components/resident/Billing.tsx to fetch bills from /api/resident/bills using useEffect, replace DEMO_BILLS with fetched data, handle loading and errors.

## Testing
- [ ] Test the API endpoint for fetching bills.
- [ ] Verify authentication and data display in the resident billing page.
