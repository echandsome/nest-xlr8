# Nest XLR8 - Scalable NestJS Application

A production-ready NestJS application with authentication, user management, and comprehensive testing. Built with clean architecture principles, security best practices, and scalability in mind.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with secure password hashing
- **User Management**: Complete CRUD operations for user management
- **Database Integration**: Mongoose ODM with MongoDB support
- **API Documentation**: Swagger/OpenAPI documentation
- **Security**: Helmet, CORS, rate limiting, input validation
- **Testing**: Unit tests, integration tests, and e2e tests
- **Logging**: Comprehensive request/response logging
- **Error Handling**: Global exception handling with proper error responses
- **Validation**: Input validation with class-validator
- **TypeScript**: Full TypeScript support with strict typing

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/echandsome/nest-xlr8
   cd nest-xlr8
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Database
   DATABASE_URL="mongodb://localhost:27017/nest-xlr8"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="1h"
   
   # Server
   PORT=3000
   NODE_ENV="development"
   
   # CORS
   CORS_ORIGIN="http://localhost:3000"
   
   # Rate Limiting
   RATE_LIMIT_TTL=60
   RATE_LIMIT_LIMIT=100
   
   # Global Prefix
   GLOBAL_PREFIX="api/v1"
   
   # Logging
   LOG_LEVEL="info"
   LOG_DIR="src/logs"
   LOG_MAX_FILES=5
   LOG_MAX_SIZE="20m"
   ```

4. **Set up the database**
   ```bash
   # Make sure MongoDB is running on your system
   # The application will automatically connect to MongoDB using the DATABASE_URL
   ```

## 🚀 Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

### Watch Mode
```bash
npm run test:watch
```

## 📚 API Documentation

Once the application is running, you can access the Swagger documentation at:
- **Development**: http://localhost:3000/api/v1/docs

## 🔧 Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:debug` - Run tests in debug mode
- `npm run test:cov` - Run tests with coverage
- `npm run test:e2e` - Run e2e tests
