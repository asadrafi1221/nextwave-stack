# Input Component

A styled input component with custom padding and border radius.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `className` | `string` | No | - | Additional CSS classes |
| All standard HTML input props | - | No | - | Supports all native input attributes |

## Default Styling

- Padding: `p-3`
- Border radius: `rounded-lg`

## Usage

### Basic Example

```tsx
import { Input } from "@/components/global";

<Input placeholder="Enter text..." />
```

### With Type

```tsx
<Input type="email" placeholder="Email" />
<Input type="password" placeholder="Password" />
<Input type="number" placeholder="Age" />
<Input type="tel" placeholder="Phone" />
```

### With Custom Styling

```tsx
<Input 
  placeholder="Search..." 
  className="border-2 border-blue-500 focus:ring-blue-500"
/>
```

### Controlled Input

```tsx
const [value, setValue] = useState("");

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Controlled input"
/>
```

### With Label

```tsx
<div className="space-y-2">
  <label htmlFor="email" className="text-sm font-medium">
    Email Address
  </label>
  <Input
    id="email"
    type="email"
    placeholder="you@example.com"
  />
</div>
```

### Disabled State

```tsx
<Input placeholder="Disabled" disabled />
```

### With Icon

```tsx
<div className="relative">
  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
  <Input className="pl-10" placeholder="Search..." />
</div>
```

### Form Example

```tsx
<form className="space-y-4">
  <Input type="text" placeholder="Full Name" required />
  <Input type="email" placeholder="Email" required />
  <Input type="password" placeholder="Password" required />
  <Button type="submit">Submit</Button>
</form>
```

## Features

- Pre-configured padding and border radius
- Supports all native HTML input attributes
- Fully customizable with Tailwind classes
- Built on shadcn/ui Input
- Accessible by default

## Dependencies

- `@/library/imports/components` (shadcn/ui Input)
- `@/lib/utils` (cn utility)
