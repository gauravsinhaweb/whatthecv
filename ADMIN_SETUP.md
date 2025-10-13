# Admin Panel Setup

## Superuser Configuration

To enable admin access, set the `VITE_SUPER_USER` environment variable with a comma-separated list of email addresses that should have admin privileges.

### Environment Variable Setup

Create a `.env` file in the root directory of the frontend project with:

```env
VITE_SUPER_USER=sinhagaurav.me@gmail.com,poojasinha.me@gmail.com
```

### Accessing the Admin Panel

1. **Login** with one of the configured superuser email addresses
2. **Navigate** to `/admin` or click the "Admin" link in the navigation
3. **Manage** token amounts and other admin functions

### Features

- **Token Management**: Update token amounts for different actions
- **Access Control**: Only superusers can access the admin panel
- **Real-time Updates**: Changes are reflected immediately

### Security

- Admin access is controlled by email verification
- Only authenticated users with superuser emails can access `/admin`
- All admin actions are logged and validated
