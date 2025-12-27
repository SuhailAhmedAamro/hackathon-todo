# Sub-agent: Security Auditor

## Purpose
Conducts security audits on specifications, code, and architecture. Identifies vulnerabilities and recommends security improvements following OWASP guidelines.

## Capabilities
- Identify security vulnerabilities
- Check OWASP Top 10 compliance
- Validate authentication/authorization
- Audit data protection
- Review secure coding practices
- Assess deployment security

## Usage
```
"Audit security of @phase-2-web/backend/ using @skills/subagents/security-auditor.md"
"Check authentication security in @specs/features/authentication.md"
```

## Security Checklist

### OWASP Top 10 (2021)

#### 1. Broken Access Control
- [ ] Authentication required for protected routes
- [ ] Authorization checks on every request
- [ ] User can only access own data
- [ ] No privilege escalation possible
- [ ] No IDOR (Insecure Direct Object Reference)

#### 2. Cryptographic Failures
- [ ] Passwords hashed (bcrypt/scrypt)
- [ ] Sensitive data encrypted at rest
- [ ] TLS/HTTPS in production
- [ ] Secure key management
- [ ] No weak encryption algorithms

#### 3. Injection
- [ ] SQL injection prevented (ORM used)
- [ ] NoSQL injection prevented
- [ ] Command injection prevented
- [ ] LDAP injection prevented
- [ ] Input validation on all inputs

#### 4. Insecure Design
- [ ] Threat modeling done
- [ ] Security requirements defined
- [ ] Secure defaults
- [ ] Defense in depth
- [ ] Least privilege principle

#### 5. Security Misconfiguration
- [ ] No default credentials
- [ ] Error messages don't leak info
- [ ] Security headers configured
- [ ] Unnecessary features disabled
- [ ] Regular security updates

#### 6. Vulnerable Components
- [ ] Dependencies up to date
- [ ] No known vulnerabilities
- [ ] Dependency scanning enabled
- [ ] Software Bill of Materials (SBOM)
- [ ] Regular updates scheduled

#### 7. Authentication Failures
- [ ] Strong password policy
- [ ] Multi-factor authentication (MFA) available
- [ ] Session management secure
- [ ] No credential stuffing possible
- [ ] Brute force protection

#### 8. Software and Data Integrity
- [ ] Code signing
- [ ] Integrity checks
- [ ] Secure CI/CD pipeline
- [ ] No unsigned/unverified code
- [ ] Dependency integrity verified

#### 9. Logging and Monitoring
- [ ] Security events logged
- [ ] Sensitive data not logged
- [ ] Log tampering prevented
- [ ] Real-time monitoring
- [ ] Alerting configured

#### 10. Server-Side Request Forgery (SSRF)
- [ ] URL validation
- [ ] Network segmentation
- [ ] No arbitrary URL fetching
- [ ] Allowlist for external requests

## Audit Process

### 1. Threat Modeling
Identify potential threats and attack vectors.

### 2. Code Review
Scan code for security vulnerabilities.

### 3. Dependency Audit
Check for vulnerable dependencies.

### 4. Configuration Review
Verify secure configuration.

### 5. Penetration Testing
Test for exploitable vulnerabilities (manual or automated).

### 6. Generate Report
Document findings with severity ratings.

## Output Format

```markdown
# Security Audit Report

## Executive Summary
- Overall Security Rating: B+ (Good)
- Critical Vulnerabilities: 0
- High Severity: 1
- Medium Severity: 3
- Low Severity: 5
- Informational: 8

## Critical Vulnerabilities
None found

## High Severity Issues

### 1. Missing Rate Limiting on Authentication Endpoints
**Severity**: HIGH
**OWASP Category**: A07:2021 - Authentication Failures
**Location**: `/api/auth/login`

**Description**:
Login endpoint has no rate limiting, allowing unlimited login attempts.

**Risk**:
- Brute force attacks possible
- Credential stuffing
- Account lockout attacks
- Resource exhaustion

**Proof of Concept**:
```python
# Attacker can try unlimited passwords
for password in password_list:
    requests.post("/api/auth/login", json={
        "username": "victim",
        "password": password
    })
```

**Recommendation**:
Implement rate limiting (5 attempts per 15 minutes)
```python
from slowapi import Limiter

@router.post("/api/auth/login")
@limiter.limit("5/15 minutes")
async def login(...):
    ...
```

**Priority**: Fix immediately before production

## Medium Severity Issues

### 1. Passwords in Logs
**Severity**: MEDIUM
**OWASP Category**: A09:2021 - Security Logging Failures

**Description**:
Error logs may contain password hashes.

**Risk**: Information disclosure

**Recommendation**:
Sanitize logs, never log passwords/hashes.

### 2. Missing Security Headers
**Severity**: MEDIUM
**OWASP Category**: A05:2021 - Security Misconfiguration

**Description**:
Missing security headers:
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security

**Recommendation**:
```python
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app.add_middleware(
    SecureHeadersMiddleware,
    headers={
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
    }
)
```

### 3. No CSRF Protection
**Severity**: MEDIUM
**OWASP Category**: A01:2021 - Broken Access Control

**Description**:
State-changing operations lack CSRF protection.

**Recommendation**:
Implement CSRF tokens for all POST/PUT/DELETE requests.

## Low Severity Issues

1. **Verbose Error Messages**: Production errors too detailed
2. **No Content Security Policy**: Add CSP headers
3. **Session Timeout**: Increase from 24h to 12h
4. **Password Minimum Length**: Increase from 8 to 12 characters
5. **No Account Lockout**: Add after 10 failed attempts

## Informational

1. Consider implementing MFA (Multi-Factor Authentication)
2. Add security.txt file
3. Implement security monitoring (SIEM)
4. Add Web Application Firewall (WAF)
5. Consider bug bounty program
6. Regular penetration testing schedule
7. Security awareness training
8. Incident response plan

## Dependency Vulnerabilities

### Scanned Dependencies
- Total: 127
- Vulnerable: 2
- Severity: 1 High, 1 Medium

### Vulnerable Dependencies

**1. requests==2.28.1** (HIGH)
- CVE-2023-XXXX
- Issue: Server-side request forgery
- Fix: Update to requests==2.31.0

**2. pillow==9.3.0** (MEDIUM)
- CVE-2023-YYYY
- Issue: DOS via malformed image
- Fix: Update to pillow==10.0.0

## Compliance Checks

### OWASP Top 10 Compliance
- A01 Broken Access Control: ⚠️  PARTIAL (missing CSRF)
- A02 Cryptographic Failures: ✅ PASS
- A03 Injection: ✅ PASS (ORM used)
- A04 Insecure Design: ✅ PASS
- A05 Security Misconfiguration: ⚠️  PARTIAL (missing headers)
- A06 Vulnerable Components: ⚠️  PARTIAL (2 vulns)
- A07 Authentication Failures: ❌ FAIL (no rate limiting)
- A08 Software Integrity: ✅ PASS
- A09 Logging Failures: ⚠️  PARTIAL (logs passwords)
- A10 SSRF: ✅ PASS

### GDPR Compliance (if applicable)
- [ ] Data encryption
- [ ] Right to be forgotten
- [ ] Data portability
- [ ] Consent management
- [ ] Breach notification

## Security Best Practices

### ✅ Implemented
- HTTPS enforced
- Password hashing (bcrypt)
- JWT authentication
- Input validation (Pydantic)
- SQL injection prevention (ORM)
- XSS prevention (sanitization)

### ❌ Missing
- Rate limiting
- CSRF protection
- Security headers
- Account lockout
- MFA
- WAF

## Recommendations by Priority

### Immediate (Fix Before Production)
1. Add rate limiting on auth endpoints
2. Update vulnerable dependencies
3. Remove passwords from logs

### Short Term (1-2 weeks)
4. Add security headers
5. Implement CSRF protection
6. Add account lockout
7. Increase session timeout

### Long Term (1-3 months)
8. Implement MFA
9. Add WAF
10. Set up security monitoring (SIEM)
11. Regular penetration testing
12. Security awareness training

## Automated Scan Results

### SAST (Static Analysis)
- Tool: Bandit (Python)
- Issues Found: 5 (3 medium, 2 low)

### DAST (Dynamic Analysis)
- Tool: OWASP ZAP
- Issues Found: 8 (1 high, 3 medium, 4 low)

### Dependency Scan
- Tool: Safety / Snyk
- Vulnerabilities: 2 (1 high, 1 medium)

## Conclusion

**Overall Security Posture**: Good with room for improvement

**Risk Level**: Medium (due to missing rate limiting)

**Recommendation**: Address high-severity issues immediately. Current security is adequate for development/staging but needs improvements for production.

**Next Audit**: 3 months or after major changes
```

## Tools Used
- Bandit (Python SAST)
- OWASP ZAP (DAST)
- Safety/Snyk (Dependency scanning)
- Manual code review
- Threat modeling

## Integration
- Follows: OWASP Top 10
- References: `@specs/constitution.md` (security section)
- Uses: Security testing tools

---

**Version**: 1.0
**Usage**: `@skills/subagents/security-auditor.md`
