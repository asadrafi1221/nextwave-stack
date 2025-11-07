# Accordion Component

A collapsible accordion component supporting single or multiple open items simultaneously.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `type` | `"single" \| "multiple"` | Yes | - | Controls whether one or multiple items can be open at the same time |
| `collapsable` | `boolean` | No | - | Whether items can be collapsed |
| `className` | `string` | No | - | Additional CSS classes for the accordion container |
| `options` | `Array<AccordionOption>` | Yes | - | Array of accordion items |

### AccordionOption

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | `string` | Yes | The accordion item title/trigger text |
| `content` | `React.ReactNode` | Yes | The accordion item content |
| `className` | `string` | No | Additional CSS classes for the item |

## Default Styling

- Background: `hsl(var(--primaryBg))`
- Border radius: `rounded-xl`
- Padding: `px-3`
- Text color: `hsl(var(--primaryColor))`
- Overflow: `hidden`

## Usage

### Basic Example

```tsx
import Accordion from "@/components/global/Accordion";

<Accordion
  type="single"
  options={[
    {
      title: "What is Next.js?",
      content: <p>Next.js is a React framework for production.</p>,
    },
    {
      title: "What is Tailwind CSS?",
      content: <p>Tailwind CSS is a utility-first CSS framework.</p>,
    },
  ]}
/>
```

### Multiple Open Items

```tsx
<Accordion
  type="multiple"
  options={[
    {
      title: "Section 1",
      content: <p>Content 1</p>,
    },
    {
      title: "Section 2",
      content: <p>Content 2</p>,
    },
  ]}
/>
```

### With Custom Styling

```tsx
<Accordion
  type="multiple"
  className="mt-20 shadow-lg"
  options={[
    {
      title: "Accordion 1",
      content: <p>Content 1</p>,
      className: "border-b",
    },
    {
      title: "Accordion 2",
      content: (
        <div className="flex flex-col gap-5">
          <p>Multiple elements</p>
          <p>In content</p>
        </div>
      ),
    },
  ]}
/>
```

## Features

- Single or multiple item expansion
- Custom styling per item
- Supports any React node as content
- Built on shadcn/ui Accordion
- Fully accessible

## Dependencies

- `@/library/imports/components` (shadcn/ui Accordion components)
- `@/lib/utils` (cn utility)
