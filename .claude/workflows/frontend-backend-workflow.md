# Frontend + Backend Engineer Agent Collaboration Workflow

## Overview
This document defines a collaborative workflow between the **Frontend Engineer Agent** and **Backend Engineer Agent**. It ensures seamless integration between UI, API, and infrastructure layers while maintaining high standards of code quality, security, and performance.

---

## Collaboration Goals
- **Faster Delivery:** Parallelize frontend and backend development.
- **Clear Handoffs:** Use well-defined API contracts and shared documentation.
- **Consistency:** Enforce type safety, error handling, and testing across the stack.
- **Automation:** Reduce friction with CI/CD pipelines and automated integration checks.

---

## Workflow Stages

### 1. Requirements Alignment
| Step | Agent             | Action |
|------|------------------|--------|
| 1.1  | Product Owner     | Provide feature requirements (user stories, wireframes). |
| 1.2  | Backend Engineer  | Propose API contract (OpenAPI/GraphQL schema). |
| 1.3  | Frontend Engineer | Review API contract, suggest adjustments for UI needs. |

**Deliverables:**  
- API Specification Document (OpenAPI/GraphQL)  
- Data models and endpoint descriptions  
- Frontend wireframes/UI requirements  

---

### 2. Environment Setup
| Step | Agent             | Action |
|------|------------------|--------|
| 2.1  | Backend Engineer  | Set up API server, database, and initial endpoints. |
| 2.2  | Frontend Engineer | Set up frontend framework (React/Vue), state management, and mock API integration. |

**Deliverables:**  
- Dockerized backend environment  
- Frontend project scaffold with mock services  

---

### 3. API → Frontend Integration
| Step | Agent             | Action |
|------|------------------|--------|
| 3.1  | Backend Engineer  | Implement and deploy endpoints to staging. |
| 3.2  | Frontend Engineer | Connect components to real API, handle authentication, error states, and loading states. |

**Deliverables:**  
- API integrated frontend views  
- Test data and fixtures for development  

---

### 4. Testing & Validation
| Step | Agent             | Action |
|------|------------------|--------|
| 4.1  | Backend Engineer  | Write and run API tests (unit + integration). |
| 4.2  | Frontend Engineer | Write UI tests (Jest, React Testing Library, Cypress). |
| 4.3  | Both Agents       | Conduct contract testing to ensure API and UI alignment. |

**Deliverables:**  
- Passing API and UI tests  
- Verified API contract (no breaking changes)  

---

### 5. Deployment & Handoffs
| Step | Agent             | Action |
|------|------------------|--------|
| 5.1  | Backend Engineer  | Deploy backend service to cloud (AWS, GCP, Azure). |
| 5.2  | Frontend Engineer | Deploy frontend build (Vercel, Netlify, S3 + CloudFront). |
| 5.3  | Both Agents       | Validate full-stack integration and sign off. |

**Deliverables:**  
- Production-ready full-stack application  
- CI/CD workflows with automated tests and linting  

---

## Collaboration Rules
1. **API Contracts are Immutable Once Approved** – Changes require review by both agents.
2. **Type Safety is Mandatory** – Use shared TypeScript types (e.g., via `openapi-typescript` or `graphql-codegen`).
3. **Pull Requests Must Include Tests** – No code merges without coverage for core logic.
4. **Error Handling** – Standardized error response format must be used across frontend and backend.
5. **Continuous Feedback Loop** – Weekly integration sync or automated review checkpoints.

---

## Example Collaboration Scenario
### Task: "Implement user dashboard with authentication."
1. **Backend Agent:**
   - Designs `/auth/login`, `/auth/register`, `/users/me` endpoints.
   - Adds JWT authentication and role-based access control.
   - Provides Swagger documentation.

2. **Frontend Agent:**
   - Builds login form, dashboard layout, and protected routes.
   - Integrates API with token-based auth.
   - Implements loading/error states.

3. **Both Agents:**
   - Test API and UI integration in staging.
   - Fix any contract mismatches.
   - Deploy end-to-end feature.

---

## Strengths of Collaboration
- Reduced integration bugs.
- Faster feature delivery.
- Scalable, maintainable, and testable architecture.

## Limitations
- Requires strong coordination (preferably automated contract testing).
- Dependency on clear initial API specification.

---

## Versioning
| Version | Date       | Author         | Changes                          |
|---------|-----------|----------------|----------------------------------|
| 1.0.0   | 2025-08-04 | Gregory Starr  | Initial collaboration workflow   |

---
