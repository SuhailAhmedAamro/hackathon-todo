# UI Specification Template

Use this template when documenting UI components, pages, and design systems.

## Component/Page Name
[Name of the component or page]

## Overview
[What this UI element does and where it's used]

## Visual Design

### Mockup/Wireframe
```
[ASCII art, link to Figma, or description]

┌────────────────────────────────┐
│  Component Name                │
├────────────────────────────────┤
│  Content area                  │
│                                │
│  [Button]  [Button]            │
└────────────────────────────────┘
```

### Design Tokens
```css
--color-primary: #3b82f6;
--color-secondary: #6b7280;
--color-success: #10b981;
--color-error: #ef4444;
--color-warning: #f59e0b;

--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;

--font-size-sm: 14px;
--font-size-base: 16px;
--font-size-lg: 18px;
--font-size-xl: 24px;

--border-radius: 8px;
--shadow: 0 2px 4px rgba(0,0,0,0.1);
```

## Component Props/Interface

### TypeScript Interface
```typescript
interface ComponentProps {
  /** Component title */
  title: string;

  /** Optional description */
  description?: string;

  /** Event handler for primary action */
  onSubmit: (data: FormData) => void;

  /** Loading state */
  isLoading?: boolean;

  /** Error message to display */
  error?: string;
}
```

## States and Variants

### States
- **Default**: Initial state
- **Hover**: Mouse hover state
- **Active**: Clicked/pressed state
- **Disabled**: Non-interactive state
- **Loading**: Async operation in progress
- **Error**: Error state with message

### Variants
- **Primary**: Main call-to-action
- **Secondary**: Supporting action
- **Outline**: Minimal emphasis
- **Ghost**: No background

## Layout

### Responsive Breakpoints
```css
/* Mobile */
@media (max-width: 640px) { }

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }
```

### Grid/Flexbox Layout
```
Container (flex, gap-4, p-4)
  ├─ Header (flex, justify-between, items-center)
  ├─ Content (flex-1, overflow-auto)
  └─ Footer (flex, justify-end, gap-2)
```

## Behavior

### User Interactions
1. **Click on Button**: [What happens]
2. **Form Submit**: [Validation, submission flow]
3. **Keyboard Navigation**: [Tab order, shortcuts]
4. **Drag and Drop**: [If applicable]

### Animations
```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide in */
@keyframes slideIn {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

## Accessibility

### ARIA Attributes
```html
<button
  aria-label="Close dialog"
  aria-pressed="false"
  role="button"
  tabindex="0"
>
  Close
</button>
```

### Requirements
- [ ] Keyboard navigable (Tab, Enter, Escape)
- [ ] Screen reader compatible
- [ ] WCAG 2.1 AA compliant
- [ ] Color contrast ratio ≥ 4.5:1
- [ ] Focus indicators visible
- [ ] Alt text for images

## Data Flow

### Data Sources
- Props from parent component
- Local state (useState)
- Global state (Context, Redux, Zustand)
- API calls (fetch, axios)

### Example
```typescript
function Component({ userId }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks(userId).then(setTasks);
  }, [userId]);

  return (
    <div>
      {loading ? <Spinner /> : <TaskList tasks={tasks} />}
    </div>
  );
}
```

## Component Structure

### File Organization
```
ComponentName/
├── index.ts              # Barrel export
├── ComponentName.tsx     # Main component
├── ComponentName.test.tsx # Tests
├── ComponentName.stories.tsx # Storybook
├── styles.module.css     # Scoped styles
└── types.ts              # TypeScript types
```

### Example Implementation
```tsx
import React from 'react';
import styles from './styles.module.css';

export function ComponentName({ title, onSubmit }: ComponentProps) {
  return (
    <div className={styles.container}>
      <h2>{title}</h2>
      <button onClick={onSubmit}>Submit</button>
    </div>
  );
}
```

## Styling

### CSS Classes
```css
.container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-primary);
}
```

### Tailwind Classes (if using Tailwind)
```html
<div class="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md">
  <h2 class="text-xl font-semibold text-blue-600">Title</h2>
  <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Submit
  </button>
</div>
```

## Testing

### Test Cases
- [ ] Renders with required props
- [ ] Handles optional props correctly
- [ ] Calls event handlers on user interaction
- [ ] Displays loading state
- [ ] Displays error state
- [ ] Keyboard navigation works
- [ ] Accessible to screen readers

### Example Test
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

test('calls onSubmit when button clicked', () => {
  const mockSubmit = jest.fn();
  render(<ComponentName title="Test" onSubmit={mockSubmit} />);

  fireEvent.click(screen.getByText('Submit'));
  expect(mockSubmit).toHaveBeenCalled();
});
```

## Dependencies
- React/Next.js
- Tailwind CSS / CSS Modules
- Icons library (Lucide, Heroicons)
- Form library (React Hook Form)

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Considerations
- Lazy loading for heavy components
- Memoization (React.memo, useMemo)
- Virtual scrolling for long lists
- Image optimization

## Related Components
- [Link to related component specs]

## Phase Applicability
- [ ] Phase 2: Web (Primary)
- [ ] Phase 3: Chatbot (Chat interface)
