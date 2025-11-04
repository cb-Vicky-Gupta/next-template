# ⚡ Next.js 16 Starter Template

A production-ready, scalable template built with **Next.js 16 (App Router)**, **Tailwind CSS**, **CSS Variables Design System**, **Role-Based Middleware**, and **Dynamic Theme Support**.

This template is designed to be a solid starting point for real-world SaaS dashboards, admin panels, enterprise apps, or scalable multi-role platforms.

---

## 🚀 Features

- ✅ Next.js 16 (App Router)
- ✅ Tailwind CSS v4 (`@import "tailwindcss"`)
- ✅ Global CSS Variable Design System (Light + Dark theme)
- ✅ Role-Based Route Protection Middleware
- ✅ Roles + Permissions fetched from backend (not hardcoded)
- ✅ TypeScript + Strict typing for roles
- ✅ UI Components: Button, Card with theme + variants
- ✅ Chart-friendly color variables
- ✅ Scalable folder structure for enterprise-level apps

---

## 🎨 Design System (CSS Variables)

Theme variables are declared in `globals.css`:

```css
@import "tailwindcss";

@layer base {
  :root {
    --background-color: #ffffff;
    --text-color: #2a0f11;
    --primary-color: #3b82f6;
    --primary-text: #ffffff;
    --border-color: #e2e8f0;
    --card-bg: #ffffff;
    --card-text: #0f172a;
    --chart-color-1: #3b82f6;
  }

  [data-theme="dark"] {
    --background-color: #0f172a;
    --text-color: #f8fafc;
    --primary-color: #3b82f6;
    --primary-text: #0f172a;
    --card-bg: #0f172a;
    --card-text: #f8fafc;
    --chart-color-1: #60a5fa;
  }
}
```

git clone https://github.com/your-username/next-template.git
cd next-template
npm install
npm run dev

NEXT_PUBLIC_API_URL=https://api.example.com
JWT_SECRET=your_secret

<Button text="Save" variant="primary" />
<Button text="Delete" variant="danger" icon={<Trash />} />
<Card>Reusable card with theme support</Card>
