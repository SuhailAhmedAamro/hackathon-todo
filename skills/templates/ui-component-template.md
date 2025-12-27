# UI Component: [ComponentName]

## Overview
[1-2 sentence description of what this component does and where it's used]

## Visual Design

### Mockup/Wireframe
```
[ASCII wireframe or link to design file]

┌────────────────────────────────────────┐
│  [ComponentName]                   [X] │
├────────────────────────────────────────┤
│  ┌──────────────────────────────────┐  │
│  │  Content Area                    │  │
│  │                                  │  │
│  │  [Item 1               ]  [✓]   │  │
│  │  [Item 2               ]  [✓]   │  │
│  └──────────────────────────────────┘  │
├────────────────────────────────────────┤
│          [Cancel]  [Save Changes]      │
└────────────────────────────────────────┘
```

### Design Tokens
```css
/* Colors */
--component-bg: #ffffff;
--component-border: #e5e7eb;
--component-text: #1f2937;
--component-primary: #3b82f6;
--component-hover: #2563eb;

/* Spacing */
--component-padding: 16px;
--component-gap: 8px;
--component-margin: 12px;

/* Typography */
--component-font-size: 16px;
--component-font-weight: 400;
--component-line-height: 1.5;

/* Borders */
--component-border-radius: 8px;
--component-border-width: 1px;

/* Shadows */
--component-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
```

## Component Props

### TypeScript Interface
```typescript
interface ComponentNameProps {
  /**
   * Component title displayed in header
   */
  title: string;

  /**
   * Optional description text
   */
  description?: string;

  /**
   * Array of items to display
   */
  items: Item[];

  /**
   * Callback when item is selected
   */
  onItemSelect: (itemId: string) => void;

  /**
   * Callback when form is submitted
   */
  onSubmit: (data: FormData) => void | Promise<void>;

  /**
   * Callback when component is closed
   */
  onClose?: () => void;

  /**
   * Loading state
   */
  isLoading?: boolean;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * CSS class name for custom styling
   */
  className?: string;

  /**
   * Component size variant
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Component color variant
   */
  variant?: 'default' | 'primary' | 'success' | 'danger';
}

interface Item {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
}

interface FormData {
  field1: string;
  field2: number;
  // ...
}
```

### Default Props
```typescript
const defaultProps: Partial<ComponentNameProps> = {
  size: 'medium',
  variant: 'default',
  isLoading: false,
  error: undefined,
};
```

## States and Variants

### Component States
1. **Default**: Normal state
2. **Hover**: Mouse hover
3. **Active**: Mouse down/pressed
4. **Focus**: Keyboard focus (visible focus ring)
5. **Disabled**: Non-interactive state
6. **Loading**: Async operation in progress
7. **Error**: Error state with message
8. **Empty**: No data to display

### Variants

#### Size Variants
- **Small**: `height: 32px`, `padding: 8px`, `font-size: 14px`
- **Medium**: `height: 40px`, `padding: 12px`, `font-size: 16px`
- **Large**: `height: 48px`, `padding: 16px`, `font-size: 18px`

#### Color Variants
- **Default**: Gray colors
- **Primary**: Blue colors
- **Success**: Green colors
- **Danger**: Red colors

## Layout

### Structure
```tsx
<div className="component-container">
  <header className="component-header">
    <h2>{title}</h2>
    <button onClick={onClose}>×</button>
  </header>

  <main className="component-content">
    {isLoading ? (
      <Spinner />
    ) : error ? (
      <ErrorMessage message={error} />
    ) : (
      <ContentArea items={items} />
    )}
  </main>

  <footer className="component-footer">
    <Button variant="secondary" onClick={onClose}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleSubmit}>
      Save Changes
    </Button>
  </footer>
</div>
```

### Responsive Layout

**Mobile** (`< 640px`):
- Stack vertically
- Full width
- Reduced padding
- Larger touch targets

**Tablet** (`640px - 1024px`):
- Partial width (80%)
- Normal padding
- Side-by-side buttons

**Desktop** (`> 1024px`):
- Fixed width (600px)
- Centered
- Full features

## Behavior

### User Interactions

1. **Click on Item**: Selects item, calls `onItemSelect(itemId)`
2. **Submit Form**: Validates input, calls `onSubmit(data)`
3. **Press Escape**: Closes component, calls `onClose()`
4. **Click Outside**: Closes component (if modal)
5. **Tab Key**: Moves focus to next interactive element

### Keyboard Navigation
- `Tab`: Move to next element
- `Shift+Tab`: Move to previous element
- `Enter`: Activate focused button
- `Escape`: Close component
- `Arrow Keys`: Navigate list items (if applicable)

### Mouse Interactions
- `Hover`: Show hover state
- `Click`: Activate element
- `Drag`: Reorder items (if applicable)

## Styling

### CSS Module (Recommended)
```css
/* ComponentName.module.css */
.container {
  display: flex;
  flex-direction: column;
  background: var(--component-bg);
  border: 1px solid var(--component-border);
  border-radius: var(--component-border-radius);
  box-shadow: var(--component-shadow);
  padding: var(--component-padding);
  gap: var(--component-gap);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--component-padding);
  border-bottom: 1px solid var(--component-border);
}

.content {
  flex: 1;
  overflow-y: auto;
}

.footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--component-gap);
  padding-top: var(--component-padding);
  border-top: 1px solid var(--component-border);
}

/* States */
.container.loading {
  opacity: 0.6;
  pointer-events: none;
}

.container.error {
  border-color: var(--color-error);
}

/* Variants */
.container.small {
  padding: 8px;
  font-size: 14px;
}

.container.large {
  padding: 24px;
  font-size: 18px;
}
```

### Tailwind CSS (Alternative)
```tsx
<div className={cn(
  "flex flex-col bg-white border border-gray-200 rounded-lg shadow-md p-4 gap-2",
  size === 'small' && "p-2 text-sm",
  size === 'large' && "p-6 text-lg",
  isLoading && "opacity-60 pointer-events-none",
  error && "border-red-500",
  className
)}>
  {/* Component content */}
</div>
```

## Animations

### Transitions
```css
.container {
  transition: all 0.2s ease-in-out;
}

.item {
  transition: transform 0.15s ease, background-color 0.15s ease;
}

.item:hover {
  transform: translateY(-2px);
}
```

### Keyframe Animations
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container {
  animation: fadeIn 0.3s ease-out;
}
```

## Accessibility

### ARIA Attributes
```tsx
<div
  role="dialog"
  aria-labelledby="component-title"
  aria-describedby="component-description"
  aria-modal="true"
>
  <h2 id="component-title">{title}</h2>
  <p id="component-description">{description}</p>

  <button
    aria-label="Close dialog"
    onClick={onClose}
  >
    ×
  </button>

  <ul role="listbox" aria-label="Item list">
    {items.map(item => (
      <li
        key={item.id}
        role="option"
        aria-selected={selectedId === item.id}
        aria-disabled={item.disabled}
      >
        {item.label}
      </li>
    ))}
  </ul>
</div>
```

### Requirements
- [ ] Keyboard navigable (Tab, Enter, Escape, Arrows)
- [ ] Screen reader compatible (ARIA labels)
- [ ] WCAG 2.1 AA compliant
- [ ] Color contrast ≥ 4.5:1
- [ ] Focus indicators visible
- [ ] Alt text for images/icons
- [ ] Semantic HTML elements

### Focus Management
```tsx
useEffect(() => {
  // Trap focus within component when modal
  const focusableElements = containerRef.current?.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  // Focus first element
  focusableElements[0]?.focus();

  // Handle Tab key for focus trap
  // ...
}, []);
```

## Data Flow

### Props Down, Events Up
```tsx
// Parent Component
function ParentComponent() {
  const [data, setData] = useState<Item[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (formData: FormData) => {
    // Process data
    setIsOpen(false);
  };

  return (
    <ComponentName
      items={data}
      isOpen={isOpen}
      onSubmit={handleSubmit}
      onClose={() => setIsOpen(false)}
    />
  );
}
```

### State Management
```tsx
// Local state
const [selectedId, setSelectedId] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// Derived state
const selectedItem = items.find(item => item.id === selectedId);
const hasItems = items.length > 0;
```

## Implementation Example

```tsx
import React, { useState } from 'react';
import styles from './ComponentName.module.css';

export function ComponentName({
  title,
  description,
  items,
  onItemSelect,
  onSubmit,
  onClose,
  isLoading = false,
  error,
  className,
  size = 'medium',
  variant = 'default',
}: ComponentNameProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleItemClick = (itemId: string) => {
    setSelectedId(itemId);
    onItemSelect(itemId);
  };

  const handleSubmit = () => {
    if (selectedId) {
      const formData = { /* ... */ };
      onSubmit(formData);
    }
  };

  return (
    <div
      className={cn(
        styles.container,
        styles[size],
        styles[variant],
        isLoading && styles.loading,
        error && styles.error,
        className
      )}
      role="dialog"
      aria-labelledby="component-title"
    >
      <header className={styles.header}>
        <h2 id="component-title">{title}</h2>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close"
            className={styles.closeButton}
          >
            ×
          </button>
        )}
      </header>

      <main className={styles.content}>
        {isLoading ? (
          <Spinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : items.length === 0 ? (
          <EmptyState message="No items to display" />
        ) : (
          <ul className={styles.itemList}>
            {items.map(item => (
              <li
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={cn(
                  styles.item,
                  selectedId === item.id && styles.selected,
                  item.disabled && styles.disabled
                )}
              >
                {item.label}
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer className={styles.footer}>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!selectedId || isLoading}
        >
          Submit
        </Button>
      </footer>
    </div>
  );
}
```

## Testing

### Unit Tests
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  const mockItems = [
    { id: '1', label: 'Item 1', value: 'value1' },
    { id: '2', label: 'Item 2', value: 'value2' },
  ];

  it('renders with title', () => {
    render(
      <ComponentName
        title="Test Component"
        items={mockItems}
        onItemSelect={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  it('calls onItemSelect when item clicked', () => {
    const mockOnItemSelect = jest.fn();

    render(
      <ComponentName
        title="Test"
        items={mockItems}
        onItemSelect={mockOnItemSelect}
        onSubmit={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText('Item 1'));
    expect(mockOnItemSelect).toHaveBeenCalledWith('1');
  });

  it('shows loading state', () => {
    render(
      <ComponentName
        title="Test"
        items={mockItems}
        onItemSelect={jest.fn()}
        onSubmit={jest.fn()}
        isLoading={true}
      />
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(
      <ComponentName
        title="Test"
        items={mockItems}
        onItemSelect={jest.fn()}
        onSubmit={jest.fn()}
        error="Something went wrong"
      />
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
```

### Storybook Stories
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {
  args: {
    title: 'Component Title',
    items: [
      { id: '1', label: 'Item 1', value: 'value1' },
      { id: '2', label: 'Item 2', value: 'value2' },
    ],
    onItemSelect: (id) => console.log('Selected:', id),
    onSubmit: (data) => console.log('Submitted:', data),
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    error: 'Failed to load items',
  },
};

export const Small: Story = {
  args: {
    ...Default.args,
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    ...Default.args,
    size: 'large',
  },
};
```

## Dependencies
- React 18+
- TypeScript 5+
- CSS Modules or Tailwind CSS
- clsx/cn utility (for conditional classes)

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance
- [ ] Memoized expensive calculations (useMemo)
- [ ] Memoized callbacks (useCallback)
- [ ] Component memoization (React.memo)
- [ ] Virtualized long lists (react-window)
- [ ] Lazy loaded if not critical

## Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-01-26 | Initial component design |
| | | |

## References

- Feature Spec: `@specs/features/[feature].md`
- Design System: `@specs/ui/components.md`
- Storybook: `/storybook`

---

**Template Version**: 1.0
**Last Updated**: 2025-01-26
**Usage**: `@skills/templates/ui-component-template.md`
