# Nest XLR8 - Scalable NestJS Application

A production-ready NestJS application with authentication, user management, and comprehensive testing. Built with clean architecture principles, security best practices, and scalability in mind.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with secure password hashing
- **User Management**: Complete CRUD operations for user management
- **Database Integration**: Prisma ORM with MySQL support
- **API Documentation**: Swagger/OpenAPI documentation
- **Security**: Helmet, CORS, rate limiting, input validation
- **Testing**: Unit tests, integration tests, and e2e tests
- **Logging**: Comprehensive request/response logging
- **Error Handling**: Global exception handling with proper error responses
- **Validation**: Input validation with class-validator
- **TypeScript**: Full TypeScript support with strict typing

## 📋 Prerequisites

- Node.js (v18 or higher)
- MySQL (v8 or higher)
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
   DATABASE_URL="mysql://username:password@localhost:3306/nest_xlr8"
   
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
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
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
- `npm run test:cov` - Run tests with coverage
- `npm run test:e2e` - Run e2e tests

## 🏗️ Project Structure

```
src/
├── common/                 # Shared utilities and services
│   ├── decorators/        # Custom decorators
│   ├── filters/           # Exception filters
│   ├── guards/            # Authentication guards
│   ├── interceptors/      # Request/response interceptors
│   ├── middleware/        # Custom middleware
│   ├── pipes/             # Validation pipes
│   └── services/          # Shared services (PasswordService)
├── config/                # Configuration module
├── database/              # Database configuration and Prisma service
├── modules/               # Feature modules
│   ├── auth/              # Authentication module
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── strategies/    # Passport strategies
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   └── users/             # User management module
│       ├── dto/           # Data Transfer Objects
│       ├── users.controller.ts
│       ├── users.service.ts
│       └── users.module.ts
├── shared/                # Shared interfaces and utilities
│   ├── constants.ts       # Application constants
│   ├── interfaces.ts      # TypeScript interfaces
│   └── utils.ts           # Utility functions
├── app.module.ts          # Root module
└── main.ts                # Application entry point
```

## 🔐 Authentication

The application uses JWT-based authentication. Here's how to use it:

### Register a new user
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "bio": "Software developer"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Access protected routes
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🛡️ Security Features

- **Password Hashing**: Uses bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive input validation using class-validator
- **Rate Limiting**: Prevents abuse with configurable rate limits
- **CORS**: Configurable Cross-Origin Resource Sharing
- **Helmet**: Security headers for protection against common vulnerabilities
- **SQL Injection Protection**: Prisma ORM provides protection against SQL injection

## 🧪 Testing Strategy

- **Unit Tests**: Test individual services and components
- **Integration Tests**: Test module interactions
- **E2E Tests**: Test complete user workflows
- **Mocking**: Proper mocking of external dependencies
- **Coverage**: Comprehensive test coverage reporting

## 📈 Performance Considerations

- **Database Indexing**: Proper database indexes for optimal query performance
- **Pagination**: Implemented for large datasets
- **Connection Pooling**: Prisma handles database connection pooling
- **Caching**: Ready for Redis integration
- **Compression**: Built-in response compression

## 🔧 Configuration

The application uses a centralized configuration system:

- Environment variables for sensitive data
- Type-safe configuration service
- Default values for development
- Validation of required configuration

## 🚀 Deployment

### Docker (Recommended)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure proper CORS origins
- Set up database connection pooling
- Configure rate limiting appropriately

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api/docs`
- Review the test files for usage examples

## 🔄 Changelog

### v1.0.0
- Initial release
- Authentication system
- User management
- API documentation
- Comprehensive testing
- Security features