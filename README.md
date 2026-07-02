<div align="center">

<img src="docs/images/logo.png" alt="Recur logo" width="90" />

# Recur

Keep track of what you're subscribed to, see how much it all adds up to, and get an email before anything renews.

[![Live](https://img.shields.io/badge/live-recur--app.com-6366f1)](https://recur-app.com)

<img src="docs/images/home_angle.png" alt="Recur" width="820" />

</div>

## About

Recur is a subscription tracker I built end to end. You add the things you pay for on a recurring basis, and it keeps tabs on the cost, sorts your spending by category, and emails you a few days before a subscription renews so you have time to cancel if you want to.

It's a React frontend and a FastAPI backend with MongoDB, using Clerk for auth and Resend for the reminder emails. Everything runs in Docker, deployed to EC2 through GitHub Actions.

## Screenshots

| Dashboard | Subscriptions |
|---|---|
| <img src="docs/images/dashboard.png" width="400" /> | <img src="docs/images/subscriptions.png" width="400" /> |

| Analytics | Home |
|---|---|
| <img src="docs/images/analytics.png" width="400" /> | <img src="docs/images/home.png" width="400" /> |

## Setup

You'll need Docker, a MongoDB connection string, and a Clerk app. A Resend API key is optional (without it, emails are just skipped).

1. Copy `server/.env.example` to `server/.env` and fill in your values.
2. Copy `client/.env.example` to `client/.env` and add your Clerk publishable key.
3. Start it:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_xxx VITE_API_URL="" docker-compose -f docker-compose.dev.yaml up --build
```

The app runs at http://localhost and the API at http://localhost:8000.

## Deployment

Pushing to `main` builds the Docker images, pushes them to AWS ECR, and deploys to EC2 over SSH. nginx serves the frontend, proxies the API, and handles HTTPS with a Let's Encrypt certificate.
