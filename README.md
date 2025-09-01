# R22EQ035
# System Design Document — React URL Shortener

## 1. Overview
This project is a **React-based URL Shortener Web App**. It allows users to:  
- Shorten up to 5 URLs concurrently.  
- Optionally specify custom shortcodes and validity periods.  
- View analytics for each short URL including clicks, timestamps, and coarse location data.  

The system uses **vanilla CSS** for styling and a **custom logging middleware** for all logging instead of console logging. It is designed as a **client-side React application**, with optional backend integration if needed for persistence.  

---

## 2. Architectural Decisions
- **React for Frontend**: Component-based UI for modularity and maintainability.  
- **Vanilla CSS**: Lightweight styling; no external CSS frameworks besides Material UI if preferred.  
- **Logging Middleware**: Centralized logging for all user actions, API calls, and errors.  
- **Client-side Routing**: Uses React Router to handle short URL redirection within SPA.  
- **State Management**: React `useState` and `useEffect` manage URL entries, shortcodes, and analytics.  
- **Data Storage**: LocalStorage is used to persist URL data in-session.  

---

## 3. Data Modeling

### URL Entry Object
```json
{
  "longUrl": "string",
  "shortcode": "string",
  "createdAt": "ISO timestamp",
  "expiresAt": "ISO timestamp",
  "validityMinutes": 30,
  "clicksCount": 0,
  "clickDetails": [
    {
      "timestamp": "ISO timestamp",
      "referrer": "string",
      "locale": "string"
    }
  ]
}

4. Technology Stack & Justification
Layer	Technology	Justification
Frontend	React + Vanilla CSS	Component-based UI, simple styling, easy state management
Routing	React Router	SPA-based redirection for short URLs
State	React useState / useEffect	Lightweight, simple, sufficient for small-scale app
Logging	Custom Logging Middleware	Captures all user interactions and API events; no console logs
Storage	LocalStorage	Persistent session storage without backend dependency
API Calls	Axios / Fetch (optional)	For integration with registration or backend API

5. Assumptions
Users are pre-authorized; no login required.
Validity period is always in integer minutes; default = 30 minutes.
Shortcodes are alphanumeric, 4–10 characters recommended.
Maximum 5 URLs can be shortened simultaneously.
Redirects are handled client-side via React Router.
All logging occurs through the custom logging middleware.

6. System Architecture
Component Overview
URLShortenerPage: Input forms for up to 5 URLs, custom shortcodes, validity.
URLResults: Displays created short URLs with creation and expiry dates.
URLStatisticsPage: Shows historical data and analytics for all shortened URLs in the session.
RedirectHandler: Handles redirection from short URLs to original long URLs.
LoggingMiddleware: Wraps API calls and user events to log structured events.

Flow Diagram (Simplified)
[User Input Form] 
      |
      v
[URLShortenerPage] --(LoggingMiddleware)--> [LocalStorage / API] 
      |
      v
[URLResults / URLStatisticsPage] 
      |
      v
[RedirectHandler via React Router] --> [Original Long URL]

7. Key Features

Short URL Creation
Validate URL format and optional shortcode.
Ensure shortcode uniqueness in session.
Default validity period = 30 minutes if not specified.

Client-Side Redirect
React Router intercepts short URL access and redirects to the original long URL.

Analytics
Track number of clicks per URL.
Log timestamp, referrer, and approximate locale per click.

Logging Middleware
Logs: URL submissions, shortcode generation, redirection, errors.
Structured JSON logs; no console.log used.

Error Handling
Detect malformed URLs.
Notify users if shortcode collisions occur.
Display user-friendly messages for expired URLs.

8. Shortcode Management
Custom shortcode: User-provided; must be unique.
Auto-generated shortcode: Random alphanumeric string; uniqueness ensured by checking session storage.
Collision handling: On duplicate, prompt user or regenerate shortcode.

9. Expiry Handling
Short URLs expire after the specified validity period.
Redirect API validates expiry and refuses expired URLs.
Expiry info displayed in URLResults and Statistics page.

10. Logging Strategy
All events go through custom logging middleware.
Events logged:
URL submissions
Shortcode generation
Redirection events
Expired URL access attempts
Errors and validation failures
Logs stored in structured JSON for potential future backend integration.

11. Scalability & Maintainability
Component-based React architecture allows easy addition of features like backend storage, authentication, or multi-session analytics.
Logging middleware is modular and can be extended for server-side logging.
LocalStorage provides simple persistence; can later be replaced by a database for production.

12. Future Enhancements
Backend integration with database for persistence.
Multi-user support with authentication.
Enhanced analytics with charts and CSV export.
URL shortening service deployment for public access.
TTL-based automatic cleanup of expired URLs.

