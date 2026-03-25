# Copilot Instructions

## Tech Stack

- **Next.js**: 16.2.1 (App Router ONLY)
- **React**: 19.2.4
- **Tailwind CSS**: 4.x
- **TypeScript**: 5.x

## Coding Conventions

- **Default to Server Components** - Use Server Components unless `"use client"` is explicitly required
- **Styling**: Tailwind CSS only - no inline styles, CSS modules, or other CSS frameworks
- **Component Structure**: Follow Next.js App Router conventions with `app/` directory
- **Type Safety**: Always use TypeScript with proper type annotations

## Known AI Mistakes

⚠️ **MUST AVOID:**

1. **Never use `next/router`** - Always import from `next/navigation` instead
   - ❌ `import { useRouter } from 'next/router'`
   - ✅ `import { useRouter } from 'next/navigation'`

2. **Pages Router is forbidden** - This project uses App Router only
   - ❌ Creating files in `pages/` directory
   - ✅ Use `app/` directory structure

3. **Always await `params`** - In Next.js 15+, route params are promises and must be awaited
   - ❌ `const { id } = props.params`
   - ✅ `const { id } = await props.params`
