# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Tikila Admin Panel

Admin panel for managing the Tikila platform.

## Features

- Dashboard with statistics
- User management
- Product management
- Order management
- Modern React architecture with TypeScript

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Zustand (State Management)
- Axios (HTTP Client)
- Ant Design

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── layout/         # Layout components (Sidebar, Header, etc.)
│   └── ui/             # UI components (Button, Input, Modal, etc.)
├── contants/           # Application constants
├── hooks/              # Custom React hooks
├── interfaces/         # TypeScript interfaces
├── layouts/            # Page layouts
├── pages/              # Application pages
│   ├── dashboard/      # Dashboard page
│   ├── users/          # User management
│   ├── products/       # Product management
│   └── orders/         # Order management
├── router/             # Routing configuration
├── services/           # API services
├── store/              # State management
└── utils/              # Utility functions
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start development server:

   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config([
	globalIgnores(['dist']),
	{
		files: ['**/*.{ts,tsx}'],
		extends: [
			// Other configs...
			// Enable lint rules for React
			reactX.configs['recommended-typescript'],
			// Enable lint rules for React DOM
			reactDom.configs.recommended,
		],
		languageOptions: {
			parserOptions: {
				project: ['./tsconfig.node.json', './tsconfig.app.json'],
				tsconfigRootDir: import.meta.dirname,
			},
			// other options...
		},
	},
]);
```
