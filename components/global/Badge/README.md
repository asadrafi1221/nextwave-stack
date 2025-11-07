# Badge Component

A badge component for displaying labels, tags, and status indicators.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `React.ReactNode` | Yes | - | Badge content (text, icons, etc.) |
| `variant` | `"default" \| "secondary" \| "destructive" \| "outline"` | No | `"default"` | Badge style variant |
| `className` | `string` | No | - | Additional CSS classes |

## Variants

- **default** - Primary badge style
- **secondary** - Secondary/muted badge style
- **destructive** - Error/warning badge style
- **outline** - Outlined badge style

## Default Styling

- Border radius: `rounded-xl`

## Usage

### Basic Example

```tsx
import Badge from "@/components/global/Badge";

<Badge>Default</Badge>
```

### With Variants

```tsx
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

### With Custom Styling

```tsx
<Badge variant="outline" className="text-lg px-4 py-2">
  Custom Badge
</Badge>
```

### With Icons

```tsx
import { CheckIcon } from "lucide-react";

<Badge variant="default" className="flex items-center gap-2">
  <CheckIcon size={16} />
  Verified
</Badge>
```

## Features

- Multiple style variants
- Customizable with Tailwind classes
- Supports any React node as children
- Built on shadcn/ui Badge
- Rounded corners by default

## Dependencies

- `@/library/imports/components` (shadcn/ui Badge)
- `@/lib/utils` (cn utility)
