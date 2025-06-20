# Token Action Management System

## Overview

The Token Action Management System provides comprehensive control over token-based services in the application. Superusers can create, edit, delete, and lock token actions through an intuitive admin interface.

## Features

### 🔐 **Lock System**

- **Locked Actions**: Prevent modifications to critical actions
- **Visual Indicators**: Clear UI showing locked status
- **Toggle Control**: Easy lock/unlock functionality
- **Core Protection**: Core actions are locked by default

### 🗑️ **Delete System**

- **Safe Deletion**: Confirmation dialogs for all deletions
- **Lock Protection**: Cannot delete locked actions
- **Core Protection**: Core actions cannot be deleted
- **Visual Feedback**: Clear error messages for blocked operations

### ✨ **Create System**

- **Dynamic Creation**: Create new services without code changes
- **Lock Option**: Set initial lock status during creation (default: locked)
- **Validation**: Comprehensive input validation
- **Categories**: Organized by service type

## Admin Panel Access

### Prerequisites

1. **Superuser Access**: Must be logged in with superuser email
2. **Environment Setup**: `VITE_SUPER_USER` configured in `.env`

### Access Methods

- **Direct URL**: Navigate to `/admin`
- **Navigation**: Click "Admin" in main navigation (superusers only)
- **User Menu**: "Admin Panel" in user dropdown (superusers only)

## Token Action Types

### Core Actions (Locked by Default)

- `resume_enhancement` - Resume Enhancement (₹19)
- `resume_analysis` - Resume Analysis (₹5)
- `template_download` - Template Download (₹10)
- `premium_consultation` - Premium Consultation (₹50)

### Custom Actions

- Created by superusers
- Can be locked/unlocked
- Can be deleted (if not locked)
- Flexible configuration

## Management Operations

### Creating New Actions

1. **Access Admin Panel**: Login as superuser and navigate to `/admin`
2. **Click "Create Action"**: Opens creation modal
3. **Fill Required Fields**:
   - **Action ID**: Unique identifier (lowercase, underscores)
   - **Name**: Display name for the action
   - **Description**: Detailed description
   - **Category**: Service category (resume, analysis, template, premium, custom)
   - **Token Amount**: Cost in rupees (₹)
   - **Lock Status**: Initial lock setting (default: locked for security)
4. **Submit**: Creates the action immediately

### Editing Actions

1. **Find Action**: Locate action in admin panel
2. **Click Edit**: Pencil icon (only for unlocked actions)
3. **Modify Amount**: Change token cost
4. **Save**: Updates immediately

### Locking/Unlocking Actions

1. **Find Action**: Locate action in admin panel
2. **Click Lock/Unlock**: Lock/Unlock icon
3. **Confirm**: Action status toggles immediately

**Locked Actions**:

- ❌ Cannot be edited
- ❌ Cannot be deleted
- ✅ Can be unlocked
- 🔴 Visual red background indicator
- 🔒 Lock icon with "Locked" badge

**Unlocked Actions**:

- ✅ Can be edited
- ✅ Can be deleted (if not core)
- ✅ Can be locked
- ⚪ Normal background
- 🔓 Unlock icon with "Unlocked" badge

### Deleting Actions

1. **Find Action**: Locate action in admin panel
2. **Click Delete**: Trash icon (only for unlocked, non-core actions)
3. **Confirm**: Confirmation dialog appears
4. **Delete**: Action removed immediately

**Deletion Restrictions**:

- ❌ Core actions cannot be deleted
- ❌ Locked actions cannot be deleted
- ✅ Custom unlocked actions can be deleted

## Security Features

### Access Control

- **Superuser Only**: Admin panel requires superuser email
- **Authentication Required**: Must be logged in
- **Route Protection**: `/admin` route protected by `SuperUserRoute`

### Data Protection

- **Lock System**: Prevents accidental modifications
- **Core Protection**: Essential actions cannot be deleted
- **Validation**: Input validation on all operations
- **Error Handling**: Comprehensive error messages

### Audit Trail

- **Logging**: All operations logged in backend
- **User Tracking**: Operations tied to authenticated user
- **Timestamps**: All changes timestamped

## API Endpoints

### Token Actions

- `GET /token/actions` - Get all actions
- `POST /token/actions` - Create new action
- `PUT /token/actions/{id}/amount` - Update amount
- `DELETE /token/actions/{id}` - Delete action
- `POST /token/actions/{id}/toggle-lock` - Toggle lock status
- `GET /token/actions/{id}/lock-status` - Get lock status

### Response Format

```json
{
  "action_id": "custom_service",
  "amount": 25,
  "name": "Custom Service",
  "description": "Description of the service",
  "category": "custom",
  "locked": false
}
```

## Best Practices

### Creating Actions

1. **Use Descriptive IDs**: `custom_interview_prep` not `service1`
2. **Clear Names**: User-friendly display names
3. **Detailed Descriptions**: Explain what the service does
4. **Appropriate Categories**: Choose the right category
5. **Reasonable Pricing**: Set fair token amounts
6. **Default Security**: New actions are locked by default for safety

### Managing Actions

1. **Lock Critical Actions**: Lock actions that shouldn't be modified (default behavior)
2. **Regular Review**: Periodically review action configurations
3. **Backup Before Changes**: Document changes before making them
4. **Test New Actions**: Verify new actions work correctly
5. **Unlock When Needed**: Only unlock actions that need modification

### Security

1. **Limit Superusers**: Only grant superuser access to trusted users
2. **Monitor Changes**: Keep track of configuration changes
3. **Lock Production Actions**: Lock actions in production environments (default)
4. **Regular Audits**: Review action configurations regularly
5. **Default Lock**: New actions are locked by default for security

## Troubleshooting

### Common Issues

**"Action is locked" Error**

- Solution: Unlock the action first, then modify
- Prevention: Be careful when locking actions

**"Cannot delete core action" Error**

- Solution: Core actions cannot be deleted
- Alternative: Lock the action instead

**"Invalid action ID" Error**

- Solution: Use lowercase with underscores only
- Example: `custom_service` not `Custom Service`

**"Token amount must be greater than 0" Error**

- Solution: Set a positive token amount
- Minimum: 1 token

### Support

- Check admin panel for visual indicators
- Review error messages for specific issues
- Contact system administrator for complex problems
