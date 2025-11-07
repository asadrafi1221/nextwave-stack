# Button Component

A customizable button component with pre-configured sizing and full shadcn/ui Button functionality.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `React.ReactNode` | Yes | - | Button content |
| `className` | `string` | No | - | Additional CSS classes |
| `variant` | `"default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link"` | No | `"default"` | Button style variant |
| `size` | `"default" \| "sm" \| "lg" \| "icon"` | No | `"default"` | Button size |
| All other shadcn Button props | - | No | - | Supports all standard button props |

## Default Styling

- Min width: `150px` (mobile), `170px` (lg screens)
- Padding: `py-3` (mobile), `py-5` (lg screens)

## Usage

### Basic Example

```tsx
import { Button } from "@/components/global";

<Button variant="default">Click Me</Button>
```

### With Variants

```tsx
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### With Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">
  <IconComponent />
</Button>
```

### With Custom Styling

```tsx
<Button className="bg-blue-500 hover:bg-blue-600">
  Custom Color
</Button>
```

### With Click Handler

```tsx
<Button onClick={() => console.log("Clicked!")}>
  Click Me
</Button>
```

### Disabled State

```tsx
<Button disabled>Disabled</Button>
```

### As Link

```tsx
<Button asChild>
  <a href="/about">About</a>
</Button>
```

## Features

- Pre-configured responsive sizing
- Multiple style variants
- Fully customizable with Tailwind classes
- Supports all standard button attributes
- Built on shadcn/ui Button
- Accessible by default

## Dependencies

- `@/library/imports/components` (shadcn/ui Button)
- `@/lib/utils` (cn utility)
