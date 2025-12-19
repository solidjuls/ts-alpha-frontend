# Layout System Documentation

This document explains how to use the new layout system for your Twilight Struggle application.

## Available Layouts

### 1. MainLayout
The main layout with a hero section, perfect for landing pages and main content areas.

**Features:**
- Hero section with background image
- Sticky navigation header
- Centered content with max-width
- Integrated footer
- Responsive design

**Usage:**
```tsx
import { MainLayout } from "components/Layout";

export default function HomePage() {
  return (
    <MainLayout
      heroTitle="Twilight Struggle Tournaments"
      heroSubtitle="Competitive online tournaments for all skill levels"
      showHero={true} // optional, defaults to true
    >
      <YourContent />
    </MainLayout>
  );
}
```

### 2. SimpleLayout
A clean layout without the hero section, perfect for content pages.

**Features:**
- Optional page title and subtitle
- Sticky navigation header
- Centered content with max-width
- Integrated footer
- Responsive design

**Usage:**
```tsx
import { SimpleLayout } from "components/Layout";

export default function AboutPage() {
  return (
    <SimpleLayout
      title="About Us"
      subtitle="Learn more about our community"
    >
      <YourContent />
    </SimpleLayout>
  );
}
```

### 3. Layout (Legacy)
The original layout component, still available for backward compatibility.

## Migration Guide

### From _app.tsx Layout Wrapper

**Before:**
```tsx
// In _app.tsx
<Layout>
  <Component {...pageProps} />
</Layout>
<Footer>
  <p>&copy; {new Date().getFullYear()} Twilight-Struggle.com</p>
</Footer>
```

**After:**
```tsx
// In _app.tsx - no layout wrapper needed
<Component {...pageProps} />

// In individual pages
<MainLayout>
  <YourPageContent />
</MainLayout>
```

### Page-Level Implementation

**Before:**
```tsx
export default function MyPage() {
  return (
    <div>
      <h1>Page Title</h1>
      <p>Content</p>
    </div>
  );
}
```

**After:**
```tsx
import { SimpleLayout } from "components/Layout";

export default function MyPage() {
  return (
    <SimpleLayout title="Page Title">
      <p>Content</p>
    </SimpleLayout>
  );
}
```

## Layout Props

### MainLayout Props
- `children: React.ReactNode` - Page content
- `showHero?: boolean` - Show/hide hero section (default: true)
- `heroTitle?: string` - Hero section title
- `heroSubtitle?: string` - Hero section subtitle
- `className?: string` - Additional CSS classes

### SimpleLayout Props
- `children: React.ReactNode` - Page content
- `title?: string` - Page title
- `subtitle?: string` - Page subtitle
- `className?: string` - Additional CSS classes

## Styling

All layouts use your existing theme system and are fully responsive:

- **Mobile-first design** with breakpoints at 480px, 768px, and 1024px
- **Consistent spacing** using theme.space values
- **Typography** using theme.fontSizes
- **Colors** using theme.colors
- **Sticky navigation** for better UX
- **Centered content** with max-width of 1200px

## Best Practices

1. **Use MainLayout for landing pages** - Homepage, main sections
2. **Use SimpleLayout for content pages** - About, FAQ, documentation
3. **Keep hero content concise** - Short, impactful titles and subtitles
4. **Leverage theme system** - Use theme values for consistent styling
5. **Test responsive behavior** - Ensure content works on all screen sizes

## Examples

Check these files for implementation examples:
- `pages/index.tsx` - MainLayout with hero
- `pages/about/index.tsx` - SimpleLayout with title/subtitle
