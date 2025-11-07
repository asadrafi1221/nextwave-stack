# Switch Component

A toggle switch component for binary on/off states.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `className` | `string` | No | - | Additional CSS classes |
| All shadcn Switch props | - | No | - | Supports all standard switch props |

## Usage

### Basic Example

```tsx
import { Switch } from "@/components/global";

<Switch />
```

### Controlled Switch

```tsx
const [enabled, setEnabled] = useState(false);

<Switch checked={enabled} onCheckedChange={setEnabled} />
```

### With Label

```tsx
<div className="flex items-center gap-2">
  <Switch id="notifications" />
  <label htmlFor="notifications" className="cursor-pointer">
    Enable notifications
  </label>
</div>
```

### With Custom Styling

```tsx
<Switch className="data-[state=checked]:bg-green-500" />
```

### Disabled State

```tsx
<Switch disabled />
<Switch disabled checked />
```

### Form Example

```tsx
const [settings, setSettings] = useState({
  notifications: false,
  darkMode: true,
  autoSave: false,
});

<div className="space-y-4">
  <div className="flex items-center justify-between">
    <label>Notifications</label>
    <Switch
      checked={settings.notifications}
      onCheckedChange={(checked) =>
        setSettings({ ...settings, notifications: checked })
      }
    />
  </div>
  <div className="flex items-center justify-between">
    <label>Dark Mode</label>
    <Switch
      checked={settings.darkMode}
      onCheckedChange={(checked) =>
        setSettings({ ...settings, darkMode: checked })
      }
    />
  </div>
  <div className="flex items-center justify-between">
    <label>Auto Save</label>
    <Switch
      checked={settings.autoSave}
      onCheckedChange={(checked) =>
        setSettings({ ...settings, autoSave: checked })
      }
    />
  </div>
</div>
```

### With Description

```tsx
<div className="flex items-start gap-3">
  <Switch id="marketing" className="mt-1" />
  <div className="flex-1">
    <label htmlFor="marketing" className="font-medium cursor-pointer">
      Marketing emails
    </label>
    <p className="text-sm text-gray-500">
      Receive emails about new products and features
    </p>
  </div>
</div>
```

## Features

- Simple on/off toggle
- Fully customizable with Tailwind classes
- Supports controlled and uncontrolled modes
- Built on shadcn/ui Switch
- Accessible by default (keyboard navigation, ARIA attributes)

## Dependencies

- `@/library/imports/components` (shadcn/ui Switch)
- `@/lib/utils` (cn utility)
