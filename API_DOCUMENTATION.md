# Prasthanam API Documentation

## Base URL
```
https://api.prasthanam.example.com
```

## Authentication

All authenticated endpoints require an `Authorization` header with a Bearer token:
```
Authorization: Bearer {accessToken}
```

## Error Responses

All error responses follow this format:
```json
{
  "status": "error",
  "message": "Human-readable error message",
  "errors": [
    {
      "field": "fieldName",
      "message": "Field-specific error"
    }
  ]
}
```

## Endpoints

### Authentication

#### POST /auth/login
Login with email and password

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "accessToken": "jwt_token_here",
  "refreshToken": "refresh_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "user@example.com",
    "preferredLanguage": "en",
    "roles": ["user"]
  }
}
```

#### POST /auth/register
Register a new user

**Request:**
```json
{
  "name": "John Doe",
  "email": "newuser@example.com",
  "phone": "+919876543210",
  "password": "securePassword123"
}
```

**Response (200):**
Same as login response

#### POST /auth/refresh
Refresh access token

**Request:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response (200):**
```json
{
  "accessToken": "new_access_token",
  "refreshToken": "new_refresh_token"
}
```

#### GET /auth/me
Get current user profile (requires auth)

**Response (200):**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "user@example.com",
  "phone": "+919876543210",
  "preferredLanguage": "en",
  "roles": ["user"],
  "createdAt": "2025-12-04T10:00:00Z"
}
```

---

### Events

#### GET /events
List events with optional filters

**Query Parameters:**
- `city` (optional) - Filter by city
- `date` (optional) - Filter by date (YYYY-MM-DD)
- `q` (optional) - Search query
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20) - Items per page

**Response (200):**
```json
{
  "items": [
    {
      "_id": "event_id",
      "title": { "en": "Heritage Walk", "hi": "हेरिटेज वॉक" },
      "slug": "heritage-walk",
      "description": { "en": "Description...", "hi": "विवरण..." },
      "images": ["image_url"],
      "location": {
        "city": "Varanasi",
        "lat": 25.32,
        "lng": 82.98
      },
      "schedule": [
        {
          "date": "2025-12-25",
          "start": "06:00",
          "end": "10:00",
          "capacity": 50
        }
      ],
      "ticketTypes": [
        {
          "id": "adult",
          "label": { "en": "Adult" },
          "price": 500,
          "taxPercent": 18
        }
      ]
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20,
  "pages": 5
}
```

#### GET /events/{slug}
Get event details by slug

**Response (200):**
Same as event object in list

#### POST /admin/events
Create a new event (admin only)

**Request:**
```json
{
  "title": { "en": "New Event", "hi": "नया ईवेंट" },
  "slug": "new-event",
  "description": { "en": "Description", "hi": "विवरण" },
  "images": ["image_url"],
  "location": {
    "city": "Delhi",
    "lat": 28.7041,
    "lng": 77.1025
  },
  "schedule": [
    {
      "date": "2025-12-25",
      "start": "09:00",
      "end": "17:00",
      "capacity": 100
    }
  ],
  "ticketTypes": [
    {
      "id": "adult",
      "label": { "en": "Adult", "hi": "वयस्क" },
      "price": 1000,
      "taxPercent": 18
    }
  ]
}
```

**Response (201):** Event object

#### PUT /admin/events/{id}
Update event (admin only)

**Response (200):** Updated event object

#### DELETE /admin/events/{id}
Delete event (admin only)

**Response (200):**
```json
{
  "status": "success",
  "message": "Event deleted"
}
```

---

### Bookings

#### POST /bookings/create
Create a booking draft

**Request:**
```json
{
  "userId": "user_id",
  "eventId": "event_id",
  "scheduleDate": "2025-12-25",
  "tickets": [
    {
      "typeId": "adult",
      "qty": 2
    }
  ],
  "contact": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210"
  },
  "currency": "INR"
}
```

**Response (201):**
```json
{
  "bookingId": "booking_id",
  "summary": {
    "subtotal": 2000,
    "tax": 360,
    "total": 2360,
    "currency": "INR"
  },
  "razorpayOrder": {
    "id": "order_XXXXX",
    "amount": 236000,
    "currency": "INR"
  }
}
```

#### GET /bookings/{id}
Get booking details

**Response (200):**
```json
{
  "_id": "booking_id",
  "userId": "user_id",
  "eventId": "event_id",
  "scheduleDate": "2025-12-25",
  "tickets": [...],
  "totalAmount": 2360,
  "currency": "INR",
  "status": "confirmed",
  "contact": { ... },
  "createdAt": "2025-12-04T10:00:00Z"
}
```

#### GET /bookings
Get user's bookings (auth required)

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Response (200):**
```json
{
  "items": [booking_objects],
  "total": 5,
  "page": 1,
  "limit": 20
}
```

#### POST /bookings/{id}/cancel
Cancel a booking

**Response (200):** Updated booking with status "cancelled"

---

### Payments

#### POST /payments/verify
Verify payment and update booking

**Request:**
```json
{
  "bookingId": "booking_id",
  "razorpay_payment_id": "pay_XXXXX",
  "razorpay_order_id": "order_XXXXX",
  "razorpay_signature": "signature_here"
}
```

**Response (200):**
```json
{
  "success": true,
  "bookingId": "booking_id",
  "paymentId": "payment_id"
}
```

#### POST /payments/webhook
Razorpay webhook endpoint (internal)

**Headers:**
```
x-razorpay-signature: signature_here
```

**Request Body:**
Razorpay webhook payload

**Response (200):**
```json
{
  "processed": true
}
```

---

### Chat

#### POST /chat/message
Send a message to the chatbot

**Request:**
```json
{
  "sessionId": "session_uuid",
  "userId": "user_id",
  "message": "Book 2 tickets for Heritage Walk",
  "language": "en"
}
```

**Response (200):**
```json
{
  "reply": "Great! You want to book 2 tickets. Please select a date.",
  "actions": [
    {
      "type": "date_picker",
      "payload": {
        "event_id": "event_id",
        "quantity": 2
      }
    }
  ]
}
```

---

### Admin

#### GET /admin/bookings
List all bookings (admin only)

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Response (200):**
```json
{
  "items": [booking_objects],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

#### GET /admin/payments
List all payments (admin only)

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Response (200):**
```json
{
  "items": [payment_objects],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

#### GET /admin/conversations
List chat conversations (admin only)

**Query Parameters:**
- `q` (optional) - Search query
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Response (200):**
```json
{
  "items": [conversation_objects],
  "total": 50,
  "page": 1,
  "limit": 20
}
```

#### POST /admin/refund
Initiate refund (admin only)

**Request:**
```json
{
  "paymentId": "payment_id",
  "amount": 2360
}
```

**Response (200):**
```json
{
  "refund_id": "refund_XXXXX",
  "status": "processed",
  "booking": { ... }
}
```

#### GET /admin/stats
Get admin statistics (admin only)

**Response (200):**
```json
{
  "total_bookings": 150,
  "confirmed_bookings": 120,
  "pending_bookings": 30,
  "total_revenue": 350000
}
```

---

## Rate Limiting

- Auth endpoints: 5 requests per 15 minutes per IP
- General endpoints: 100 requests per 15 minutes per IP
- Payment endpoints: 10 requests per minute per IP

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Pagination

Endpoints that support pagination use these parameters:
- `page` - 1-based page number
- `limit` - Number of items per page (default: 20, max: 100)

Response includes:
```json
{
  "items": [],
  "total": 100,
  "page": 1,
  "limit": 20,
  "pages": 5
}
```

## Examples

### Complete Booking Flow

1. Create booking draft:
```bash
POST /bookings/create
{
  "eventId": "event123",
  "scheduleDate": "2025-12-25",
  "tickets": [{ "typeId": "adult", "qty": 2 }],
  "contact": { "name": "John", "email": "john@example.com", "phone": "+919876543210" }
}
```

2. Frontend gets razorpayOrder and initiates Razorpay Checkout

3. Verify payment:
```bash
POST /payments/verify
{
  "bookingId": "booking123",
  "razorpay_payment_id": "pay_XXXXX",
  "razorpay_order_id": "order_XXXXX",
  "razorpay_signature": "signature"
}
```

4. Booking is confirmed!

## Support

For API issues and questions:
- Email: api-support@prasthanam.com
- GitHub Issues: https://github.com/yourusername/prasthanam/issues
