---
name: react-patterns
description: React component patterns for building scalable and maintainable UI. Use when designing component architecture, sharing logic between components, managing complex state, or refactoring React applications.
---

# React Component Patterns

Essential patterns for building clean, reusable, and maintainable React components.

## When to Use This Skill

- Designing reusable component APIs
- Sharing stateful logic between components
- Managing complex component state
- Building component libraries
- Refactoring legacy React code

## Component Patterns

### 1. Container/Presentational Pattern

Separate data fetching logic from presentation.

```jsx
// Presentational Component (dumb)
// Only concerned with how things look
const UserList = ({ users, isLoading, onUserClick }) => {
  if (isLoading) return <Spinner />;
  
  return (
    <ul className="user-list">
      {users.map(user => (
        <li key={user.id} onClick={() => onUserClick(user)}>
          <Avatar src={user.avatar} />
          <span>{user.name}</span>
        </li>
      ))}
    </ul>
  );
};

// Container Component (smart)
// Handles data and state
const UserListContainer = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .finally(() => setIsLoading(false));
  }, []);
  
  const handleUserClick = (user) => {
    analytics.track('user_clicked', { userId: user.id });
    navigate(`/users/${user.id}`);
  };
  
  return (
    <UserList 
      users={users} 
      isLoading={isLoading}
      onUserClick={handleUserClick}
    />
  );
};
```

**Modern Alternative with Hooks:**

```jsx
// Custom hook extracts the container logic
const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .finally(() => setIsLoading(false));
  }, []);
  
  return { users, isLoading };
};

// Component uses the hook directly
const UserList = () => {
  const { users, isLoading } = useUsers();
  
  if (isLoading) return <Spinner />;
  
  return (
    <ul>
      {users.map(user => <UserItem key={user.id} user={user} />)}
    </ul>
  );
};
```

**When to Use:**
- Clear separation of concerns needed
- Presentational components reused with different data sources
- Testing UI components in isolation

---

### 2. Higher-Order Components (HOC)

Reuse component logic by wrapping components.

```jsx
// withAuth HOC - adds authentication check
const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const { user, isLoading } = useAuth();
    
    if (isLoading) return <Spinner />;
    if (!user) return <Navigate to="/login" />;
    
    return <WrappedComponent {...props} user={user} />;
  };
};

// withLogging HOC - adds lifecycle logging
const withLogging = (WrappedComponent) => {
  return function LoggedComponent(props) {
    useEffect(() => {
      console.log(`${WrappedComponent.name} mounted`);
      return () => console.log(`${WrappedComponent.name} unmounted`);
    }, []);
    
    return <WrappedComponent {...props} />;
  };
};

// Usage
const Dashboard = ({ user }) => {
  return <h1>Welcome, {user.name}!</h1>;
};

export default withAuth(withLogging(Dashboard));
```

```jsx
// withData HOC - generic data fetching
const withData = (WrappedComponent, fetchFn, propName) => {
  return function DataComponent(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
      fetchFn(props)
        .then(setData)
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);
    
    if (loading) return <Spinner />;
    if (error) return <Error message={error.message} />;
    
    return <WrappedComponent {...props} {...{ [propName]: data }} />;
  };
};

// Usage
const UserProfile = ({ user }) => <div>{user.name}</div>;

export default withData(
  UserProfile,
  (props) => api.getUser(props.userId),
  'user'
);
```

**When to Use:**
- Cross-cutting concerns (auth, logging, theming)
- Injecting props into many components
- Legacy codebases (prefer hooks in new code)

**Caveats:**
- Can create "wrapper hell"
- Static methods don't carry over (use hoist-non-react-statics)
- Refs don't pass through (use React.forwardRef)

---

### 3. Render Props Pattern

Share code between components using a prop whose value is a function.

```jsx
// Mouse tracker with render prop
const MouseTracker = ({ render }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return render(position);
};

// Usage
const App = () => (
  <MouseTracker
    render={({ x, y }) => (
      <div>
        Mouse position: {x}, {y}
      </div>
    )}
  />
);
```

```jsx
// Toggle component with children as function
const Toggle = ({ children, initialOn = false }) => {
  const [on, setOn] = useState(initialOn);
  const toggle = () => setOn(prev => !prev);
  
  return children({ on, toggle });
};

// Usage
const App = () => (
  <Toggle initialOn={false}>
    {({ on, toggle }) => (
      <div>
        <button onClick={toggle}>
          {on ? 'Hide' : 'Show'}
        </button>
        {on && <SecretContent />}
      </div>
    )}
  </Toggle>
);
```

```jsx
// Fetch component with render props
const Fetch = ({ url, children }) => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null
  });
  
  useEffect(() => {
    setState(s => ({ ...s, loading: true }));
    
    fetch(url)
      .then(res => res.json())
      .then(data => setState({ data, loading: false, error: null }))
      .catch(error => setState({ data: null, loading: false, error }));
  }, [url]);
  
  return children(state);
};

// Usage
const UserPage = ({ userId }) => (
  <Fetch url={`/api/users/${userId}`}>
    {({ data, loading, error }) => {
      if (loading) return <Spinner />;
      if (error) return <Error error={error} />;
      return <UserProfile user={data} />;
    }}
  </Fetch>
);
```

**When to Use:**
- Sharing stateful logic
- More flexible than HOCs (consumer controls rendering)
- When hooks aren't suitable (class components)

**Modern Alternative:** Custom hooks are usually cleaner for the same use cases.

---

### 4. Custom Hooks Pattern

Extract and share stateful logic between components.

```jsx
// useLocalStorage hook
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function 
        ? value(storedValue) 
        : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue];
};

// Usage
const Settings = () => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  return (
    <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
      Current: {theme}
    </button>
  );
};
```

```jsx
// useFetch hook
const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, {
          ...options,
          signal: abortController.signal
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    return () => abortController.abort();
  }, [url]);
  
  return { data, loading, error };
};

// Usage
const UserProfile = ({ userId }) => {
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  
  return <div>{user.name}</div>;
};
```

```jsx
// useDebounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
};

// useThrottle hook
const useThrottle = (value, limit) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());
  
  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));
    
    return () => clearTimeout(handler);
  }, [value, limit]);
  
  return throttledValue;
};

// Usage - Search with debounce
const Search = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { data: results } = useFetch(
    debouncedQuery ? `/api/search?q=${debouncedQuery}` : null
  );
  
  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <Results items={results} />
    </>
  );
};
```

**When to Use:**
- Any reusable stateful logic
- Replacing HOCs and render props
- Composing multiple hooks together

---

### 5. Compound Components Pattern

Create components that work together implicitly sharing state.

```jsx
// Tab compound component
const TabContext = createContext();

const Tabs = ({ children, defaultIndex = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  
  return (
    <TabContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div className="tabs">{children}</div>
    </TabContext.Provider>
  );
};

const TabList = ({ children }) => {
  return <div className="tab-list" role="tablist">{children}</div>;
};

const Tab = ({ children, index }) => {
  const { activeIndex, setActiveIndex } = useContext(TabContext);
  const isActive = activeIndex === index;
  
  return (
    <button
      role="tab"
      aria-selected={isActive}
      className={`tab ${isActive ? 'active' : ''}`}
      onClick={() => setActiveIndex(index)}
    >
      {children}
    </button>
  );
};

const TabPanels = ({ children }) => {
  return <div className="tab-panels">{children}</div>;
};

const TabPanel = ({ children, index }) => {
  const { activeIndex } = useContext(TabContext);
  
  if (activeIndex !== index) return null;
  
  return (
    <div role="tabpanel" className="tab-panel">
      {children}
    </div>
  );
};

// Attach sub-components
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panels = TabPanels;
Tabs.Panel = TabPanel;

// Usage - clean and declarative API
const App = () => (
  <Tabs defaultIndex={0}>
    <Tabs.List>
      <Tabs.Tab index={0}>Profile</Tabs.Tab>
      <Tabs.Tab index={1}>Settings</Tabs.Tab>
      <Tabs.Tab index={2}>Notifications</Tabs.Tab>
    </Tabs.List>
    
    <Tabs.Panels>
      <Tabs.Panel index={0}><ProfileContent /></Tabs.Panel>
      <Tabs.Panel index={1}><SettingsContent /></Tabs.Panel>
      <Tabs.Panel index={2}><NotificationsContent /></Tabs.Panel>
    </Tabs.Panels>
  </Tabs>
);
```

```jsx
// Flexible compound component with React.Children
const Select = ({ children, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <SelectContext.Provider value={{ value, onChange, isOpen, setIsOpen }}>
      <div className="select">{children}</div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = ({ children }) => {
  const { value, isOpen, setIsOpen } = useContext(SelectContext);
  
  return (
    <button 
      className="select-trigger"
      onClick={() => setIsOpen(!isOpen)}
    >
      {children || value || 'Select...'}
    </button>
  );
};

const SelectOptions = ({ children }) => {
  const { isOpen } = useContext(SelectContext);
  
  if (!isOpen) return null;
  
  return <div className="select-options">{children}</div>;
};

const SelectOption = ({ value, children }) => {
  const { value: selectedValue, onChange, setIsOpen } = useContext(SelectContext);
  
  return (
    <div
      className={`select-option ${value === selectedValue ? 'selected' : ''}`}
      onClick={() => {
        onChange(value);
        setIsOpen(false);
      }}
    >
      {children}
    </div>
  );
};

// Usage
const App = () => {
  const [color, setColor] = useState('');
  
  return (
    <Select value={color} onChange={setColor}>
      <SelectTrigger />
      <SelectOptions>
        <SelectOption value="red">Red</SelectOption>
        <SelectOption value="blue">Blue</SelectOption>
        <SelectOption value="green">Green</SelectOption>
      </SelectOptions>
    </Select>
  );
};
```

**When to Use:**
- Building component libraries (Tabs, Accordion, Menu)
- Complex components with multiple parts
- Flexible, declarative APIs

---

### 6. Controlled vs Uncontrolled Components

Managing form state and component control.

```jsx
// Controlled Component - React manages state
const ControlledInput = () => {
  const [value, setValue] = useState('');
  
  const handleChange = (e) => {
    // Can validate/transform before updating
    const newValue = e.target.value.toUpperCase();
    setValue(newValue);
  };
  
  return (
    <input 
      value={value} 
      onChange={handleChange}
      placeholder="Controlled input"
    />
  );
};

// Uncontrolled Component - DOM manages state
const UncontrolledInput = () => {
  const inputRef = useRef();
  
  const handleSubmit = () => {
    console.log('Value:', inputRef.current.value);
  };
  
  return (
    <>
      <input ref={inputRef} defaultValue="initial" />
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
};
```

```jsx
// Hybrid - Controllable component pattern
const Input = ({ value: controlledValue, defaultValue, onChange, ...props }) => {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  
  // Determine if controlled
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    
    onChange?.(e);
  };
  
  return <input value={value} onChange={handleChange} {...props} />;
};

// Can be used both ways
<Input defaultValue="uncontrolled" />
<Input value={controlled} onChange={handleChange} />
```

**When to Use:**
- **Controlled**: Form validation, conditional disabling, formatted inputs
- **Uncontrolled**: Simple forms, file inputs, integrating with non-React code

---

### 7. State Reducer Pattern

Allow consumers to customize state transitions.

```jsx
// Toggle with state reducer
const useToggle = ({ reducer = (state, action) => action.changes } = {}) => {
  const [{ on }, dispatch] = useReducer(
    (state, action) => {
      const changes = toggleReducer(state, action);
      return reducer(state, { ...action, changes });
    },
    { on: false }
  );
  
  const toggle = () => dispatch({ type: 'TOGGLE' });
  const setOn = () => dispatch({ type: 'SET_ON' });
  const setOff = () => dispatch({ type: 'SET_OFF' });
  
  return { on, toggle, setOn, setOff };
};

const toggleReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE':
      return { on: !state.on };
    case 'SET_ON':
      return { on: true };
    case 'SET_OFF':
      return { on: false };
    default:
      return state;
  }
};

// Usage - customize behavior
const App = () => {
  const [clickCount, setClickCount] = useState(0);
  
  const { on, toggle } = useToggle({
    reducer: (state, action) => {
      // Prevent toggle after 4 clicks
      if (action.type === 'TOGGLE' && clickCount >= 4) {
        return state; // Return unchanged state
      }
      return action.changes;
    }
  });
  
  const handleClick = () => {
    toggle();
    setClickCount(c => c + 1);
  };
  
  return (
    <button onClick={handleClick}>
      {on ? 'ON' : 'OFF'} (Clicks: {clickCount})
    </button>
  );
};
```

**When to Use:**
- Building flexible, customizable components
- Allowing users to override default behavior
- Complex state machines with customization points

---

### 8. Props Getters Pattern

Provide functions that return props for elements.

```jsx
const useDropdown = ({ items, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  
  const getToggleProps = (props = {}) => ({
    'aria-expanded': isOpen,
    'aria-haspopup': 'listbox',
    onClick: (e) => {
      setIsOpen(!isOpen);
      props.onClick?.(e);
    },
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        setIsOpen(!isOpen);
      }
      props.onKeyDown?.(e);
    },
    ...props
  });
  
  const getMenuProps = (props = {}) => ({
    role: 'listbox',
    'aria-hidden': !isOpen,
    ...props
  });
  
  const getItemProps = ({ item, index, ...props } = {}) => ({
    role: 'option',
    'aria-selected': highlightedIndex === index,
    onClick: (e) => {
      onSelect(item);
      setIsOpen(false);
      props.onClick?.(e);
    },
    onMouseEnter: () => setHighlightedIndex(index),
    ...props
  });
  
  return {
    isOpen,
    highlightedIndex,
    getToggleProps,
    getMenuProps,
    getItemProps,
  };
};

// Usage - full control over rendering
const Dropdown = ({ items, onSelect }) => {
  const {
    isOpen,
    getToggleProps,
    getMenuProps,
    getItemProps
  } = useDropdown({ items, onSelect });
  
  return (
    <div className="dropdown">
      <button {...getToggleProps({ className: 'dropdown-toggle' })}>
        Select Item
      </button>
      
      {isOpen && (
        <ul {...getMenuProps({ className: 'dropdown-menu' })}>
          {items.map((item, index) => (
            <li
              key={item.id}
              {...getItemProps({ 
                item, 
                index,
                className: 'dropdown-item'
              })}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

**When to Use:**
- Accessibility (props getters handle ARIA attributes)
- Flexible component APIs
- When consumers need control over DOM elements

---

### 9. Component Composition

Build complex UIs from simple, composable pieces.

```jsx
// Card composition
const Card = ({ children, className = '' }) => (
  <div className={`card ${className}`}>{children}</div>
);

const CardHeader = ({ children }) => (
  <div className="card-header">{children}</div>
);

const CardTitle = ({ children, as: Tag = 'h3' }) => (
  <Tag className="card-title">{children}</Tag>
);

const CardContent = ({ children }) => (
  <div className="card-content">{children}</div>
);

const CardFooter = ({ children }) => (
  <div className="card-footer">{children}</div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

// Usage - highly composable
const ProductCard = ({ product }) => (
  <Card>
    <Card.Header>
      <Card.Title>{product.name}</Card.Title>
    </Card.Header>
    <Card.Content>
      <img src={product.image} alt={product.name} />
      <p>{product.description}</p>
    </Card.Content>
    <Card.Footer>
      <span>${product.price}</span>
      <button>Add to Cart</button>
    </Card.Footer>
  </Card>
);
```

```jsx
// Slots pattern with children
const Layout = ({ children }) => {
  const slots = {};
  
  React.Children.forEach(children, child => {
    if (child?.type?.displayName) {
      slots[child.type.displayName] = child;
    }
  });
  
  return (
    <div className="layout">
      <header>{slots.Header}</header>
      <aside>{slots.Sidebar}</aside>
      <main>{slots.Content}</main>
      <footer>{slots.Footer}</footer>
    </div>
  );
};

const Header = ({ children }) => children;
Header.displayName = 'Header';

const Sidebar = ({ children }) => children;
Sidebar.displayName = 'Sidebar';

const Content = ({ children }) => children;
Content.displayName = 'Content';

const Footer = ({ children }) => children;
Footer.displayName = 'Footer';

Layout.Header = Header;
Layout.Sidebar = Sidebar;
Layout.Content = Content;
Layout.Footer = Footer;

// Usage
const App = () => (
  <Layout>
    <Layout.Header><Nav /></Layout.Header>
    <Layout.Sidebar><Menu /></Layout.Sidebar>
    <Layout.Content><MainContent /></Layout.Content>
    <Layout.Footer><Copyright /></Layout.Footer>
  </Layout>
);
```

---

## Best Practices

1. **Prefer Hooks**: Use custom hooks over HOCs and render props
2. **Single Responsibility**: Each component should do one thing well
3. **Lift State Up**: Share state by lifting to nearest common ancestor
4. **Colocation**: Keep related code close together
5. **Composition Over Configuration**: Build from small pieces
6. **Consistent Props API**: Use common conventions (onChange, onSubmit, etc.)

## Related Skills

- For rendering strategies, see: `rendering-patterns`
- For performance optimization, see: `performance-patterns`
