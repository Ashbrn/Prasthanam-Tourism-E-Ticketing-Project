# Quick Start Guide

Get Prasthanam up and running in minutes!

## Option 1: Docker Compose (Recommended)

### Prerequisites
- Docker
- Docker Compose

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/prasthanam.git
   cd prasthanam
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Start services**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - Health check: http://localhost:4000/health

5. **Seed database (optional)**
   ```bash
   docker-compose exec backend npm run seed
   ```

6. **Test login**
   - Email: `admin@prasthanam.com`
   - Password: `Admin@123`

### Stop Services
```bash
docker-compose down
```

---

## Option 2: Manual Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with your values**
   ```
   MONGODB_URI=mongodb://localhost:27017/prasthanam
   JWT_SECRET=your-secret-key
   RAZORPAY_KEY_ID=your-key-id
   RAZORPAY_KEY_SECRET=your-secret
   ```

5. **Start backend**
   ```bash
   npm run dev
   ```

   Backend running at: http://localhost:4000

### Frontend Setup

1. **In a new terminal, navigate to frontend**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```

4. **Start frontend**
   ```bash
   npm run dev
   ```

   Frontend running at: http://localhost:3000

---

## Configuration

### Backend `.env`
```env
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://localhost:27017/prasthanam
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=rzp_test_secret
CORS_ORIGIN=http://localhost:3000
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

---

## Testing the Application

### 1. User Registration
- Go to http://localhost:3000/register
- Fill in details and create account
- You'll be logged in automatically

### 2. Browse Events
- Go to "Events" or "Chat"
- Search for events like "Taj Mahal"
- View event details

### 3. Book Tickets
- Click on an event
- Select date and ticket quantity
- Proceed to payment
- Use test Razorpay credentials

### 4. Admin Access
- Login with: `admin@prasthanam.com` / `Admin@123`
- Access dashboard at: http://localhost:3000/admin
- View bookings, payments, and analytics

### 5. Chat Feature
- Go to "Chat" page
- Chat with the bot about booking tickets
- Try these messages:
  - "Book tickets for Taj Mahal"
  - "How much does it cost?"
  - "What's your refund policy?"

---

## Database

### MongoDB Atlas (Cloud)
```bash
# Update MONGODB_URI in .env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/prasthanam
```

### Local MongoDB
```bash
# Install MongoDB locally, then
mongod

# Update .env
MONGODB_URI=mongodb://localhost:27017/prasthanam
```

---

## Seeding Data

### Via Docker
```bash
docker-compose exec backend npm run seed
```

### Manual
```bash
cd backend
npm run seed
```

### Sample Data Created
- 1 Admin User
- 1 Test User
- 2 Sample Events (Varanasi, Taj Mahal)

---

## Running Tests

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### E2E Tests
```bash
cd frontend
npm run cypress:open  # Interactive mode
```

---

## Troubleshooting

### Port Already in Use
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9
lsof -ti:4000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### MongoDB Connection Error
- Check MongoDB is running
- Verify connection string in `.env`
- Ensure MongoDB user has correct permissions

### Razorpay Payment Fails
- Check Razorpay keys in `.env`
- Use test credentials (not production)
- Verify webhook is configured

### Frontend not connecting to Backend
- Check CORS_ORIGIN in backend `.env`
- Verify backend is running on port 4000
- Check frontend `.env` API_URL

### Dependencies Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Common Commands

### Development
```bash
# Start all services (Docker)
docker-compose up --build

# Start backend only
cd backend && npm run dev

# Start frontend only
cd frontend && npm run dev
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run cypress:open
```

### Linting & Type Check
```bash
# Type check
npm run typecheck

# Lint code
npm run lint

# Fix lint issues
npm run lint -- --fix
```

### Building
```bash
# Build backend
cd backend && npm run build

# Build frontend
cd frontend && npm run build
```

---

## API Examples

### Login
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@prasthanam.com",
    "password": "Admin@123"
  }'
```

### List Events
```bash
curl http://localhost:4000/events?city=Varanasi
```

### Create Booking
```bash
curl -X POST http://localhost:4000/bookings/create \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "event_id",
    "scheduleDate": "2025-12-25",
    "tickets": [{"typeId": "adult", "qty": 2}],
    "contact": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+919876543210"
    }
  }'
```

### Chat
```bash
curl -X POST http://localhost:4000/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_id",
    "message": "Book tickets for Taj Mahal",
    "language": "en"
  }'
```

---

## Next Steps

1. ✅ Explore the codebase
2. ✅ Read [ARCHITECTURE.md](ARCHITECTURE.md)
3. ✅ Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
4. ✅ Read [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
5. ✅ Deploy to production using [DEPLOYMENT.md](DEPLOYMENT.md)

---

## Getting Help

- 📖 Read the [README](README.md)
- 📚 Check [API Documentation](API_DOCUMENTATION.md)
- 🏗️ Review [Architecture](ARCHITECTURE.md)
- 🤝 See [Contributing Guide](CONTRIBUTING.md)
- 🔒 Review [Security Policy](SECURITY.md)

---

**Happy Coding! 🚀**
