---
name: security
description: Security best practices and implementation guidelines. Covers authentication, authorization, input validation, secure coding patterns, and security headers. Use when implementing auth, reviewing code for vulnerabilities, or hardening applications.
---

# Security

Comprehensive security guidelines for web and mobile applications.

## When to Use

- Implementing authentication/authorization
- Reviewing code for vulnerabilities
- Setting up security headers
- Handling sensitive data
- Hardening production deployments

## Authentication

### Password Hashing

```typescript
// ✅ Good - bcrypt with sufficient rounds
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12; // minimum 10, recommend 12+

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

```typescript
// ❌ Bad - never use these for passwords
import crypto from "crypto";
const hash = crypto.createHash("md5").update(password).digest("hex"); // NEVER
const hash = crypto.createHash("sha1").update(password).digest("hex"); // NEVER
const hash = crypto.createHash("sha256").update(password).digest("hex"); // Still bad for passwords
```

### JWT Implementation

```typescript
// ✅ Good - proper JWT setup
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

function generateTokens(userId: string) {
  const accessToken = jwt.sign(
    { sub: userId, type: "access" },
    process.env.JWT_SECRET!,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
  
  const refreshToken = jwt.sign(
    { sub: userId, type: "refresh" },
    process.env.JWT_REFRESH_SECRET!, // Different secret
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
  
  return { accessToken, refreshToken };
}

function verifyAccessToken(token: string) {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    if (payload.type !== "access") throw new Error("Invalid token type");
    return payload;
  } catch {
    return null;
  }
}
```

```typescript
// ❌ Bad JWT practices
jwt.sign(payload, "hardcoded-secret"); // Hardcoded secret
jwt.sign(payload, secret, { expiresIn: "365d" }); // Too long expiry
jwt.verify(token, secret, { algorithms: ["none"] }); // Allows unsigned tokens
```

### Secure Cookie Settings

```typescript
// ✅ Good - secure cookie configuration
res.cookie("session", sessionId, {
  httpOnly: true,      // Not accessible via JavaScript
  secure: true,        // HTTPS only
  sameSite: "strict",  // CSRF protection
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  path: "/",
});

// For refresh tokens
res.cookie("refreshToken", token, {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  path: "/api/auth/refresh", // Limit to refresh endpoint only
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

### Rate Limiting (Auth Endpoints)

```typescript
// Express with express-rate-limit
import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: { error: "Too many attempts, try again later" },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip + req.body?.email, // Per IP + email combo
});

app.post("/api/auth/login", authLimiter, loginHandler);
app.post("/api/auth/register", authLimiter, registerHandler);
app.post("/api/auth/forgot-password", authLimiter, forgotPasswordHandler);
```

## Authorization

### IDOR Prevention

```typescript
// ❌ Bad - IDOR vulnerability
app.get("/api/users/:id", async (req, res) => {
  const user = await db.user.findById(req.params.id);
  res.json(user); // Anyone can access any user!
});

// ✅ Good - ownership check
app.get("/api/users/:id", authenticate, async (req, res) => {
  const userId = req.params.id;
  
  // Only allow access to own data (or admin)
  if (userId !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ error: "Forbidden" });
  }
  
  const user = await db.user.findById(userId);
  res.json(user);
});
```

### Role-Based Access Control

```typescript
// Middleware for role checking
function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    
    next();
  };
}

// Usage
app.delete("/api/users/:id", 
  authenticate, 
  requireRole("admin"), 
  deleteUserHandler
);

app.get("/api/reports", 
  authenticate, 
  requireRole("admin", "manager"), 
  getReportsHandler
);
```

## Input Validation

### SQL Injection Prevention

```typescript
// ❌ Bad - SQL injection
const query = `SELECT * FROM users WHERE email = '${email}'`;
db.query(query);

// ✅ Good - parameterized queries
const query = "SELECT * FROM users WHERE email = $1";
db.query(query, [email]);

// ✅ Good - ORM with proper usage
const user = await prisma.user.findUnique({
  where: { email }, // Prisma handles parameterization
});
```

### XSS Prevention

```typescript
// ❌ Bad - XSS vulnerability (React)
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ Good - sanitize if HTML is necessary
import DOMPurify from "dompurify";

<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userContent) 
}} />

// ✅ Best - avoid HTML rendering of user content
<div>{userContent}</div> // React auto-escapes
```

### Input Validation with Zod

```typescript
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(100).regex(/^[a-zA-Z\s]+$/),
  age: z.number().int().min(13).max(120).optional(),
});

// In handler
app.post("/api/users", async (req, res) => {
  const result = userSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ 
      error: "Validation failed",
      details: result.error.flatten(),
    });
  }
  
  const validatedData = result.data;
  // Proceed with validated data
});
```

### File Upload Validation

```typescript
import { fileTypeFromBuffer } from "file-type";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

async function validateUpload(file: Buffer, filename: string) {
  // Check size
  if (file.length > MAX_SIZE) {
    throw new Error("File too large");
  }
  
  // Check actual file type (not just extension)
  const type = await fileTypeFromBuffer(file);
  if (!type || !ALLOWED_TYPES.includes(type.mime)) {
    throw new Error("Invalid file type");
  }
  
  // Sanitize filename
  const sanitizedName = filename
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .substring(0, 100);
  
  return { buffer: file, filename: sanitizedName, mime: type.mime };
}
```

## Security Headers

### Next.js

```typescript
// next.config.js
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self';
      connect-src 'self' https://api.example.com;
      frame-ancestors 'none';
    `.replace(/\n/g, ""),
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};
```

### Express (Helmet.js)

```typescript
import helmet from "helmet";

app.use(helmet());

// Or with custom config
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.example.com"],
        frameAncestors: ["'none'"],
      },
    },
    hsts: {
      maxAge: 63072000,
      includeSubDomains: true,
      preload: true,
    },
  })
);
```

## CORS Configuration

```typescript
// ❌ Bad - open to all origins
app.use(cors()); // Allows everything

// ❌ Bad - wildcard in production
app.use(cors({ origin: "*" }));

// ✅ Good - explicit origins
const allowedOrigins = [
  "https://myapp.com",
  "https://www.myapp.com",
];

if (process.env.NODE_ENV === "development") {
  allowedOrigins.push("http://localhost:3000");
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
```

## Secrets Management

### Environment Variables

```typescript
// ✅ Good - validate env vars at startup
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
});

const env = envSchema.parse(process.env);

export default env;
```

```env
# .env.example (commit this)
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/db
JWT_SECRET=your-secret-here-min-32-chars
JWT_REFRESH_SECRET=another-secret-here-min-32-chars

# .env.local (never commit - add to .gitignore)
```

### .gitignore Security

```gitignore
# Secrets
.env
.env.local
.env.*.local
*.pem
*.key
*secret*
*credentials*

# Config with secrets
firebase-adminsdk*.json
serviceAccountKey.json
google-credentials.json
```

## Error Handling

```typescript
// ❌ Bad - exposes internals
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack, // Never in production!
    query: req.query, // Sensitive data
  });
});

// ✅ Good - safe error response
app.use((err, req, res, next) => {
  // Log full error internally
  console.error("Error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    userId: req.user?.id,
  });
  
  // Send safe response
  const isProduction = process.env.NODE_ENV === "production";
  
  res.status(err.status || 500).json({
    error: isProduction ? "Internal server error" : err.message,
    requestId: req.id, // For support lookup
  });
});
```

## React Native Specific

### Secure Storage

```typescript
// ❌ Bad - AsyncStorage is not encrypted
import AsyncStorage from "@react-native-async-storage/async-storage";
await AsyncStorage.setItem("token", accessToken); // Not secure!

// ✅ Good - use secure storage
import * as SecureStore from "expo-secure-store"; // Expo
// or
import EncryptedStorage from "react-native-encrypted-storage"; // Bare RN

await SecureStore.setItemAsync("token", accessToken);
```

### Certificate Pinning

```typescript
// For sensitive APIs, implement certificate pinning
// Using react-native-ssl-pinning or TrustKit
```

### No Secrets in Bundle

```typescript
// ❌ Bad - secrets in app bundle
const API_KEY = "sk-1234567890"; // Extracted via reverse engineering

// ✅ Good - fetch from secure backend
const config = await fetch("/api/config", {
  headers: { Authorization: `Bearer ${token}` },
});
```

## FastAPI/Python Specific

### Input Validation with Pydantic

```python
from pydantic import BaseModel, EmailStr, Field, validator

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    name: str = Field(..., min_length=1, max_length=100)
    
    @validator("password")
    def password_strength(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain uppercase")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain digit")
        return v

# Usage - automatic validation
@app.post("/users")
async def create_user(user: UserCreate):
    # user is already validated
    pass
```

### Password Hashing

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

### JWT Authentication

```python
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

SECRET_KEY = os.getenv("JWT_SECRET")  # Never hardcode
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> User:
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = await get_user(user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# Usage
@app.get("/me")
async def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user
```

### SQL Injection Prevention

```python
# ❌ Bad - SQL injection
@app.get("/users/{user_id}")
async def get_user(user_id: str):
    query = f"SELECT * FROM users WHERE id = '{user_id}'"  # VULNERABLE
    result = await database.execute(query)

# ✅ Good - SQLAlchemy ORM
from sqlalchemy.orm import Session

@app.get("/users/{user_id}")
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    return user

# ✅ Good - parameterized query
from sqlalchemy import text

query = text("SELECT * FROM users WHERE id = :user_id")
result = await database.execute(query, {"user_id": user_id})
```

### Rate Limiting

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/auth/login")
@limiter.limit("5/minute")
async def login(request: Request, credentials: LoginRequest):
    pass
```

### CORS Configuration

```python
from fastapi.middleware.cors import CORSMiddleware

# ❌ Bad
app.add_middleware(CORSMiddleware, allow_origins=["*"])  # Too permissive

# ✅ Good
origins = [
    "https://myapp.com",
    "https://www.myapp.com",
]

if os.getenv("ENV") == "development":
    origins.append("http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)
```

### Environment Variables

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    jwt_secret: str
    jwt_refresh_secret: str
    env: str = "development"
    
    class Config:
        env_file = ".env"

settings = Settings()  # Validates at startup
```

## Security Checklist

### Pre-Deployment

```
□ No hardcoded secrets in code
□ All secrets in environment variables
□ .env files in .gitignore
□ npm audit / yarn audit passing
□ Security headers configured
□ HTTPS enforced
□ CORS properly configured
□ Rate limiting on auth endpoints
□ Input validation on all endpoints
□ SQL injection prevention verified
□ XSS prevention verified
□ Authentication on all protected routes
□ Authorization checks (IDOR prevention)
□ Error messages don't leak internals
□ Logging doesn't include sensitive data
□ Debug mode disabled
```

### Periodic Review

```
□ Dependency updates (security patches)
□ Access key rotation
□ User permission audit
□ Log review for anomalies
□ SSL certificate expiry check
```

## References

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OWASP Cheat Sheets: https://cheatsheetseries.owasp.org/
- Node.js Security Best Practices: https://nodejs.org/en/docs/guides/security/
- Next.js Security Headers: https://nextjs.org/docs/app/api-reference/config/next-config-js/headers
- Helmet.js: https://helmetjs.github.io/
- JWT Best Practices: https://datatracker.ietf.org/doc/html/rfc8725
- FastAPI Security: https://fastapi.tiangolo.com/tutorial/security/
- FastAPI OAuth2: https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/
- Python passlib: https://passlib.readthedocs.io/
- SQLAlchemy Security: https://docs.sqlalchemy.org/en/20/faq/security.html
