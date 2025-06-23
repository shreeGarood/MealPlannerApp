# 🍽️ Meal Planner Application

A modern, full-stack meal planning application built with Next.js 15, featuring recipe management, weekly meal planning, grocery list generation, and multi-language support.

## ✨ Features

- **🔐 Authentication System**: Secure user registration and login with JWT tokens
- **📱 Responsive Design**: Mobile-first approach with Tailwind CSS
- **🌍 Multi-language Support**: English and Arabic localization
- **🌓 Dark Mode**: Built-in theme switching with next-themes
- **📅 Weekly Meal Planning**: Plan meals for each day of the week
- **🥘 Recipe Management**: Create, edit, and organize your recipes
- **📝 Grocery List Generation**: Automatically generate shopping lists from meal plans
- **🔍 Recipe Search**: Search recipes by name, ingredients, or tags
- **📊 Nutrition Tracking**: Track nutritional information for each recipe

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15.2.4](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable components built with Radix UI
- **[Redux Toolkit](https://redux-toolkit.js.org/)** - State management
- **[React Hook Form](https://react-hook-form.com/)** + [Zod](https://zod.dev/) - Form handling and validation
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library

### Backend
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database
- **[Mongoose](https://mongoosejs.com/)** - MongoDB object modeling
- **[JWT](https://jwt.io/)** - JSON Web Tokens for authentication
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** - Password hashing

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Git** - Version control

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB database (local or cloud)
- npm or pnpm package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd meal-planner
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/meal-planner
   
   # JWT Secret
   JWT_SECRET=your-secret-key-here
   
   # Next.js
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
meal-planner/
├── app/                      # Next.js App Router
│   ├── [lang]/              # Dynamic language routing
│   │   ├── (auth)/          # Authentication pages
│   │   │   ├── login/       # Login page
│   │   │   └── register/    # Registration page
│   │   ├── (protected)/     # Protected routes
│   │   │   ├── dashboard/   # User dashboard
│   │   │   ├── meal-planner/# Weekly meal planning
│   │   │   └── grocery-list/# Shopping list
│   │   └── layout.tsx       # Root layout
│   └── api/                 # API routes
│       ├── auth/            # Authentication endpoints
│       ├── recipes/         # Recipe CRUD operations
│       └── meal-plans/      # Meal plan management
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── auth-guard.tsx       # Authentication HOC
│   ├── navbar.tsx           # Navigation component
│   └── recipe-form.tsx      # Recipe creation form
├── lib/                     # Utilities and configurations
│   ├── db.ts               # MongoDB connection
│   ├── models/             # Mongoose models
│   │   ├── User.ts         # User model
│   │   ├── Recipe.ts       # Recipe model
│   │   └── MealPlan.ts     # Meal plan model
│   ├── redux/              # Redux store and slices
│   └── i18n/               # Internationalization
├── public/                  # Static assets
└── middleware.ts            # Next.js middleware
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Recipes
- `GET /api/recipes` - Get all user recipes
- `POST /api/recipes` - Create new recipe
- `GET /api/recipes/[id]` - Get specific recipe
- `PUT /api/recipes/[id]` - Update recipe
- `DELETE /api/recipes/[id]` - Delete recipe

### Meal Plans
- `GET /api/meal-plans` - Get user's meal plans
- `POST /api/meal-plans` - Create meal plan
- `PUT /api/meal-plans/[id]` - Update meal plan
- `DELETE /api/meal-plans/[id]` - Delete meal plan

### Grocery List
- `GET /api/grocery-list` - Generate grocery list from meal plans

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

### Docker
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔐 Security Features

- **Password Hashing**: Uses bcryptjs for secure password storage
- **JWT Authentication**: Stateless authentication with refresh tokens
- **Protected Routes**: Middleware-based route protection
- **Input Validation**: Zod schemas for data validation
- **CORS Protection**: Configured for production use

## 🌐 Internationalization

The app supports multiple languages:
- English (en)
- Arabic (ar)

Language files are located in:
- `/messages/en.json`
- `/messages/ar.json`

## 🎨 UI Components

The application uses shadcn/ui components including:
- Accordion, Alert, Avatar
- Button, Badge, Card
- Dialog, Dropdown Menu
- Form components with validation
- Tables, Tabs, Toast notifications
- And 40+ more components

## 📱 Screenshots

*[Add screenshots of your application here]*

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👥 Authors

- Shrinath Himane - *Initial work*

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- All contributors who helped with this project

---

Made with ❤️ by Shrinath Himane