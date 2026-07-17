# ⚙️ Installation & Setup

## 📋 Prerequisites

Before running the project, ensure the following software is installed:

- Node.js (v18 or higher)
- npm (comes with Node.js)
- Java JDK 22 (or the version configured in the project)
- Apache Maven 3.9+
- Microsoft SQL Server
- SQL Server Management Studio (SSMS) (Recommended)
- Git

---

# 📥 Clone the Repository

```bash
git clone https://github.com/<your-username>/saini-properties.git
cd saini-properties
```

---

# 🗄️ Database Setup

## Step 1: Create Database

Open SQL Server Management Studio (SSMS) and execute:

```sql
CREATE DATABASE SainiProperties;
GO
```

---

## Step 2: Configure Database Credentials

Navigate to:

```text
saini-properties-backend/src/main/resources/application.properties
```

Update the following properties according to your SQL Server configuration:

```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=SainiProperties;encrypt=true;trustServerCertificate=true

spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

server.port=8080
```

---

# ☕ Backend Setup (Spring Boot)

Navigate to the backend folder:

```bash
cd saini-properties-backend
```

Install dependencies and build the project:

```bash
mvn clean install
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

The backend will start on:

```text
http://localhost:8080
```

---

# ⚛️ Frontend Setup (React + Vite)

Open a new terminal.

Navigate to the frontend folder:

```bash
cd saini-properties-frontend
```

Install project dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will start on:

```text
http://localhost:5173
```

---

# 🌐 API Configuration

If your backend runs on another host or port, update the Axios configuration.

Example:

```javascript
const API_BASE_URL = "http://localhost:8080";
```

or

```javascript
axios.create({
    baseURL: "http://localhost:8080"
});
```

---

# 📂 Project Structure

```text
saini-properties/

│
├── saini-properties-backend/
│   ├── src/
│   ├── pom.xml
│   └── application.properties
│
├── saini-properties-frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ▶️ Running the Complete Application

## Terminal 1 (Backend)

```bash
cd saini-properties-backend

mvn spring-boot:run
```

Backend:

```text
http://localhost:8080
```

---

## Terminal 2 (Frontend)

```bash
cd saini-properties-frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔑 Authentication

The application currently supports:

- User Registration
- User Login
- Spring Security
- REST API Authentication
- React Authentication Integration
- Protected Routes

---

# 🚀 Build for Production

## Frontend

```bash
cd saini-properties-frontend

npm run build
```

The production build will be generated inside:

```text
dist/
```

---

## Backend

```bash
cd saini-properties-backend

mvn clean package
```

The executable JAR will be generated inside:

```text
target/
```

Run it using:

```bash
java -jar target/saini-properties-backend-0.0.1-SNAPSHOT.jar
```

---

# 🌍 Deployment

## Frontend

Deploy on:

- Vercel
- Netlify

## Backend

Deploy on:

- Render
- Railway
- Azure App Service
- AWS Elastic Beanstalk

---

# 📞 Contact

**Developer:** Vansh Saini

GitHub: https://github.com/<your-username>

Email: vs7579030670@gmail.com
