# Mermaid Diagrams

QuickDoc supports Mermaid diagrams for creating flowcharts, sequence diagrams, class diagrams, and more directly in your markdown files.

## Flowchart

Create flowcharts to visualize processes and workflows:

```mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]
```

## Sequence Diagram

Visualize interactions between different components:

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Server
    participant Database
    
    User->>Browser: Enter URL
    Browser->>Server: HTTP Request
    Server->>Database: Query Data
    Database-->>Server: Return Results
    Server-->>Browser: HTTP Response
    Browser-->>User: Display Page
```

## Class Diagram

Document your application's structure:

```mermaid
classDiagram
    class MarkdownFile {
        +string slug
        +string title
        +string content
        +boolean isMDX
        +string path
    }
    
    class AppConfig {
        +SiteConfig site
        +NavigationConfig navigation
        +ThemeConfig theme
    }
    
    class Component {
        +render()
        +update()
    }
    
    MarkdownFile --> Component
    AppConfig --> Component
```

## State Diagram

Show state transitions in your application:

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Loading: User searches
    Loading --> Results: Data loaded
    Loading --> Error: Failed
    Results --> Idle: Clear search
    Error --> Idle: Retry
    Results --> [*]
```

## Git Graph

Visualize your branching strategy:

```mermaid
gitGraph
    commit
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
    commit
```

## Pie Chart

Display data distributions:

```mermaid
pie title Documentation Pages by Type
    "Markdown" : 45
    "MDX" : 30
    "Components" : 15
    "Examples" : 10
```

## Entity Relationship Diagram

Model your database schema:

```mermaid
erDiagram
    USER ||--o{ POST : creates
    USER ||--o{ COMMENT : writes
    POST ||--o{ COMMENT : has
    
    USER {
        int id PK
        string username
        string email
        datetime created_at
    }
    
    POST {
        int id PK
        int user_id FK
        string title
        text content
        datetime published_at
    }
    
    COMMENT {
        int id PK
        int user_id FK
        int post_id FK
        text content
        datetime created_at
    }
```

## Journey Diagram

Map user experiences:

```mermaid
journey
    title User Documentation Journey
    section Discovery
      Find documentation: 5: User
      Search for topic: 4: User
    section Learning
      Read content: 5: User
      Try examples: 4: User
      Copy code: 5: User
    section Implementation
      Apply knowledge: 4: User
      Test solution: 3: User
      Success: 5: User
```

## Usage

### In Markdown Files

Simply use a code block with the `mermaid` language identifier:

\`\`\`mermaid
graph LR
    A[Start] --> B[End]
\`\`\`

### In MDX Files

You can also import and use the Mermaid component directly:

```mdx
import { Mermaid } from '../components';

<Mermaid chart={`
graph TD
    A[Start] --> B[End]
`} />
```

## Features

- **Automatic rendering**: Mermaid diagrams are automatically detected and rendered
- **Dark mode support**: Diagrams adapt to your theme
- **Error handling**: Invalid syntax shows helpful error messages
- **Responsive**: Diagrams scale appropriately on all devices
- **Multiple types**: Supports all Mermaid diagram types

## Tips

1. **Keep it simple**: Complex diagrams can be hard to read
2. **Use consistent styling**: Stick to a visual language
3. **Add labels**: Make relationships clear
4. **Test syntax**: Use [Mermaid Live Editor](https://mermaid.live) to validate
5. **Consider mobile**: Ensure diagrams are readable on small screens

## Resources

- [Mermaid Documentation](https://mermaid.js.org/)
- [Mermaid Live Editor](https://mermaid.live)
- [Diagram Syntax Reference](https://mermaid.js.org/intro/syntax-reference.html)
