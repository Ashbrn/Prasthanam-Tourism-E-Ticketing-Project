# System Architecture - Prasthanam Tourism E-Ticketing Chatbot

## Overview

Prasthanam is a full-stack MERN application designed to provide an end-to-end tourism e-ticketing experience with a conversational chatbot interface, secure payments, and comprehensive admin management.

## System Components

### 1. Frontend (React + TypeScript + Vite)

```
frontend/
├── src/
│   ├── pages/              # Route-based pages
│   │   ├── LandingPage.tsx
│   │   ├── ChatPage.tsx
│   │   ├── EventsPage.tsx
│   │   ├── BookingPage.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── ...
│   ├── components/         # Reusable components
│   │   ├── Header.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ...
│   ├── store/             # Zustand state management
│   │   ├── authStore.ts
│   │   ├── chatStore.ts
│   │   └── bookingStore.ts
│   ├── services/          # API client
│   │   └── api.ts
│   ├── types/             # TypeScript definitions
│   │   └── index.ts
│   ├── locales/           # i18n translations
│   │   ├── en/
│   │   ├── hi/
│   │   └── fr/
│   ├── i18n.ts            # i18n configuration
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
```

**Key Features:**
- Mobile-first responsive design
- Real-time state management with Zustand
- Internationalization (i18n) for 3 languages
- Axio interceptors for token refresh
- Protected routes for authenticated users

### 2. Backend (Node.js + Express + TypeScript)

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts     # MongoDB connection
│   ├── models/             # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Event.ts
│   │   ├── Booking.ts
│   │   ├── Payment.ts
│   │   └── Conversation.ts
│   ├── routes/             # API routes
│   │   ├── authRoutes.ts
│   │   ├── eventRoutes.ts
│   │   ├── bookingRoutes.ts
│   │   ├── paymentRoutes.ts
│   │   ├── chatRoutes.ts
│   │   └── adminRoutes.ts
│   ├── services/           # Business logic
│   │   ├── authService.ts
│   │   ├── eventService.ts
│   │   ├── bookingService.ts
│   │   ├── paymentService.ts
│   │   └── chatbotService.ts
│   ├── middleware/         # Express middleware
│   │   ├── auth.ts         # JWT authentication
│   │   └── error.ts        # Error handling
│   ├── utils/              # Utility functions
│   │   ├── jwt.ts
│   │   └── payment.ts
│   ├── types/              # TypeScript interfaces
│   │   └── index.ts
│   └── index.ts            # Entry point
```

**Key Features:**
- JWT-based authentication with refresh tokens
- MongoDB with mongoose for data persistence
- Service layer for business logic separation
- Middleware for cross-cutting concerns
- Error handling with custom AppError class

### 3. Database Schema (MongoDB)

#### Users Collection
```typescript
{
  _id: ObjectId,
  name: string,
  email: string (unique),
  phone: string,
  password: string (hashed),
  preferredLanguage: string,
  roles: ["user" | "admin"],
  createdAt: Date,
  updatedAt: Date
}
```

#### Events Collection
```typescript
{
  _id: ObjectId,
  title: { en: string, hi: string },
  slug: string (unique),
  description: { en: string, hi: string },
  images: [string],
  location: {
    city: string,
    lat: number,
    lng: number
  },
  schedule: [{
    date: string,
    start: string,
    end: string,
    capacity: number
  }],
  ticketTypes: [{
    id: string,
    label: { en: string, hi: string },
    price: number,
    taxPercent: number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### Bookings Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  eventId: ObjectId (ref: Event),
  scheduleDate: string,
  tickets: [{
    typeId: string,
    qty: number,
    unitPrice: number
  }],
  totalAmount: number,
  currency: string,
  status: "pending" | "confirmed" | "cancelled" | "refunded",
  razorpayOrderId: string,
  razorpayPaymentId: string,
  contact: {
    name: string,
    email: string,
    phone: string
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Payments Collection
```typescript
{
  _id: ObjectId,
  bookingId: ObjectId (ref: Booking),
  userId: ObjectId (ref: User),
  razorpayOrderId: string (unique),
  razorpayPaymentId: string,
  amount: number,
  currency: string,
  status: "created" | "authorized" | "captured" | "failed" | "refunded",
  method: string,
  signatureVerified: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Conversations Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  sessionId: string (unique),
  language: string,
  messages: [{
    from: "user" | "bot",
    text: string,
    ts: Date
  }],
  intent: string,
  entities: object,
  resolved: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## API Architecture

### Authentication Flow

```
User Input
    ↓
POST /auth/login or /auth/register
    ↓
AuthService.login() / AuthService.register()
    ↓
Generate JWT tokens
    ↓
Response with access token, refresh token, and user data
    ↓
Client stores tokens in localStorage
    ↓
Future requests include Bearer token in Authorization header
```

### Booking Flow

```
User selects event and tickets
    ↓
POST /bookings/create
    ↓
BookingService.createBookingDraft()
    ↓
Calculate pricing with taxes
    ↓
Create Razorpay order
    ↓
Save booking as "pending"
    ↓
Response with booking summary and order ID
    ↓
Frontend initiates Razorpay checkout
    ↓
User completes payment
    ↓
POST /payments/verify
    ↓
PaymentService.verifyPayment()
    ↓
Verify HMAC signature
    ↓
Update booking status to "confirmed"
    ↓
Send confirmation email
```

### Webhook Flow

```
Razorpay Payment Event
    ↓
POST /payments/webhook
    ↓
Verify webhook signature
    ↓
PaymentService.handleWebhookEvent()
    ↓
Process based on event type:
  - payment.captured → Update payment & booking
  - payment.failed → Mark payment as failed
  - refund.created → Mark booking as refunded
    ↓
Idempotency check to prevent duplicate processing
```

### Chatbot Flow

```
User Input
    ↓
POST /chat/message
    ↓
ChatbotService.processMessage()
    ↓
detectIntent() - Pattern matching
    ↓
Handle intent:
  - book_ticket → Handle booking flow
  - ask_price → Query event prices
  - ask_availability → Check availability
  - faq → Return FAQ response
    ↓
Save conversation to database
    ↓
Response with bot reply and actions
```

## State Management

### Zustand Stores

**authStore**
- User authentication state
- Token management
- Login/logout actions
- Session persistence

**chatStore**
- Chat session ID
- Message history
- Loading state
- Language selection

**bookingStore**
- Selected event ID
- Ticket selections
- Contact information
- Booking draft

## Payment Integration

### Razorpay Flow

```
1. Backend creates order with Razorpay API
2. Order ID returned to frontend
3. Frontend opens Razorpay Checkout
4. User enters payment details
5. Razorpay processes payment
6. Frontend receives payment details
7. Frontend sends verification request to backend
8. Backend verifies signature
9. Payment status updated in database
```

### Security

- No card data stored on server
- HMAC signature verification on all payments
- Webhook signature verification
- Idempotent payment processing
- PCI compliance through Razorpay

## Error Handling

```typescript
// Custom AppError for consistent error responses
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: any[]
  ) {}
}

// Global error handler middleware catches and formats errors
// Response format:
{
  status: "error",
  message: "Human-readable message",
  errors: [{ field: "email", message: "Invalid email" }]
}
```

## Performance Optimizations

### Frontend
- Code splitting with React Router
- Image lazy loading
- CSS minification with Tailwind
- Bundle size monitoring
- Client-side caching

### Backend
- Database indexing on frequently queried fields
- Request/response compression
- Connection pooling
- Query optimization with projection
- Redis caching (optional)

### Database
- Indexes on: email, slug, city, userId, razorpayOrderId
- TTL indexes on sessions
- Pagination to limit result sets

## Scalability Architecture

```
Load Balancer
    ↓
├─ Frontend Instance 1 (Nginx)
├─ Frontend Instance 2 (Nginx)
└─ Frontend Instance N
    ↓
API Gateway / Load Balancer
    ↓
├─ Backend Instance 1
├─ Backend Instance 2
└─ Backend Instance N
    ↓
MongoDB Connection Pool
    ↓
Database Replica Set
```

- Stateless backend allows horizontal scaling
- Shared MongoDB Atlas for data persistence
- Session storage in database (not memory)
- Load balancing via cloud provider

## Security Architecture

```
HTTPS/TLS Encryption
    ↓
API Gateway with Rate Limiting
    ↓
Request Validation & Sanitization
    ↓
JWT Authentication
    ↓
Authorization Middleware (admin checks)
    ↓
Business Logic Layer
    ↓
Database with encryption at rest
```

## Monitoring & Logging

- Error tracking with Sentry
- Application metrics with Prometheus
- Visualization with Grafana
- Centralized logging with ELK/Papertrail
- Alerting based on thresholds

## CI/CD Pipeline

```
Code Push → GitHub
    ↓
GitHub Actions Workflow
    ↓
├─ Install dependencies
├─ Type checking
├─ Linting
├─ Run tests
├─ Build
    ↓
Docker Image Build
    ↓
Push to Container Registry
    ↓
Deploy to Production
```

## Deployment Architecture

```
Development Environment
├─ Docker Compose (local)
├─ Local MongoDB
└─ Frontend dev server

Staging Environment
├─ Docker containers on staging server
├─ MongoDB Atlas staging cluster
└─ Staging domain

Production Environment
├─ Kubernetes cluster or managed container service
├─ MongoDB Atlas production cluster
├─ CDN for static assets
├─ SSL/TLS certificates
└─ Production domain with SSL
```

## Technology Decisions

### Why Zustand over Redux?
- Simpler API
- Less boilerplate
- Better performance for simple state
- Smaller bundle size

### Why Vite over Create React App?
- Faster dev server
- Faster build times
- Native ES module support
- Better HMR

### Why MongoDB over PostgreSQL?
- Flexible schema for evolving requirements
- Better for rapid prototyping
- Good for document-like data (bookings, orders)
- Good horizontal scalability

### Why Express over NestJS?
- Simpler setup for monolithic architecture
- Faster development
- Easier to understand for team
- Sufficient for current scale

## Future Scalability Considerations

1. **Microservices Migration**: Separate services for payments, chat, bookings
2. **Message Queue**: Add Redis/RabbitMQ for async operations
3. **WebSocket Server**: Real-time notifications
4. **Search Engine**: Elasticsearch for advanced event search
5. **CDN**: CloudFront/Cloudflare for static assets
6. **Caching Layer**: Redis for session and query caching
7. **Analytics**: Separate data warehouse for analytics queries
