# MDX Components

All components in `src/pages/components/` are fully theme-aware and respect the configuration settings in `app.config.ts`.

## Theme Integration

All components automatically adapt to:

- **Border Radius**: Controlled by `theme.border.radius` (`none`, `sm`, `md`, `lg`)
- **Border Size**: Controlled by `theme.border.size` (`none`, `1`, `2`, `3`)
- **Color Scheme**: Uses theme colors (accent, light, dark)
- **Dark Mode**: Automatic dark mode support

## Available Components

### 1. Callout
Highlight important information with visual emphasis.

**Props:**
- `type`: `info` | `warning` | `success` | `error`
- `title`: Optional title
- `children`: Content

**Theme Classes:**
- `theme-border-radius`: Applies configured border radius

### 2. Badge
Label and categorize content with colored tags.

**Props:**
- `variant`: `default` | `success` | `warning` | `error` | `info`
- `size`: `sm` | `md` | `lg`
- `children`: Badge text

**Theme Classes:**
- `theme-border-radius`: Applies configured border radius

### 3. Card
Group related content in styled containers.

**Props:**
- `title`: Optional card title
- `variant`: `default` | `bordered` | `elevated`
- `children`: Card content

**Theme Classes:**
- `theme-border-radius`: Applies configured border radius
- `theme-border`: Uses theme border color
- `theme-border-size`: Applies configured border width
- `theme-bg`: Uses theme background color
- `theme-bg-secondary`: Uses secondary background color

### 4. Steps
Guide users through sequential processes.

**Props:**
- `steps`: Array of `{ title: string, description: ReactNode }`

**Theme Classes:**
- `theme-accent-bg`: Step numbers use accent background
- `theme-border`: Connecting line uses theme border color
- `theme-text`: Title uses theme text color
- `theme-text-secondary`: Description uses secondary text color

### 5. Tabs
Organize multiple related examples or options.

**Props:**
- `tabs`: Array of `{ label: string, content: ReactNode }`
- `defaultTab`: Initial active tab index (default: 0)

**Theme Classes:**
- `theme-border`: Tab border uses theme color
- `theme-accent`: Active tab uses accent color
- `theme-accent-border`: Active tab border uses accent color
- `theme-text`: Inactive tabs use theme text color
- `theme-text-secondary`: Inactive tabs use secondary text color

### 6. CodeBlock
Display code with syntax highlighting and copy functionality.

**Props:**
- `code`: Code string to display
- `language`: Programming language (default: `text`)
- `title`: Optional title
- `showLineNumbers`: Show line numbers (default: `false`)

**Theme Classes:**
- `theme-border-radius`: Applies configured border radius
- `theme-border`: Uses theme border color
- `theme-border-size`: Applies configured border width
- `theme-bg-secondary`: Header uses secondary background
- `theme-text-secondary`: Header text uses secondary color

### 7. IFrame
Embed external content seamlessly.

**Props:**
- `src`: URL to embed (required)
- `aspect`: `16/9` | `4/3` | `1/1` | `21/9` (default: `16/9`)
- `loading`: `lazy` | `eager` (default: `lazy`)
- `title`: Accessible title
- `allow`: Permissions policy

**Theme Classes:**
- `theme-border-radius`: Applies configured border radius

## Usage Example

```mdx
import { Callout, Badge, Card, Steps, Tabs, CodeBlock, IFrame } from '../components';

# My Documentation

<Callout type="info" title="Note">
This will automatically use your theme's border radius and colors!
</Callout>

<Badge variant="success">v1.0.0</Badge>

<Card title="Getting Started" variant="bordered">
All styling respects your theme configuration.
</Card>
```

## Theme CSS Variables

The following CSS variables are automatically set based on your config:

- `--theme-border-radius`: Border radius value
- `--theme-border-size`: Border width value
- `--current-accent`: Accent color
- `--current-bg`: Background color
- `--current-bg-secondary`: Secondary background
- `--current-text`: Text color
- `--current-text-secondary`: Secondary text color
- `--current-border`: Border color

## Theme CSS Classes

Use these classes in your custom components:

- `theme-border-radius`: Applies configured border radius
- `theme-border-size`: Applies configured border width
- `theme-bg`: Background color
- `theme-bg-secondary`: Secondary background
- `theme-text`: Text color
- `theme-text-secondary`: Secondary text color
- `theme-border`: Border color
- `theme-accent`: Accent color
- `theme-accent-bg`: Accent background
- `theme-accent-border`: Accent border color

## Navigation and Search UX

The built-in sidebar and search dialog also use the same theme classes and now support keyboard navigation:

- Sidebar navigation is exposed as a `navigation` landmark with an accessible label for screen readers.
- The search dialog allows moving between results with arrow keys and activating a result with Enter.
