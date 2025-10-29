# TripWiser Admin Routes Documentation

Complete documentation for all admin endpoints in the TripWiser Backend API.

## Table of Contents

1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Trip Management](#trip-management)
4. [Analytics & Statistics](#analytics--statistics)
5. [System Monitoring](#system-monitoring)
6. [Notifications](#notifications)
7. [Payment Management](#payment-management)
8. [Content Moderation](#content-moderation)
9. [Affiliate Management](#affiliate-management)

---

## Authentication

All admin routes require admin authentication via the `adminMiddleware`.

### Admin Access Control

**Admin Emails** are configured via environment variable or default values:
- Environment: `ADMIN_EMAILS` (comma-separated list)
- Default: `sachamarciano9@gmail.com, ron12390@gmail.com`

**Headers Required:**
```
Authorization: Bearer <firebase_id_token>
```

**Authentication Flow:**
1. Verifies Firebase ID token
2. Looks up user in database by `firebaseUid`
3. Auto-creates user if not found in DB
4. Checks if user email is in admin list
5. Returns 403 if not authorized as admin

**Response Codes:**
- `200` - Success
- `401` - No token / Invalid token / Token expired
- `403` - User is not an admin
- `500` - Server error

---

## User Management

### 1. Get All Users

**Endpoint:** `GET /api/admin/users`

**Description:** Retrieve paginated list of all users with filtering and sorting options.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | Number | 1 | Page number |
| `limit` | Number | 20 | Results per page |
| `search` | String | "" | Search by name or email (case-insensitive) |
| `plan` | String | "" | Filter by plan (free, pro, elite) |
| `sortBy` | String | "created_at" | Sort field |
| `sortOrder` | String | "desc" | Sort order (asc/desc) |

**Example Request:**
```bash
GET /api/admin/users?page=1&limit=20&plan=pro&sortBy=created_at&sortOrder=desc
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "plan": "pro",
        "auth_provider": "firebase",
        "created_at": "2025-01-15T12:00:00Z",
        "avatar": "https://...",
        "bio": "Travel enthusiast",
        "firebaseUid": "firebase_uid_123"
      }
    ],
    "pagination": {
      "current": 1,
      "pages": 5,
      "total": 100,
      "limit": 20
    },
    "stats": {
      "total": 100,
      "plans": {
        "free": 50,
        "pro": 30,
        "elite": 20
      }
    }
  }
}
```

---

### 2. Get User by ID

**Endpoint:** `GET /api/admin/users/:id`

**Description:** Get detailed information about a specific user, including related stats.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | String | User MongoDB ObjectId |

**Example Request:**
```bash
GET /api/admin/users/507f1f77bcf86cd799439011
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User details retrieved successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "plan": "pro",
      "auth_provider": "firebase",
      "created_at": "2025-01-15T12:00:00Z",
      "avatar": "https://...",
      "bio": "Travel enthusiast",
      "savedTemplates": [...],
      "savedTips": [...],
      "stats": {
        "tripsCount": 15,
        "notificationsCount": 45,
        "lastPayment": {
          "amount": 9.99,
          "plan": "pro",
          "eventTime": "2025-01-01T00:00:00Z"
        }
      }
    }
  }
}
```

**Error Responses:**
- `400` - Invalid user ID format
- `404` - User not found

---

### 3. Update User

**Endpoint:** `PUT /api/admin/users/:id`

**Description:** Update user information (admin override).

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | String | User MongoDB ObjectId |

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "plan": "elite",
  "bio": "Updated bio",
  "blockedUsers": ["user_id_1", "user_id_2"]
}
```

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String | No | User's display name |
| `email` | String | No | User's email (must be valid format) |
| `plan` | String | No | Subscription plan (free/pro/elite) |
| `bio` | String | No | User biography |
| `blockedUsers` | Array | No | Array of blocked user IDs |

**Success Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "plan": "elite",
      "bio": "Updated bio",
      "auth_provider": "firebase",
      "created_at": "2025-01-15T12:00:00Z",
      "updated_at": "2025-01-20T15:30:00Z"
    }
  }
}
```

**Error Responses:**
- `400` - Invalid user ID or email format, invalid plan value
- `404` - User not found
- `409` - Email already exists

---

### 4. Delete User

**Endpoint:** `DELETE /api/admin/users/:id`

**Description:** Permanently delete a user and all associated data (trips, notifications, payments, reports). Also deletes the user from Firebase Authentication.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | String | User MongoDB ObjectId |

**Example Request:**
```bash
DELETE /api/admin/users/507f1f77bcf86cd799439011
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User and all associated data deleted successfully (MongoDB and Firebase)",
  "data": null
}
```

**What Gets Deleted:**
- User document from MongoDB
- User from Firebase Authentication
- All user's trips
- All user's notifications
- All user's payment history
- All content reports (as reporter or reported user)

**Error Responses:**
- `400` - Invalid user ID format
- `404` - User not found
- `500` - Error during deletion (MongoDB or Firebase)

---

## Trip Management

### 1. Get All Trips

**Endpoint:** `GET /api/admin/trips`

**Description:** Retrieve paginated list of all trips with filtering and sorting.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | Number | 1 | Page number |
| `limit` | Number | 20 | Results per page |
| `search` | String | "" | Search by trip name or destination |
| `destination` | String | "" | Filter by destination |
| `public` | Boolean | - | Filter by public/private status |
| `sortBy` | String | "createdAt" | Sort field |
| `sortOrder` | String | "desc" | Sort order (asc/desc) |

**Example Request:**
```bash
GET /api/admin/trips?page=1&limit=20&public=true&sortBy=likes&sortOrder=desc
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Trips retrieved successfully",
  "data": {
    "trips": [
      {
        "_id": "trip_id",
        "name": "Summer in Paris",
        "destination": "Paris, France",
        "startDate": "2025-06-01T00:00:00Z",
        "endDate": "2025-06-10T00:00:00Z",
        "duration": 10,
        "public": true,
        "likes": 150,
        "shares": 45,
        "user": {
          "_id": "user_id",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "ownerId": {...},
        "collaborators": [...]
      }
    ],
    "pagination": {
      "current": 1,
      "pages": 10,
      "total": 200,
      "limit": 20
    },
    "stats": {
      "totalTrips": 200,
      "publicTrips": 120,
      "privateTrips": 80,
      "totalLikes": 5000,
      "totalShares": 1200
    }
  }
}
```

---

### 2. Get Trip by ID

**Endpoint:** `GET /api/admin/trips/:id`

**Description:** Get detailed information about a specific trip.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | String | Trip MongoDB ObjectId |

**Example Request:**
```bash
GET /api/admin/trips/507f1f77bcf86cd799439011
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Trip details retrieved successfully",
  "data": {
    "trip": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Summer in Paris",
      "destination": "Paris, France",
      "startDate": "2025-06-01T00:00:00Z",
      "endDate": "2025-06-10T00:00:00Z",
      "duration": 10,
      "public": true,
      "completed": false,
      "likes": 150,
      "shares": 45,
      "user": {...},
      "ownerId": {...},
      "collaborators": [...],
      "likedBy": [...],
      "sharedBy": [...],
      "location": {
        "place_id": "...",
        "lat": "48.8566",
        "lon": "2.3522",
        "display_name": "Paris, France",
        "address": {
          "city": "Paris",
          "country": "France",
          "country_code": "FR"
        }
      }
    }
  }
}
```

**Error Responses:**
- `400` - Invalid trip ID format
- `404` - Trip not found

---

### 3. Update Trip

**Endpoint:** `PUT /api/admin/trips/:id`

**Description:** Update trip information (admin override).

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | String | Trip MongoDB ObjectId |

**Request Body:**
```json
{
  "name": "Updated Trip Name",
  "destination": "New Destination",
  "public": true,
  "completed": false
}
```

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String | No | Trip name |
| `destination` | String | No | Trip destination |
| `public` | Boolean | No | Public visibility |
| `completed` | Boolean | No | Completion status |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Trip updated successfully",
  "data": {
    "trip": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Updated Trip Name",
      "destination": "New Destination",
      "public": true,
      "completed": false,
      "user": "user_id",
      "createdAt": "2025-01-15T12:00:00Z",
      "updatedAt": "2025-01-20T15:30:00Z"
    }
  }
}
```

**Error Responses:**
- `400` - Invalid trip ID format
- `404` - Trip not found

---

### 4. Delete Trip

**Endpoint:** `DELETE /api/admin/trips/:id`

**Description:** Permanently delete a trip. Note: Associated packing lists, itineraries, and journals should also be deleted (implementation may vary).

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | String | Trip MongoDB ObjectId |

**Example Request:**
```bash
DELETE /api/admin/trips/507f1f77bcf86cd799439011
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Trip deleted successfully",
  "data": null
}
```

**Error Responses:**
- `400` - Invalid trip ID format
- `404` - Trip not found

---

## Analytics & Statistics

### Get Analytics

**Endpoint:** `GET /api/admin/analytics`

**Description:** Get comprehensive platform statistics and metrics for a specified time period.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `period` | String | "30d" | Time period (7d, 30d, 90d, 1y) |

**Example Request:**
```bash
GET /api/admin/analytics?period=30d
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Analytics retrieved successfully",
  "data": {
    "period": "30d",
    "dateRange": {
      "start": "2024-12-20T00:00:00Z",
      "end": "2025-01-20T00:00:00Z"
    },
    "users": {
      "total": 1500,
      "new": 250,
      "byPlan": {
        "free": 800,
        "pro": 500,
        "elite": 200
      }
    },
    "trips": {
      "total": 3500,
      "new": 450,
      "public": 2100,
      "totalLikes": 15000,
      "totalShares": 4500
    },
    "payments": {
      "byPlan": {
        "pro_ios": {
          "count": 150,
          "revenue": 1499.50
        },
        "elite_android": {
          "count": 75,
          "revenue": 2249.25
        }
      }
    },
    "notifications": {
      "byType": {
        "like": 5000,
        "comment": 2500,
        "follow": 1200,
        "trip_update": 800
      }
    },
    "reports": {
      "byStatus": {
        "pending": 45,
        "resolved": 120,
        "dismissed": 35
      }
    }
  }
}
```

**Analytics Breakdown:**

**Users:**
- `total` - Total registered users
- `new` - New users within the period
- `byPlan` - User distribution by subscription plan

**Trips:**
- `total` - Total trips created
- `new` - New trips within the period
- `public` - Number of public trips
- `totalLikes` - Total likes across all trips
- `totalShares` - Total shares across all trips

**Payments:**
- `byPlan` - Revenue and transaction count by plan and platform
  - Format: `{plan}_{platform}` (e.g., pro_ios, elite_android)
  - `count` - Number of transactions
  - `revenue` - Total revenue amount

**Notifications:**
- `byType` - Notification count by type (like, comment, follow, etc.)

**Reports:**
- `byStatus` - Content reports by status (pending, resolved, dismissed)

---

## System Monitoring

### 1. Get System Health

**Endpoint:** `GET /api/admin/system/health`

**Description:** Get current system health status including database, environment, and memory metrics.

**Example Request:**
```bash
GET /api/admin/system/health
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "System health check completed",
  "data": {
    "status": "healthy",
    "timestamp": "2025-01-20T15:30:00.000Z",
    "database": {
      "status": "connected",
      "readyState": 1
    },
    "environment": {
      "nodeEnv": "production",
      "version": "1.0.0",
      "configured": {
        "mongodb": true,
        "jwt": true,
        "openrouter": true,
        "unsplash": true,
        "weather": true,
        "google": true,
        "apple": true
      }
    },
    "system": {
      "uptime": 86400,
      "memory": {
        "rss": 256,
        "heapTotal": 128,
        "heapUsed": 96,
        "external": 12
      },
      "recentErrors": 3
    }
  }
}
```

**Field Descriptions:**

**Database:**
- `status` - Connection status (connected/disconnected)
- `readyState` - Mongoose connection state (1 = connected)

**Environment:**
- `nodeEnv` - Node environment (development/production)
- `version` - Application version
- `configured` - Boolean flags for each service's environment variables

**System:**
- `uptime` - Server uptime in seconds
- `memory` - Memory usage in MB
  - `rss` - Resident Set Size
  - `heapTotal` - Total heap allocated
  - `heapUsed` - Heap used
  - `external` - External memory usage
- `recentErrors` - Number of errors in recent logs (last 100 lines)

---

### 2. Get System Logs

**Endpoint:** `GET /api/admin/system/logs`

**Description:** Retrieve recent system logs with optional filtering.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `lines` | Number | 100 | Number of log lines to retrieve |
| `level` | String | "all" | Log level filter (all, error, warn, info) |

**Example Request:**
```bash
GET /api/admin/system/logs?lines=50&level=error
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "System logs retrieved successfully",
  "data": {
    "logs": [
      "2025-01-20 15:30:00 [ERROR] Database connection timeout",
      "2025-01-20 15:25:00 [ERROR] Failed to process payment"
    ],
    "file": "server-2025-01-20.log",
    "totalLines": 50,
    "level": "error"
  }
}
```

**If No Logs Available:**
```json
{
  "success": true,
  "message": "No logs available",
  "data": {
    "logs": [],
    "message": "No log directory found"
  }
}
```

---

### 3. Get System Metrics

**Endpoint:** `GET /api/admin/system/metrics`

**Description:** Get detailed system performance metrics including database stats and collection counts.

**Example Request:**
```bash
GET /api/admin/system/metrics
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "System metrics retrieved successfully",
  "data": {
    "timestamp": "2025-01-20T15:30:00.000Z",
    "database": {
      "collections": {
        "users": 1500,
        "trips": 3500,
        "notifications": 25000,
        "payments": 800,
        "reports": 200
      },
      "stats": {
        "dataSize": 512,
        "storageSize": 1024,
        "indexes": 45,
        "objects": 30000
      }
    },
    "system": {
      "uptime": 86400,
      "memory": {
        "rss": 256,
        "heapTotal": 128,
        "heapUsed": 96,
        "external": 12
      }
    },
    "metrics": {
      "avgTripsPerUser": 2.33,
      "avgNotificationsPerUser": 16.67
    }
  }
}
```

**Field Descriptions:**

**Database Collections:**
- Document counts for each collection

**Database Stats:**
- `dataSize` - Actual data size in MB
- `storageSize` - Allocated storage size in MB
- `indexes` - Number of indexes
- `objects` - Total number of documents

**Metrics:**
- `avgTripsPerUser` - Average trips per user
- `avgNotificationsPerUser` - Average notifications per user

---

## Notifications

### Send Broadcast Notification

**Endpoint:** `POST /api/admin/notifications/broadcast`

**Description:** Send push notifications to all users or specific user groups.

**Request Body:**
```json
{
  "title": "Important Update",
  "body": "We've launched new features! Check them out in the app.",
  "type": "admin_broadcast",
  "targetUsers": ["user_id_1", "user_id_2"],
  "targetPlans": ["pro", "elite"]
}
```

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | String | Yes | Notification title |
| `body` | String | Yes | Notification message |
| `type` | String | No | Notification type (default: "admin_broadcast") |
| `targetUsers` | Array | No | Specific user IDs to notify |
| `targetPlans` | Array | No | Target by plan (free, pro, elite) |

**Targeting Logic:**
- If `targetUsers` is provided: Send to those specific users only
- If `targetPlans` is provided: Send to all users on those plans
- If neither provided: Send to all users

**Example Request:**
```bash
POST /api/admin/notifications/broadcast
Content-Type: application/json

{
  "title": "New Feature Alert",
  "body": "Check out our new AI itinerary generator!",
  "targetPlans": ["pro", "elite"]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Broadcast notification sent to 700 users",
  "data": {
    "sent": 700,
    "targetUsers": 700,
    "notification": {
      "title": "New Feature Alert",
      "body": "Check out our new AI itinerary generator!",
      "type": "admin_broadcast"
    }
  }
}
```

**Error Responses:**
- `400` - Title or body missing, or no users found matching criteria

---

## Payment Management

### Get Payment Overview

**Endpoint:** `GET /api/admin/payments/overview`

**Description:** Get comprehensive payment and revenue statistics.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `period` | String | "30d" | Time period (7d, 30d, 90d, 1y) |

**Example Request:**
```bash
GET /api/admin/payments/overview?period=30d
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment overview retrieved successfully",
  "data": {
    "period": "30d",
    "dateRange": {
      "start": "2024-12-20T00:00:00Z",
      "end": "2025-01-20T00:00:00Z"
    },
    "overview": {
      "totalRevenue": 15000.00,
      "totalTransactions": 750,
      "avgTransactionValue": 20.00
    },
    "byPlan": {
      "pro_ios": {
        "count": 300,
        "totalRevenue": 2997.00,
        "avgRevenue": 9.99
      },
      "elite_ios": {
        "count": 150,
        "totalRevenue": 4498.50,
        "avgRevenue": 29.99
      },
      "pro_android": {
        "count": 200,
        "totalRevenue": 1998.00,
        "avgRevenue": 9.99
      },
      "elite_android": {
        "count": 100,
        "totalRevenue": 2999.00,
        "avgRevenue": 29.99
      }
    },
    "planDistribution": {
      "free": 800,
      "pro": 500,
      "elite": 200
    },
    "recentTransactions": [
      {
        "id": "payment_id",
        "user": {
          "_id": "user_id",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "plan": "pro",
        "platform": "ios",
        "amount": 9.99,
        "currency": "USD",
        "eventTime": "2025-01-20T15:00:00Z",
        "eventType": "purchase"
      }
    ]
  }
}
```

**Field Descriptions:**

**Overview:**
- `totalRevenue` - Total revenue in the period
- `totalTransactions` - Number of transactions
- `avgTransactionValue` - Average transaction amount

**By Plan:**
- Breakdown by plan and platform
- Format: `{plan}_{platform}`
- `count` - Number of purchases
- `totalRevenue` - Total revenue for this plan/platform
- `avgRevenue` - Average revenue per transaction

**Plan Distribution:**
- Current number of users on each plan

**Recent Transactions:**
- Last 10 transactions in the period
- Includes user details, plan, platform, amount, and timestamp

---

## Content Moderation

### 1. Get Content for Moderation

**Endpoint:** `GET /api/admin/content/moderate`

**Description:** Retrieve content reports that need moderation review.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | Number | 1 | Page number |
| `limit` | Number | 20 | Results per page |
| `status` | String | "pending" | Report status (pending, resolved, dismissed) |
| `contentType` | String | "" | Filter by content type (trip, journal, profile) |

**Example Request:**
```bash
GET /api/admin/content/moderate?page=1&status=pending&contentType=trip
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Content for moderation retrieved successfully",
  "data": {
    "reports": [
      {
        "_id": "report_id",
        "contentType": "trip",
        "contentId": "trip_id",
        "reason": "inappropriate_content",
        "description": "This trip contains offensive language",
        "status": "pending",
        "reporterId": {
          "_id": "reporter_id",
          "name": "Jane Doe",
          "email": "jane@example.com"
        },
        "reportedUserId": {
          "_id": "reported_user_id",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "createdAt": "2025-01-20T12:00:00Z"
      }
    ],
    "pagination": {
      "current": 1,
      "pages": 3,
      "total": 45,
      "limit": 20
    },
    "stats": {
      "pending": 45,
      "resolved": 120,
      "dismissed": 35
    }
  }
}
```

---

### 2. Moderate Content

**Endpoint:** `PUT /api/admin/content/:id/moderate`

**Description:** Take moderation action on reported content (approve, reject, or delete).

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | String | Content report MongoDB ObjectId |

**Request Body:**
```json
{
  "action": "delete",
  "reason": "Violates community guidelines"
}
```

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `action` | String | Yes | Action to take (approve, reject, delete) |
| `reason` | String | No | Reason for the action |

**Action Types:**
- `approve` - No action needed, mark as resolved
- `reject` - Dismiss the report, mark as dismissed
- `delete` - Remove the content and mark as resolved

**Example Request:**
```bash
PUT /api/admin/content/507f1f77bcf86cd799439011/moderate
Content-Type: application/json

{
  "action": "delete",
  "reason": "Inappropriate content"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Content deleted successfully",
  "data": {
    "report": {
      "id": "507f1f77bcf86cd799439011",
      "status": "resolved",
      "action": "content_removed",
      "reviewedBy": "admin_user_id",
      "reviewedAt": "2025-01-20T15:30:00Z"
    }
  }
}
```

**Content Deletion:**
When `action: "delete"` is used, the system will:
- For `trip`: Delete the trip document
- For `journal`: Delete the journal entry (if implemented)
- For `profile`: Consider suspending the user (if implemented)

**Error Responses:**
- `400` - Invalid report ID or invalid action
- `404` - Content report not found

---

## Affiliate Management

### 1. Get Affiliate Overview

**Endpoint:** `GET /api/admin/affiliate/overview`

**Description:** Get comprehensive affiliate system statistics including Elite gifts and influencer referrals.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `period` | String | "30d" | Time period in days (e.g., "30d", "90d") |

**Example Request:**
```bash
GET /api/admin/affiliate/overview?period=30d
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Affiliate overview retrieved successfully",
  "data": {
    "period": {
      "startDate": "2024-12-20T00:00:00Z",
      "endDate": "2025-01-20T00:00:00Z"
    },
    "summary": {
      "totalEliteGifts": 150,
      "totalInfluencerReferrals": 350,
      "totalConversions": 500
    },
    "topInfluencers": [
      {
        "influencerId": "influencer_id",
        "influencerName": "John Influencer",
        "influencerEmail": "john@influencer.com",
        "referrals": 85,
        "uniqueUsers": 80
      }
    ],
    "conversionTrends": [
      {
        "_id": {
          "date": "2025-01-20",
          "type": "elite_gift"
        },
        "count": 15
      },
      {
        "_id": {
          "date": "2025-01-20",
          "type": "influencer_referral"
        },
        "count": 25
      }
    ]
  }
}
```

**Field Descriptions:**

**Summary:**
- `totalEliteGifts` - Number of Elite plan gifts sent
- `totalInfluencerReferrals` - Number of influencer referral conversions
- `totalConversions` - Combined total

**Top Influencers:**
- Top 10 influencers by referral count
- `referrals` - Total number of referrals
- `uniqueUsers` - Number of unique users referred

**Conversion Trends:**
- Daily breakdown of conversions by type
- Format: `{ date, type, count }`

---

### 2. Get Affiliate Links

**Endpoint:** `GET /api/admin/affiliate/links`

**Description:** Retrieve all affiliate links with pagination and filtering.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | Number | 1 | Page number |
| `limit` | Number | 20 | Results per page |
| `type` | String | "" | Filter by link type (elite_gift, influencer_referral) |

**Example Request:**
```bash
GET /api/admin/affiliate/links?page=1&limit=20&type=influencer_referral
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Affiliate links retrieved successfully",
  "data": {
    "links": [
      {
        "_id": "link_id",
        "code": "INFLUENCER123",
        "type": "influencer_referral",
        "isActive": true,
        "usageCount": 45,
        "createdBy": {
          "_id": "user_id",
          "name": "Admin User",
          "email": "admin@tripwiser.com"
        },
        "influencerId": {
          "_id": "influencer_id",
          "name": "John Influencer",
          "email": "john@influencer.com"
        },
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

---

### 3. Toggle Affiliate Link Status

**Endpoint:** `PUT /api/admin/affiliate/links/:id/toggle`

**Description:** Enable or disable an affiliate link.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | String | Affiliate link MongoDB ObjectId |

**Example Request:**
```bash
PUT /api/admin/affiliate/links/507f1f77bcf86cd799439011/toggle
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Affiliate link activated successfully",
  "data": {
    "link": {
      "_id": "507f1f77bcf86cd799439011",
      "isActive": true,
      "type": "influencer_referral"
    }
  }
}
```

**Error Responses:**
- `404` - Affiliate link not found

---

## Response Format

All admin endpoints use the standardized `ResponseHandler` format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful message",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

---

## Common Error Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `400` | Bad Request (validation error, invalid parameters) |
| `401` | Unauthorized (no token, invalid token, expired token) |
| `403` | Forbidden (not an admin) |
| `404` | Not Found (resource doesn't exist) |
| `409` | Conflict (duplicate email, etc.) |
| `500` | Internal Server Error |

---

## Authentication Errors

**No Token:**
```json
{
  "success": false,
  "message": "No token provided"
}
```

**Invalid Token:**
```json
{
  "success": false,
  "message": "Invalid token"
}
```

**Expired Token:**
```json
{
  "success": false,
  "message": "Token expired"
}
```

**Not Admin:**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

---

## Best Practices

### 1. Pagination
- Always use pagination for list endpoints
- Default page size is 20 items
- Maximum recommended page size is 100

### 2. Time Periods
- Standard periods: 7d, 30d, 90d, 1y
- All dates returned in ISO 8601 format
- Timezone: UTC

### 3. Filtering
- Use query parameters for filtering
- Case-insensitive search where applicable
- Multiple filters can be combined

### 4. Sorting
- Specify both `sortBy` and `sortOrder`
- Default sort order is descending (newest first)

### 5. Data Deletion
- User deletion cascades to all related data
- Firebase user is also deleted
- Operation is irreversible

### 6. Security
- All endpoints require admin authentication
- Admin list configured via environment variables
- Audit logs recommended for sensitive operations

---

## Example Workflows

### 1. User Management Workflow
```bash
# Search for a user
GET /api/admin/users?search=john@example.com

# Get full user details
GET /api/admin/users/507f1f77bcf86cd799439011

# Update user plan
PUT /api/admin/users/507f1f77bcf86cd799439011
{
  "plan": "elite"
}

# Delete user if needed
DELETE /api/admin/users/507f1f77bcf86cd799439011
```

### 2. Content Moderation Workflow
```bash
# Get pending reports
GET /api/admin/content/moderate?status=pending

# Review specific report details
# (Check content via trip/journal endpoints if needed)

# Take action
PUT /api/admin/content/507f1f77bcf86cd799439011/moderate
{
  "action": "delete",
  "reason": "Violates community guidelines"
}
```

### 3. Analytics Review Workflow
```bash
# Get overall platform analytics
GET /api/admin/analytics?period=30d

# Check payment overview
GET /api/admin/payments/overview?period=30d

# Review system health
GET /api/admin/system/health

# Check system metrics
GET /api/admin/system/metrics
```

### 4. Broadcast Notification Workflow
```bash
# Target specific plan users
POST /api/admin/notifications/broadcast
{
  "title": "New Feature Alert",
  "body": "Check out our new AI features!",
  "targetPlans": ["pro", "elite"]
}

# Target specific users
POST /api/admin/notifications/broadcast
{
  "title": "Personal Message",
  "body": "Thank you for being a beta tester!",
  "targetUsers": ["user_id_1", "user_id_2"]
}
```

---

## Notes

- All dates are in UTC timezone
- Response field `_id` is used (not `id`) per recent refactoring
- Some endpoints may return empty arrays or null values for fields without data
- Log files location: `./logs/` directory (if logging is enabled)
- Database connection state: 1 = connected, 0 = disconnected

---

