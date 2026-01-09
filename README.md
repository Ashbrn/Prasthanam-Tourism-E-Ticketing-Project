# Prasthanam - Tourism E-Ticketing Chatbot

A comprehensive MERN stack application for tourism e-ticketing with an integrated conversational chatbot, Razorpay payment integration, and multilingual support.

## Features

- **Conversational Chatbot**: Natural language interface for booking tickets
- **Event Management**: Browse and search tourism events and attractions
- **Secure Booking**: End-to-end booking flow with ticket selection
- **Payment Integration**: Razorpay payment gateway integration with webhook verification
- **Multilingual Support**: English, Hindi, and French language support
- **Admin Dashboard**: Comprehensive admin panel for managing bookings, payments, and analytics
- **User Authentication**: JWT-based authentication with refresh token rotation
- **Responsive Design**: Mobile-first responsive UI with Tailwind CSS
- **Real-time Updates**: WebSocket support for live chat and notifications

## Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **Authentication**: JWT with refresh tokens
- **Payment**: Razorpay SDK
- **API Docs**: OpenAPI 3.0

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Internationalization**: i18next
- **HTTP Client**: Axios

### DevOps
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Database**: MongoDB Atlas (production)
- **Deployment**: Heroku/GCP/Azure/ECS

## Project Structure

```
prasthanam/
├── backend/
│   ├── src/
│   │   ├── config/          # Database config
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript types
│   │   └── index.ts         # Main entry point
│   ├── Dockerfile
│   ├── tsconfig.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/           # React pages
│   │   ├── components/      # Reusable components
│   │   ├── store/           # Zustand stores
│   │   ├── services/        # API client
│   │   ├── types/           # TypeScript types
│   │   ├── locales/         # i18n translations
│   │   └── App.tsx
│   ├── Dockerfile
│   ├── vite.config.ts
│   └── package.json
├── .github/workflows/       # GitHub Actions workflows
├── docker-compose.yml
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- MongoDB Atlas account (for production)
- Razorpay account

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/prasthanam.git
   cd prasthanam
   ```

2. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - MongoDB: mongodb://localhost:27017

### Manual Setup (without Docker)

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user

### Events
- `GET /events?city=&date=&q=` - List events with filters
- `GET /events/:slug` - Get event details
- `POST /admin/events` - Create event (admin only)
- `PUT /admin/events/:id` - Update event (admin only)
- `DELETE /admin/events/:id` - Delete event (admin only)

### Bookings
- `POST /bookings/create` - Create booking draft
- `GET /bookings/:id` - Get booking details
- `GET /bookings` - Get user's bookings
- `POST /bookings/:id/cancel` - Cancel booking

### Payments
- `POST /payments/verify` - Verify payment signature
- `POST /payments/webhook` - Razorpay webhook handler

### Chat
- `POST /chat/message` - Send message to chatbot

### Admin
- `GET /admin/bookings` - List all bookings
- `GET /admin/payments` - List all payments
- `GET /admin/conversations` - List chat conversations
- `POST /admin/refund` - Initiate refund
- `GET /admin/stats` - Get analytics stats

## Seed Data

Load sample events and users:

```bash
cd backend
npm run seed
```

Default credentials:
- Email: `admin@prasthanam.com`
- Password: `Admin@123`

## Testing

### Backend
```bash
cd backend
npm test                    # Run all tests
npm run test:watch        # Watch mode
```

### Frontend
```bash
cd frontend
npm test                    # Run all tests
npm run test:ui           # UI mode
```

### E2E Testing
```bash
cd frontend
npm run cypress:open      # Open Cypress test runner
```

## Deployment

### Using Docker

```bash
docker-compose -f docker-compose.yml up -d
```

### Using Heroku

```bash
# Backend
cd backend
heroku create prasthanam-backend
git push heroku main

# Frontend
cd frontend
heroku create prasthanam-frontend
git push heroku main
```

### Using GCP Cloud Run

```bash
gcloud run deploy prasthanam-backend --source backend --platform managed
gcloud run deploy prasthanam-frontend --source frontend --platform managed
```

## Environment Variables

### Backend (.env)
```
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
RAZORPAY_KEY_ID=rzp_xxxxx
RAZORPAY_KEY_SECRET=rzp_secret_xxxxx
CORS_ORIGIN=https://yourdomain.com
```

### Frontend (.env)
```
VITE_API_URL=https://api.yourdomain.com
VITE_RAZORPAY_KEY_ID=rzp_xxxxx
```

## Security Considerations

- All card data is handled by Razorpay (PCI compliance)
- JWT tokens stored in localStorage with HTTPS-only cookies for refresh tokens
- CORS enabled for authorized domains only
- Rate limiting on authentication endpoints
- Input validation and sanitization on all endpoints
- Webhook signature verification for Razorpay events

## Performance

- Frontend bundle size: < 500KB (gzipped)
- API response time: < 300ms (p95)
- Page load time: < 3s on mobile
- Database query optimization with indexes
- Stateless backend for horizontal scaling

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: https://github.com/yourusername/prasthanam/issues
- Email: support@prasthanam.com

## Roadmap

- [ ] Real-time notifications with Socket.io
- [ ] Multiple payment gateway support
- [ ] Group booking discounts
- [ ] AI-powered recommendations
- [ ] Mobile app (React Native)
- [ ] Video integration with events
- [ ] Advanced analytics and reporting
