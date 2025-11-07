# Card Component

A compound card component with Header, Content, and Footer subcomponents for structured content display.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `React.ReactNode` | Yes | - | Card content (typically subcomponents) |
| `className` | `string` | No | - | Additional CSS classes |
| All other shadcn Card props | - | No | - | Supports all standard card props |

## Subcomponents

### Card.Header
Container for card header content (titles, descriptions, etc.)

**Props:**
- `children`: `React.ReactNode` - Header content

### Card.Content
Container for main card content

**Props:**
- `children`: `React.ReactNode` - Main content

### Card.Footer
Container for card footer content (actions, metadata, etc.)

**Props:**
- `children`: `React.ReactNode` - Footer content

## Usage

### Basic Example

```tsx
import Card from "@/components/global/Card";

<Card>
  <Card.Header>
    <h3>Card Title</h3>
  </Card.Header>
  <Card.Content>
    <p>Card content goes here.</p>
  </Card.Content>
  <Card.Footer>
    <button>Action</button>
  </Card.Footer>
</Card>
```

### Header Only

```tsx
<Card>
  <Card.Header>
    <h2>Simple Card</h2>
    <p>Just a header</p>
  </Card.Header>
</Card>
```

### Content Only

```tsx
<Card>
  <Card.Content>
    <p>Simple content card</p>
  </Card.Content>
</Card>
```

### With Custom Styling

```tsx
<Card className="shadow-lg border-2 border-blue-500">
  <Card.Header>
    <h3 className="text-xl font-bold">Styled Card</h3>
  </Card.Header>
  <Card.Content>
    <p>Custom styled content</p>
  </Card.Content>
  <Card.Footer className="flex justify-end gap-2">
    <button>Cancel</button>
    <button>Save</button>
  </Card.Footer>
</Card>
```

### Complex Example

```tsx
<Card className="max-w-md">
  <Card.Header>
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-bold">User Profile</h3>
      <Badge>Active</Badge>
    </div>
    <p className="text-gray-500">Manage your account settings</p>
  </Card.Header>
  <Card.Content>
    <div className="space-y-4">
      <Input placeholder="Name" />
      <Input placeholder="Email" />
    </div>
  </Card.Content>
  <Card.Footer className="flex justify-between">
    <Button variant="outline">Cancel</Button>
    <Button>Save Changes</Button>
  </Card.Footer>
</Card>
```

## Features

- Compound component pattern for flexible composition
- Semantic structure (Header, Content, Footer)
- Fully customizable with Tailwind classes
- Built on shadcn/ui Card
- Accessible by default

## Dependencies

- `@/library/imports/components` (shadcn/ui Card components)
- `@/lib/utils` (cn utility)
