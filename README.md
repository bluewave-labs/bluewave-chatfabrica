
<h1 align="center"><a href="https://bluewavelabs.ca" target="_blank">BlueWave ChatFabrica</a></h1>

<p align="center"><strong>Customizable chatbot that learns from your content to deliver natural, brand-aligned customer support</strong></p>

![chatfabrica](https://github.com/user-attachments/assets/3d02a7d1-5681-40c9-b673-82baf0f6aa35)

ChatFabrica intelligently learns by scanning the web pages and PDFs you select, enabling seamless integration into your website. With ChatFabrica, you can instantly deploy a customer support chatbot tailored to your content, enhancing your user experience from day one.

It can be quickly deployed through a straightforward integration process, offering customizable responses that align with your brand. Its user-friendly interface fosters natural conversations, while the system continuously learns and evolves to enhance customer interactions over time.

If you want a SaaS service instead, check [ChatFabrica's SaaS offerings](https://chatfabrica.com/).

## Use cases

- **Customer support:** Give instant responses to customer queries, ensuring that your customers receive the assistance they need without delay.
- **Sales:** Build your dedicated sales assistant, enhancing customer engagement and boosting conversions. ChatFabrica can also provide personalized recommendations and offer tailored product and service recommendations.
- **Marketing:** Automate interactions to generate leads, build relationships with potential customers, and increase your conversion rates.

## Features

- [x] Open source under AGPLv3 license
- [x] Learn from your PDFs (reports, documents, faqs)
- [x] Learn from your webpage (in full or in part)
- [x] Customizable responses
- [x] Custom tone (e.g fun, serious, or academic)
- [x] Chat log records and conversation histories
- [x] Multi language support

**Roadmap:**

- [ ] Real support agent integration (live chat)
- [ ] API usage
- [ ] Gather and assess leads
- [ ] Zapier integration
- [ ] New AI models
- [ ] Facebook and Instagram integration

## Tech stack

* Frontend: TypeScript, NextJS and Tailwind CSS.
* Backend: TypeScript, Nestjs, PrismaORM, MongoDB and OpenAI


# Installation

This project consists of three main parts: client (Next.js), server (Nest.js) and crawler (Cheerio-Crawlee). Installation steps for each part are given below.

## Requirements

- Node.js (v14 or later recommended)
- npm or yarn
- Git

## Installation

### 1. Cloning the Project

```bash
git clone https://github.com/bluewave-labs/bluewave-chatfabrica.git
cd bluewave-chatfabrica
```

### 2. Installing the Client (Next.js)

```bash
cd client
npm install
# or
yarn install
```

Create the `.env` file and fill in the necessary variables:

```
NEXT_PUBLIC_SENTRY_DSN= # DSN for Sentry bug tracking
NEXT_PUBLIC_BACKEND_URL= # URL of the Backend API
AUTH_SECRET= # Secret key for authentication
NEXT_PUBLIC_URL=http://localhost:3000 # Frontend application URL
```

### 3. Server (Nest.js) Installation

```bash
cd server
npm install
# or
yarn install
```

Create `.env` file and fill in necessary variables:

```
NODE_ENV=development # Application environment
APP_PORT=8000 # Port where application will run
APP_NAME="ChatFabrica API" # Application name
API_PREFIX=api/v1 # API path prefix
FRONTEND_DOMAIN=http://localhost:3000 # Address of frontend application
BACKEND_DOMAIN=http://localhost:8000 # Address of backend application
CRAWL_API_URL= # URL of crawler API
LEMONSQUEEZY_WEBHOOK_SECRET= # LemonSqueezy webhook secret key
DATABASE_URL="asdß" # Database connection URL
OPENAI_API_KEY="asdas" # OpenAI API key
JWT_SECRET= # Secret key for JWT
MAIL_HOST= # Email server address
MAIL_PORT= # Email server port
MAIL_USER= # Email username
MAIL_PASSWORD= # Email password
MAIL_IGNORE_TLS= # Ignore TLS (true/false)
MAIL_SECURE= # Use secure connection (true/false)
MAIL_REQUIRE_TLS= # Require TLS (true/false)
MAIL_DEFAULT_EMAIL= # Default sender email address
MAIL_DEFAULT_NAME= # Default sender name
ENCRYPTION_KEY= # Key to use for encryption
```

### 4. Installing Crawler (Cheerio-Crawlee)

```bash
cd crawler
npm install
# or
yarn install
```


## Running the Application

Open separate terminal windows for each section and run the following commands:

### Client

```bash
cd client
npm run dev
# or
yarn dev
```

### Server

```bash
cd server
npm run start:dev
# or
yarn start:dev
```

### Crawler

```bash
cd crawler
npm run dev
# or
yarn dev
```

The client will run at http://localhost:3000.

The server will run at http://localhost:8000.

The crawler will run at http://localhost:8080.

## Note

Make sure to fill in all `.env` files. These files contain important configuration information that is required for the application to run properly.

If you encounter any problems or need more information, please contact the project manager.

