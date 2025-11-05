# TODO: Integrate CreateBill Form with Backend

## Steps to Complete

1. **Add createBill function in adminController.js**
   - Import AdminBillTemplate model
   - Create async function createBill
   - Validate required fields: title, type, amount, dueDate
   - Parse amount and penalty to numbers
   - Set createdBy to req.user._id
   - Save new bill to DB
   - Return success response or error

2. **Add POST /createBill route in admin.js**
   - Import adminController.createBill
   - Add router.post('/createBill', isAuthenticated, adminController.createBill);

3. **Test the integration**
   - Run backend server
   - Submit form from frontend
   - Check if bill is created in DB
   - Verify redirect to /admin/payments

## Progress
- [x] Step 1: Add createBill function
- [x] Step 2: Add route
- [x] Step 3: Test integration
