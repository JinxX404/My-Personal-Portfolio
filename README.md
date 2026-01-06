# Personal Portfolio

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?style=flat-square&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4.6-38B2AC?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase)

**My personal portfolio website** - A full-stack platform showcasing my projects, skills, and blog posts.

Built with React, Supabase, and Tailwind CSS.

</div>

---

## About This Project

This is my personal portfolio website with a custom-built content management system. It allows me to:

- 🎨 **Showcase my projects** with detailed case studies
- 📝 **Write and publish** blog posts about my work
- ⚙️ **Manage all content** through an admin dashboard
- 🔗 **Connect with visitors** via contact forms and social links
- 📊 **Display my skills** with interactive visualizations

## 🎯 Key Features

### 🌐 Public Portfolio

- ✅ **Dynamic Hero Section** - Animated code snippets with rotating tech showcases
- ✅ **Skills Visualization** - Interactive skill bars with proficiency levels
- ✅ **Project Gallery** - Filterable portfolio with detailed case studies
- ✅ **Blog Platform** - SEO-optimized articles with reading time
- ✅ **Contact Hub** - Multi-purpose forms (projects, collaboration, speaking)
- ✅ **Social Integration** - Unlimited social links with auto-detected logos
- ✅ **Dark Mode** - Theme switching with smooth transitions
- ✅ **Mobile Responsive** - Perfect on all devices

### 🎛️ Admin Dashboard

- ✅ **Settings Manager** - Complete profile & site configuration
  - Profile info (name, title, bio, avatar, CV)
  - Unlimited social links (auto-logo detection)
  - Site branding (colors, logo, favicon)
  - SEO settings (meta tags, analytics)

- ✅ **Skills Manager** - Organize skills by categories
  - Frontend, Backend, Tools, etc.
  - Proficiency levels (0-100)
  - Custom icons and colors
  - Drag-and-drop ordering

- ✅ **Project Manager** - Comprehensive project creation
  - Rich media (hero images, screenshots, mockups)
  - Technologies and metrics
  - Case study sections (problem, solution, results)
  - Draft/Published workflow
  - SEO metadata

- ✅ **Blog Editor** - Full-featured content creation
  - Rich text editing
  - Image uploads
  - Categories and tags
  - Reading time calculation
  - SEO optimization
  - Draft/Published states

### 🔧 Technical Features

- ✅ **Supabase Backend** - PostgreSQL database with real-time subscriptions
- ✅ **Context API** - Global state management for settings, projects, blogs
- ✅ **Row Level Security** - Database-level security policies
- ✅ **Auto-save** - Never lose your work
- ✅ **Error Boundaries** - Graceful error handling
- ✅ **SEO Optimized** - Meta tags, OpenGraph, Twitter Cards
- ✅ **Performance** - Code splitting, lazy loading, optimized builds

## 🛠️ Tech Stack

### Frontend Core
```
⚛️  React 18.2.0          - Modern UI library with hooks
🎨  Tailwind CSS 3.4.6    - Utility-first styling
⚡  Vite 5.0.0            - Lightning-fast build tool
🎬  Framer Motion 10.16.4 - Smooth animations
🧭  React Router 6.0.2    - Client-side routing
```

### Backend & Database
```
🗄️  Supabase              - PostgreSQL + Auth + Storage
📊  PostgreSQL            - Relational database
🔐  Row Level Security    - Database-level permissions
🔄  Real-time             - Live data subscriptions
```

### UI & Components
```
🎨  Lucide React 0.484.0  - Beautiful icons (1000+)
📝  React Hook Form       - Form validation & management
📄  React Helmet          - SEO & meta tags
🎯  Custom Components     - Reusable UI elements
```

### Data & Visualization
```
📈  Recharts 2.15.2       - Charts and graphs
📊  D3.js 7.9.0           - Advanced visualizations
🌐  Axios 1.8.4           - HTTP requests
📅  Date-fns 4.1.0        - Date utilities
```

### State Management
```
🔄  React Context API     - Global state
🏪  Custom Contexts       - Settings, Projects, Blogs, Skills
⚡  Real-time Updates     - Live data sync
```

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js** v16.x or higher ([Download](https://nodejs.org/))
- ✅ **npm** or **yarn** package manager
- ✅ **Supabase Account** ([Sign up free](https://supabase.com))
- ✅ **Git** for version control
- ✅ **Modern browser** with ES6+ support

## 🚀 Quick Start

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/JinxX404/my_portfolio.git
cd my_portfolio
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Set Up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for setup to complete

2. **Run Database Setup**
   - Open your Supabase project
   - Go to SQL Editor
   - Copy contents of `database/COMPLETE_SETUP.sql`
   - Paste and run in SQL Editor
   - ✅ All tables, policies, and initial data created!

3. **Get Your Credentials**
   - Go to Project Settings → API
   - Copy your Project URL
   - Copy your `anon` public key

### 4️⃣ Configure Environment

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-project-url-here
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# App Configuration
VITE_APP_TITLE=Portfolio Pro
VITE_APP_DESCRIPTION=Professional Portfolio & CMS
VITE_APP_AUTHOR=Your Name
```

### 5️⃣ Start Development Server

```bash
npm run dev
```

🎉 Open [http://localhost:4028](http://localhost:4028) - Your portfolio is live!

### 6️⃣ Configure Your Portfolio

1. Navigate to `/settings-manager`
2. Fill in your profile information
3. Add your social links
4. Customize site settings
5. Click "Save All Settings"

### 7️⃣ Add Content

- **Skills**: Go to `/skills-manager`
- **Projects**: Go to `/project-manager`
- **Blog Posts**: Go to `/blog-editor`

### 8️⃣ Build for Production

```bash
npm run build
```

Build files will be in the `build/` directory.

## 📁 Project Structure

```
my_portfolio/
├── 📂 database/                # Database setup scripts
│   ├── COMPLETE_SETUP.sql     # ⭐ Main setup file (use this!)
│   ├── README.md              # Database documentation
│   └── ...                    # Utility scripts
│
├── 📂 public/                 # Static assets
│   └── assets/images/         # Images and media
│
├── 📂 src/
│   ├── 📂 components/         # Reusable UI components
│   │   ├── ui/                # Header, Footer, etc.
│   │   ├── AppIcon.jsx        # Icon wrapper
│   │   ├── AppImage.jsx       # Image wrapper
│   │   ├── ErrorBoundary.jsx  # Error handling
│   │   ├── Footer.jsx         # Dynamic footer
│   │   └── ScrollToTop.jsx    # Scroll management
│   │
│   ├── 📂 context/            # React Context providers
│   │   ├── PortfolioSettingsContext.jsx  # Settings state
│   │   ├── ProjectsContext.jsx           # Projects state
│   │   ├── BlogsContext.jsx              # Blogs state
│   │   ├── SkillsContext.jsx             # Skills state
│   │   └── ThemeContext.jsx              # Theme state
│   │
│   ├── 📂 pages/              # Page components
│   │   ├── homepage/          # Landing page
│   │   ├── portfolio-gallery/ # Projects showcase
│   │   ├── blog-insights/     # Blog listing
│   │   ├── blog-detail/       # Individual blog
│   │   ├── case-study-detail/ # Project details
│   │   ├── about-story/       # About page
│   │   ├── contact-hub/       # Contact forms
│   │   ├── admin-dashboard/   # ⚙️ Admin panel
│   │   │   └── components/
│   │   │       ├── SettingsManager.jsx  # Settings UI
│   │   │       ├── SkillsManager.jsx    # Skills CRUD
│   │   │       ├── ProjectsManager.jsx  # Projects CRUD
│   │   │       └── BlogsManager.jsx     # Blogs CRUD
│   │   ├── project-manager/   # Project creation
│   │   └── blog-editor/       # Blog creation
│   │
│   ├── 📂 services/           # API services
│   │   ├── skillsService.js   # Skills API
│   │   ├── projectsService.js # Projects API
│   │   └── blogsService.js    # Blogs API
│   │
│   ├── 📂 lib/                # Libraries & utilities
│   │   └── supabase.js        # Supabase client
│   │
│   ├── 📂 styles/             # Global styles
│   │   ├── index.css          # Base styles
│   │   └── tailwind.css       # Tailwind imports
│   │
│   ├── App.jsx                # Main app with providers
│   ├── Routes.jsx             # Route definitions
│   └── index.jsx              # Entry point
│
├── .env                       # Environment variables
├── .gitignore                 # Git ignore rules
├── index.html                 # HTML template
├── package.json               # Dependencies
├── tailwind.config.js         # Tailwind config
├── vite.config.mjs            # Vite config
└── README.md                  # This file
```

## 🎨 Design System

### Color Palette
- **Primary**: Deep navy (`#1a365d`) - Main brand color
- **Secondary**: Sophisticated gray (`#2d3748`) - Supporting elements
- **Accent**: Electric blue (`#3182ce`) - Interactive elements
- **CTA**: Warm orange (`#ed8936`) - Call-to-action buttons
- **Success**: Forest green (`#38a169`) - Positive states
- **Warning**: Warm amber (`#d69e2e`) - Caution states
- **Error**: Clear red (`#e53e3e`) - Error states

### Typography
- **Primary Font**: Inter (sans-serif)
- **Monospace Font**: JetBrains Mono (for code)
- **Font Weights**: 400, 500, 600, 700

### Spacing & Layout
- **Container**: Max-width 7xl (80rem)
- **Grid System**: 12-column responsive grid
- **Spacing Scale**: Tailwind's default scale with custom additions

## 🔧 Configuration

### Vite Configuration (`vite.config.mjs`)
- **Port**: 4028 (development server)
- **Build Output**: `build/` directory
- **Source Maps**: Enabled for debugging
- **Host**: 0.0.0.0 (network access)

### Tailwind Configuration (`tailwind.config.js`)
- **Custom Colors**: Extended color palette
- **Custom Animations**: Fade, slide, scale animations
- **Custom Shadows**: Elevation and depth utilities
- **Plugins**: Typography, forms, aspect-ratio

## 🚀 Deployment

### 1. Build the Application
```bash
npm run build
```

### 2. Deploy Options

#### Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy automatically on push

#### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`

#### Static Hosting
1. Upload `build/` contents to your web server
2. Configure server for SPA routing (redirect to index.html)

## 🔄 Common Update Steps

### Adding New Pages
1. Create page component in `src/pages/`
2. Add route in `src/Routes.jsx`
3. Update navigation in `src/components/ui/Header.jsx`

### Adding New Components
1. Create component in `src/components/`
2. Export with default export
3. Import and use in pages

### Updating Styles
1. Modify `src/styles/tailwind.css` for global styles
2. Update `tailwind.config.js` for theme changes
3. Use Tailwind classes in components

### Adding New Features
1. Create feature directory in appropriate location
2. Add necessary dependencies to `package.json`
3. Update routing and navigation
4. Test thoroughly across devices

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Verify all dependencies are installed

#### Styling Issues
- Ensure Tailwind CSS is properly imported
- Check for CSS conflicts in `src/styles/index.css`
- Verify custom classes are defined in `tailwind.config.js`

#### Routing Issues
- Ensure all routes are defined in `src/Routes.jsx`
- Check for proper route parameters
- Verify navigation links use correct paths

#### Performance Issues
- Use React DevTools to identify re-renders
- Implement React.memo for expensive components
- Optimize images and assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📬 Contact

Want to get in touch? Reach me at:

📧 **Email**: [moatazmuhammedmuhammed@gmail.com](mailto:moatazmuhammedmuhammed@gmail.com)

---

<div align="center">

**Built by [Moataz Mohammed](https://github.com/JinxX404)** | © 2025

</div>
#   M y - P e r s o n a l - P o r t f o l i o  
 