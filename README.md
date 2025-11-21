# HashFast

HashFast makes it easy to request and receive payments on Hedera.

[www.hashfast.app](https://www.hashfast.app)
[testnet.hashfast.app](http://testnet.hashfast.app)

### Installation

1. **Clone and install dependencies**

```bash
npm install
```

3. **Set up the database**

```bash
npx prisma db push

```

4. **Start the development server**

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
├── assets/css/          # Global styles
├── components/          # Vue components
├── lib/                 # Utilities and services
├── middleware/          # Nuxt middleware
├── pages/               # File-based routing
├── prisma/              # Database schema and migrations
├── public/              # Public files (images)
├── server/api/          # API routes
├── app.vue              # Root component
└── nuxt.config.ts       # Nuxt configuration
```
