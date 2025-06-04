

### 🧪 Testing the API

* **Retrieve Users with Pagination:**

  ```bash
  curl "http://localhost:5000/users?skip=0&limit=10"
  ```

* **Bulk Update Specific Users:**

  ```bash
  curl -X PUT "http://localhost:5000/users/bulk-update" \
       -H "Content-Type: application/json" \
       -d '{
             "all": false,
             "ids": [1, 2],
             "payload": {"active": false}
           }'
  ```

* **Bulk Update All Users Matching Filters:**

  ```bash
  curl -X PUT "http://localhost:5000/users/bulk-update" \
       -H "Content-Type: application/json" \
       -d '{
             "all": true,
             "filters": {"active": true},
             "payload": {"active": false}
           }'
  ```

