# Markdown Guide

A comprehensive guide to writing documentation with Markdown in QuickDoc.

## What is Markdown?

Markdown is a lightweight markup language that lets you format text using simple, readable syntax. It's perfect for writing documentation because it's easy to learn and produces clean, professional-looking content.

## Basic Syntax

### Headings

Create headings using the `#` symbol. More `#` symbols = smaller heading:

```markdown
# Heading 1 (Largest)
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6 (Smallest)
```

**Important**: In QuickDoc, H2 headings create new pages by default. H3 and below appear in the sidebar under their parent H2.

### Paragraphs

Write paragraphs by simply typing text. Leave a blank line between paragraphs:

```markdown
This is the first paragraph.

This is the second paragraph.
```

### Text Formatting

Make text **bold**, *italic*, or ***both***:

```markdown
**Bold text**
*Italic text*
***Bold and italic***
~~Strikethrough~~
```

Result:
- **Bold text**
- *Italic text*
- ***Bold and italic***
- ~~Strikethrough~~

### Lists

#### Unordered Lists

Use `-`, `*`, or `+` for bullet points:

```markdown
- First item
- Second item
- Third item
  - Nested item
  - Another nested item
```

Result:
- First item
- Second item
- Third item
  - Nested item
  - Another nested item

#### Ordered Lists

Use numbers followed by periods:

```markdown
1. First step
2. Second step
3. Third step
   1. Nested step
   2. Another nested step
```

Result:
1. First step
2. Second step
3. Third step
   1. Nested step
   2. Another nested step

### Links

Create clickable links:

```markdown
[Link text](https://example.com)
[Link with title](https://example.com "Hover to see this title")
```

Result:
- [Link text](https://example.com)
- [Link with title](https://example.com "Hover to see this title")

#### Anchor Links

Link to headings within your documentation:

```markdown
[Jump to Basic Syntax](#basic-syntax)
```

Result: [Jump to Basic Syntax](#basic-syntax)

**Tip**: QuickDoc automatically creates anchor links for all headings. The anchor is the heading text in lowercase with spaces replaced by hyphens.

### Images

Add images using this syntax:

```markdown
![Alt text](image-url.jpg)
![Alt text with title](image-url.jpg "Image title")
```

### Code

#### Inline Code

Use backticks for `inline code`:

```markdown
Use the `console.log()` function to print output.
```

Result: Use the `console.log()` function to print output.

#### Code Blocks

Use triple backticks for multi-line code blocks. Specify the language for syntax highlighting:

````markdown
```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}
```
````

Result:

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}
```

**Supported languages**: javascript, typescript, python, java, html, css, bash, json, markdown, and many more.

#### MDX

QuickDoc also supports MDX (Markdown + JSX) for more complex components:

```mdx
import { Button } from "@/components/ui/button";

<Button>Click me</Button>
```

Result:

<Example />

### Horizontal Rules

Create a horizontal line using three or more hyphens, asterisks, or underscores:

```markdown
---
***
___
```

Result:

---

### Tables

Create tables using pipes `|` and hyphens `-`:

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Row 1    | Data     | More data|
| Row 2    | Data     | More data|
```

Result:

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Row 1    | Data     | More data|
| Row 2    | Data     | More data|

#### Table Alignment

Control column alignment with colons:

```markdown
| Left | Center | Right |
|:-----|:------:|------:|
| Text | Text   | Text  |
```

Result:

| Left | Center | Right |
|:-----|:------:|------:|
| Text | Text   | Text  |

## Best Practices

### Document Structure

Organize your documentation with a clear hierarchy:

```markdown
# Document Title (H1)

Brief introduction...

## Main Section (H2 - creates new page)

Section introduction...

### Subsection (H3 - appears in sidebar)

Detailed content...

#### Sub-subsection (H4 - appears in sidebar)

Even more detail...
```

### Writing Tips

1. **Start with H1**: Every document should have exactly one H1 heading at the top
2. **Use H2 for main sections**: These become separate pages in QuickDoc
3. **Keep headings descriptive**: Use clear, concise heading text
4. **Add blank lines**: Separate different elements with blank lines for readability
5. **Use code blocks**: Show code examples in properly formatted blocks
6. **Link between sections**: Use anchor links to connect related content

### Code Examples

When showing code examples, always:

1. Specify the language for syntax highlighting
2. Include comments to explain complex parts
3. Keep examples focused and concise
4. Show both the code and expected output when relevant

Example:

````markdown
```typescript
// Define a user interface
interface User {
  name: string;
  age: number;
}

// Create a user object
const user: User = {
  name: "Alice",
  age: 30
};

console.log(user);
// Output: { name: "Alice", age: 30 }
```
````

### Avoiding Common Mistakes

#### Don't skip heading levels

❌ Bad:
```markdown
# Title
### Subsection (skipped H2)
```

✅ Good:
```markdown
# Title
## Section
### Subsection
```

#### Don't forget blank lines

❌ Bad:
```markdown
## Heading
Paragraph text
- List item
```

✅ Good:
```markdown
## Heading

Paragraph text

- List item
```

## Advanced Features

### Task Lists

Create checkboxes using `- [ ]` and `- [x]`:

```markdown
- [x] Completed task
- [ ] Incomplete task
- [ ] Another task
```

Result:
- [x] Completed task
- [ ] Incomplete task
- [ ] Another task

### Escaping Characters

Use backslash `\` to escape special characters:

```markdown
\*Not italic\*
\[Not a link\]
```

Result:
- \*Not italic\*
- \[Not a link\]

### HTML in Markdown

You can use HTML tags when Markdown isn't enough:

```markdown
<div style="color: blue;">
  This text is blue.
</div>
```

**Note**: Use HTML sparingly. Stick to Markdown when possible for better readability.

## Quick Reference

### Common Syntax

| Element | Syntax |
|---------|--------|
| Heading 1 | `# Heading` |
| Heading 2 | `## Heading` |
| Bold | `**text**` |
| Italic | `*text*` |
| Link | `[text](url)` |
| Image | `![alt](url)` |
| Code | `` `code` `` |
| Code Block | ` ```language ` |
| List | `- item` |
| Numbered List | `1. item` |
| Blockquote | `> quote` |
| Horizontal Rule | `---` |

## Resources

### Learn More

- [Markdown Guide](https://www.markdownguide.org/) - Comprehensive Markdown reference
- [CommonMark](https://commonmark.org/) - Markdown specification
- [GitHub Flavored Markdown](https://github.github.com/gfm/) - Extended Markdown features

### Practice

The best way to learn Markdown is to practice! Try creating a test document in QuickDoc and experiment with different formatting options.

## Need Help?

If you have questions about Markdown or QuickDoc:

1. Check the **QuickDoc** page for configuration options
2. Review the **Quick Start** guide for setup instructions
3. Open an issue on GitHub for technical support
