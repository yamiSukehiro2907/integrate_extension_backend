# Integrate Extension Backend

Backend API for the Integrate Extension - A developer tool for API integration and endpoint management.

## 🚀 Features

- **User Authentication** - JWT-based authentication system
- **Project Management** - Create and manage API integration projects
- **Endpoint Tracking** - Track API endpoint development status
- **Project Collaboration** - Multi-user project teams with role-based access
- **Version Control** - Track API versions and schema changes

## 🛠️ Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yamiSukehiro2907/integrate_extension_backend.git
   cd integrate_extension_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=integrate
   
   # JWT Secret
   PROJECT_SECRET=your_super_secret_key_here
   ```

4. **Start PostgreSQL service**
   ```bash
   # Windows
   net start postgresql-x64-17
   
   # Linux/Mac
   sudo service postgresql start
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

   The server will automatically:
   - Create all necessary database tables
   - Seed mock data (optional)
   - Start on `http://localhost:3000`

## 📁 Project Structure

```
src/
├── config/
│   ├── database.ts              # PostgreSQL connection pool
│   ├── initialize_database.ts   # Table creation
│   └── addMockData.ts          # Mock data seeding
├── controllers/
│   ├── auth.controller.ts       # Authentication logic
│   └── endpoint.controller.ts   # Endpoint management
├── routes/
│   └── auth.route.ts            # API routes
├── helpers/
│   └── token.helper.ts         # JWT token generation
└── server.ts                    # Express app entry point
```

## 🗄️ Database Schema

### Tables

- **users** - User accounts and credentials
- **projects** - API integration projects
- **project_details** - Project metadata (rules, schemas, OpenAPI specs)
- **project_members** - Project team memberships
- **endpoints** - API endpoint tracking

## 🔌 API Endpoints

### Authentication
- `POST /auth` - Authenticate user from extension

### Endpoints
- `GET /projects/endpoint` - Get all endpoints for a project

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

```

## 🔐 Security

- Passwords should be hashed (recommend bcrypt)
- JWT tokens for authentication
- Environment variables for sensitive data
- SQL injection prevention via parameterized queries

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `your_password` |
| `DB_NAME` | Database name | `integrate` |
| `PROJECT_SECRET` | JWT secret key | `random_secret_key` |

## 🐛 Troubleshooting

**Database connection failed:**
- Ensure PostgreSQL service is running
- Verify credentials in `.env` file
- Check if database `integrate` exists

**Port already in use:**
- Change `PORT` in `.env` file
- Kill process using the port

**Tables not created:**
- Check PostgreSQL user permissions
- Review console logs for errors

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Vimal**

## 🔗 Related Projects

- [Integrate Extension](https://github.com/yamiSukehiro2907/integrate_extension) - Browser extension counterpart
