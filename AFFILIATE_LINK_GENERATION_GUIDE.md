# Affiliate Link Generation - Implementation Guide

## Overview

The TripWiser Admin Dashboard now includes a complete affiliate link generation system that allows admins to create and manage two types of affiliate links:

1. **Elite Gift Links** - Special promotional links that grant Elite plan access
2. **Influencer Links** - User-specific affiliate links for tracking referrals

## Features Implemented

### ✅ Link Generation
- **Elite Gift Link Generation**: Create promotional links with optional usage limits and expiration dates
- **Influencer Link Generation**: Create user-specific affiliate links with user search functionality
- **User Search**: Real-time search to find users by name or email for influencer link creation

### ✅ Link Management
- **View All Links**: Comprehensive table view of all generated affiliate links
- **Filter & Search**: Filter by type (elite_gift/influencer) and status (active/inactive)
- **Toggle Status**: Enable/disable links with a single click
- **Copy Links**: One-click copy to clipboard functionality
- **Usage Tracking**: Visual progress bars showing link usage vs. limits

### ✅ Analytics & Monitoring
- **Overview Dashboard**: Key metrics for elite gifts, referrals, and conversions
- **Recent Activity**: Quick view of latest link activities
- **Top Influencers**: Leaderboard of top performing users
- **Conversion Trends**: Visual analytics for tracking performance

## Backend Integration

### API Endpoints Used

#### 1. Generate Elite Gift Link
```http
POST https://tripwiser-backend.onrender.com/api/affiliate/generate-elite-link
Authorization: Bearer <firebase-token>
Content-Type: application/json

Request Body:
{
  "maxUses": 100,              // Optional - leave out for unlimited
  "expiresAt": "2025-12-31T23:59:59Z"  // Optional - ISO 8601 format
}

Response:
{
  "success": true,
  "message": "Elite gift link generated successfully",
  "data": {
    "affiliateLink": {
      "id": "68f00bd053bb47f20c175d0d",
      "type": "elite_gift",
      "deepLink": "https://tripwiser-web-lmgo.vercel.app/register?affiliate=elite&linkId=68f00bd053bb47f20c175d0d",
      "expiresAt": "2025-12-31T23:59:59Z",
      "maxUses": 100,
      "usedCount": 0,
      "isActive": true
    }
  }
}
```

#### 2. Generate Influencer Link
```http
POST https://tripwiser-backend.onrender.com/api/affiliate/generate-influencer-link
Authorization: Bearer <firebase-token>
Content-Type: application/json

Request Body:
{
  "influencerId": "68d1945f1d6c532dfbd6ce27",  // Required - user ID
  "maxUses": 500,              // Optional
  "expiresAt": "2025-12-31T23:59:59Z"  // Optional
}

Response:
{
  "success": true,
  "message": "Influencer affiliate link generated successfully",
  "data": {
    "affiliateLink": {
      "id": "68f00bd153bb47f20c175d0e",
      "type": "influencer",
      "influencerId": "68d1945f1d6c532dfbd6ce27",
      "influencerName": "John Doe",
      "deepLink": "https://tripwiser-web-lmgo.vercel.app/register?affiliate=influencer&id=68d1945f1d6c532dfbd6ce27",
      "maxUses": 500,
      "usedCount": 0,
      "isActive": true
    }
  }
}
```

#### 3. Additional Endpoints
- `GET /admin/affiliate/links` - Fetch all affiliate links with filtering
- `PUT /admin/affiliate/links/:id/toggle` - Toggle link active status
- `GET /admin/affiliate/overview` - Get affiliate analytics
- `GET /users/search` - Search users for influencer link creation

## How to Use

### Generating an Elite Gift Link

1. Navigate to the **Affiliate System** from the main dashboard
2. Click on the **Generate Links** tab
3. In the **Elite Gift Link** form:
   - **Usage Limit** (optional): Set maximum number of uses (leave empty for unlimited)
   - **Expiration Date** (optional): Set when the link should expire
   - **Description** (optional): Add a note for internal tracking
4. Click **Generate Elite Gift Link**
5. Copy the generated link from the modal

### Generating an Influencer Link

1. Navigate to the **Affiliate System** from the main dashboard
2. Click on the **Generate Links** tab
3. In the **User Affiliate Link** form:
   - **Search User**: Type the user's name or email
   - Select the user from the dropdown results
   - **Usage Limit** (optional): Set maximum number of uses
   - **Expiration Date** (optional): Set when the link should expire
   - **Description** (optional): Add a note for internal tracking
4. Click **Generate User Affiliate Link**
5. Copy the generated link from the modal

### Managing Links

1. Navigate to the **Manage Links** tab
2. Use filters to find specific links:
   - Filter by **Type**: All, Elite Gift, or Influencer
   - Filter by **Status**: All, Active, or Inactive
   - **Search**: Find links by description or user name/email
3. Actions available for each link:
   - **Copy**: Copy the link to clipboard
   - **Toggle Status**: Enable or disable the link

### Viewing Analytics

1. Navigate to the **Overview** tab for key metrics:
   - Total elite gifts given
   - Total user referrals
   - Total links generated
   - Active links count
2. View **Recent Activity** for latest link usage
3. Check **Top Users** leaderboard
4. Navigate to the **Analytics** tab for detailed performance metrics

## Technical Implementation

### Files Modified

1. **`src/services/api.ts`**
   - Added `generateEliteGiftLink()` method
   - Added `generateInfluencerLink()` method
   - Implemented date formatting to ISO 8601 for backend compatibility
   - Request body formatting to match backend expectations

2. **`src/types/index.ts`**
   - Updated `AffiliateLink` interface to support both `id` and `_id` fields
   - Added `influencerName` field for backend compatibility
   - Made optional fields properly typed

3. **`src/components/AffiliateDashboard.tsx`**
   - Updated link display logic to handle `id` and `_id` fields
   - Enhanced influencer name display with fallbacks
   - Improved error handling for missing data
   - Added proper key handling for React lists

4. **`API_ENDPOINTS.txt`**
   - Documented all affiliate system endpoints
   - Updated endpoint usage count

### Key Features

#### Date Handling
The system automatically converts datetime-local input (e.g., `2025-12-31T23:59`) to ISO 8601 format (`2025-12-31T23:59:59.000Z`) as required by the backend.

#### User Search
- Real-time search with 300ms debounce
- Minimum 2 characters required
- Displays user name, email, and plan
- Visual feedback during search

#### Link Display
- Handles both MongoDB `_id` and backend response `id` fields
- Displays influencer names when available
- Shows user IDs as fallback
- Usage progress bars for visual tracking

#### Copy to Clipboard
- Primary: Uses modern Clipboard API
- Fallback: Uses older `execCommand` for browser compatibility
- User feedback via alerts

## Security

- All endpoints require Firebase authentication
- JWT token automatically included in requests via interceptors
- Token refresh handled automatically
- Unauthorized access redirects to login

## Future Enhancements

Potential improvements for future iterations:

1. **Analytics Charts**: Integrate charting library for visual trends
2. **Bulk Link Generation**: Create multiple links at once
3. **Link QR Codes**: Generate QR codes for links
4. **Email Sharing**: Send links directly to influencers via email
5. **Link Performance Reports**: Export detailed analytics
6. **Custom Link Aliases**: Create memorable short URLs
7. **Webhook Notifications**: Real-time alerts for link usage

## Troubleshooting

### Link not generating
- Verify Firebase authentication token is valid
- Check browser console for API errors
- Ensure backend API is accessible

### User search not working
- Verify at least 2 characters are entered
- Check network requests in browser DevTools
- Ensure `/users/search` endpoint is accessible

### Copy to clipboard failing
- Check browser permissions for clipboard access
- Use the fallback manual copy if automatic copy fails
- Ensure using HTTPS (required for Clipboard API)

## Support

For issues or questions:
1. Check browser console for detailed error messages
2. Verify API endpoint accessibility
3. Ensure Firebase authentication is working
4. Review network requests in browser DevTools

---

**Last Updated**: October 15, 2025
**Version**: 1.0.0

