# TODO: Implement Add Employee Form Posting to Database

- [x] Update frontend/src/components/admin/forms/AddEmployee.tsx: Change status 'On Leave' to 'Inactive', role 'Cleaner' to 'Housekeeping'
- [x] Add addNewEmployee function in backend/controllers/adminController.js: Validate fields, create Employee with society ID, save to DB
- [x] Add POST /admin/addNewEmployee route in backend/routes/admin.js with isAuthenticated middleware
- [x] Create Next.js API route at /api/admin/addNewEmployee to proxy requests with authentication
- [x] Update frontend form to use Next.js API route instead of direct backend call
- [x] Test form submission to ensure data posts correctly to the database
