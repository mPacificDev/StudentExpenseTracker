# README - StudentExpenseTracker Backend

## Setup Instructions

### Prerequisites
- Java 17 or later
- Maven 3.6+
- MySQL 8.0+

### Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE student_expense_tracker;
```

2. Update database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/student_expense_tracker
spring.datasource.username=root
spring.datasource.password=your_password
```

### Build and Run

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build the project:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### API Endpoints

#### Authentication
- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Login user

#### Categories
- **GET** `/api/categories` - Get all categories
- **GET** `/api/categories/{type}` - Get categories by type (INCOME/EXPENSE)

#### Transactions
- **GET** `/api/transactions` - Get all user transactions
- **POST** `/api/transactions` - Create new transaction
- **GET** `/api/transactions/{id}` - Get transaction by ID
- **PUT** `/api/transactions/{id}` - Update transaction
- **DELETE** `/api/transactions/{id}` - Delete transaction
- **GET** `/api/transactions/income` - Get income transactions
- **GET** `/api/transactions/expense` - Get expense transactions
- **GET** `/api/transactions/date-range` - Get transactions by date range

#### Dashboard
- **GET** `/api/dashboard/summary` - Get dashboard summary

### Environment Variables

Update `application.properties` with your configuration:

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/student_expense_tracker
spring.datasource.username=root
spring.datasource.password=

# JWT
jwt.secret=your-secret-key-256-bits-or-more
jwt.expiration=86400000

# CORS
app.cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

### Project Structure

```
src/main/java/com/studentexpensetracker/
├── model/
│   ├── User.java
│   ├── Category.java
│   └── Transaction.java
├── dto/
│   ├── LoginRequest.java
│   ├── RegisterRequest.java
│   ├── AuthResponse.java
│   ├── TransactionRequest.java
│   ├── TransactionResponse.java
│   ├── CategoryResponse.java
│   └── DashboardSummary.java
├── controller/
│   ├── AuthController.java
│   ├── CategoryController.java
│   ├── TransactionController.java
│   └── DashboardController.java
├── service/
│   ├── AuthService.java
│   ├── UserService.java
│   ├── CategoryService.java
│   ├── TransactionService.java
│   └── JwtService.java
├── repository/
│   ├── UserRepository.java
│   ├── CategoryRepository.java
│   └── TransactionRepository.java
└── config/
    ├── AppConfig.java
    ├── SecurityConfig.java
    ├── JwtAuthenticationFilter.java
    └── DataInitializer.java
```

### Default Categories

The application automatically initializes the following categories on startup:

**Income Categories:**
- Salary
- Freelance
- Gift
- Scholarship
- Business

**Expense Categories:**
- Food
- Transport
- Rent
- Shopping
- Entertainment
- Health
- Education
- Bills

### Testing the API

Use Postman or cURL to test endpoints. Sample requests:

**Register:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```