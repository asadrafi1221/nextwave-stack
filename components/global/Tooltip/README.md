# Tooltip Component

A tooltip component with custom animation options for displaying contextual information on hover.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `React.ReactNode` | Yes | - | Element that triggers the tooltip |
| `content` | `React.ReactNode` | Yes | - | Tooltip content to display |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | No | `"top"` | Position of the tooltip relative to trigger |
| `align` | `"start" \| "center" \| "end"` | No | `"center"` | Alignment of the tooltip |
| `animation` | `"default" \| "fast" \| "bounce" \| "retro"` | No | `"default"` | Animation style |
| All other shadcn Tooltip props | - | No | - | Supports all standard tooltip props |

## Animation Options

### default
Standard fade and zoom animation with smooth transitions.

### fast
Quick fade and zoom animation with 100ms duration for instant feedback.

### bounce
Bouncing entrance animation for playful interactions.

### retro
Retro-style pop animation for vintage aesthetics.

## Usage

### Basic Example

```tsx
import Tooltip from "@/components/global/Tooltip";

<Tooltip content={<p>This is a tooltip</p>}>
  <button>Hover me</button>
</Tooltip>
```

### With Different Positions

```tsx
<Tooltip content="Top tooltip" side="top">
  <button>Top</button>
</Tooltip>

<Tooltip content="Bottom tooltip" side="bottom">
  <button>Bottom</button>
</Tooltip>

<Tooltip content="Left tooltip" side="left">
  <button>Left</button>
</Tooltip>

<Tooltip content="Right tooltip" side="right">
  <button>Right</button>
</Tooltip>
```

### With Alignment

```tsx
<Tooltip content="Start aligned" side="bottom" align="start">
  <button>Start</button>
</Tooltip>

<Tooltip content="Center aligned" side="bottom" align="center">
  <button>Center</button>
</Tooltip>

<Tooltip content="End aligned" side="bottom" align="end">
  <button>End</button>
</Tooltip>
```

### With Different Animations

```tsx
<Tooltip content="Default animation" animation="default">
  <button>Default</button>
</Tooltip>

<Tooltip content="Fast animation" animation="fast">
  <button>Fast</button>
</Tooltip>

<Tooltip content="Bounce animation" animation="bounce">
  <button>Bounce</button>
</Tooltip>

<Tooltip content="Retro animation" animation="retro">
  <button>Retro</button>
</Tooltip>
```

### With Rich Content

```tsx
<Tooltip
  content={
    <div className="space-y-2">
      <h4 className="font-bold">Feature Name</h4>
      <p className="text-sm">Detailed description of the feature.</p>
    </div>
  }
  side="bottom"
>
  <InfoIcon className="cursor-help" />
</Tooltip>
```

### With Icons

```tsx
import { HelpCircle } from "lucide-react";

<Tooltip content="Click for help" side="right">
  <HelpCircle className="cursor-help" />
</Tooltip>
```

### Complete Example

```tsx
<Tooltip
  content={<p>UI Components Updated</p>}
  side="bottom"
  align="center"
  animation="retro"
>
  <p className="bg-red-900 text-white inline-block cursor-pointer">
    Hover for info
  </p>
</Tooltip>
```

## Features

- Multiple positioning options (top, bottom, left, right)
- Flexible alignment (start, center, end)
- 4 animation styles
- Supports rich content (text, HTML, React components)
- Auto-adjusts position to stay in viewport
- Delay duration: 100ms
- Built on shadcn/ui Tooltip
- Fully accessible (keyboard navigation, ARIA attributes)

## Important Notes

- This is a **client component** (uses `"use client"`)
- The trigger element must accept `asChild` prop (wrapped with `ShadcnTooltipTrigger`)
- Tooltip provider is included automatically

## Dependencies

- `@/library/imports/components` (shadcn/ui Tooltip components)
