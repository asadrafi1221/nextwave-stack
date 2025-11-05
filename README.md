


## 🧩 In Progress !


##  Next.js Reusable Theme Template

This project is a **fully customizable Next.js starter** designed for developers who want to build **accessible, theme-driven applications** with minimal effort.
All core colors, fonts, and layout settings are defined using **CSS variables**, so changing one value updates the entire app instantly.

---

## 🚀 Features

* ⚙️ **Fully themable design system** using CSS variables
* 🌓 **Dark/Light mode** ready with dynamic color variables
* 🎨 **Global color architecture**:

  * `--primaryBg` / `--primaryColor` — for main sections, inputs, and content
  * `--secondaryBg` / `--secondaryColor` — for buttons, highlights, and emphasis elements
  * `--layoutBg` / `--layoutColor` — for body and general layout backgrounds
* 🔠 **Flexible font system** using:

  * `--title`, `--desc`, `--button` for full typographic control
* 💨 Built with **Tailwind CSS + TypeScript + Radix UI**
* 🧩 Ideal for scalable UI systems and reusable templates

---

## 🧱 Folder Structure

```
app/
  ├── globals.css        # Theme variables & base styles
  ├── layout.tsx         # Global layout wrapper
  └── page.tsx           # Example page

components/
  ├── ui/                # UI primitives (e.g. Switch, Button)
  └── ...
tailwind.config.ts       # Tailwind color + font variable bindings
```

---

## 🧩 How It Works

All colors and fonts are defined at the **`:root`** level in `globals.css`.
For example:

```css
:root {
  --primaryBg: 220 80% 50%;
  --primaryColor: 0 0% 100%;
}
```

You can customize your entire theme by editing these variables — no need to touch Tailwind config or components.
Switching to dark mode automatically updates all dependent values.

---

## ⚡ Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view your project.

---

## 🌐 Deployment

Deploy easily on [Vercel](https://vercel.com/new) — the creators of Next.js.
For more details, see the [Next.js deployment guide](https://nextjs.org/docs/app/building-your-application/deploying).

---

## 💡 Vision

This template is made for developers who believe in **scalable, future-ready design systems**.
Just update your root variables, and your entire project follows — **no redesign required**.

---
