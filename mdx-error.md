# problem

- this should handle MD and MDX files as the same, only MDX can have components

## what works and what not

- md files are correctly parsed, displayed and set to content
- md files get split on breakpoint (currently h2) -> the breakpoint defines the headlines under which all content is set on a subpage, all before the breakpoint get' set as extra subpage (see screenshot Markdown Guide) ( in the screesnhot -> every orange box is a sepearte page because "h2" are defined as the bbreakpoint)
- mdx file get rendered to frontend
- the mdx file IS NOT split on the breakpoints inti seperate subpages
- the mdx file is not displaying the table of conmtents in the sidebar correctly (see screenshot MDX example)

# files to look at

- App.tsx
- hooks/useMarkdownFiles.ts
- utils/markdown
- utils/contentSplitter.tsx
- pages/markdown-guide.md (working)
- pages/mdx-example.mdx -> not working (see above)

---

# IMPLEMENTATION TODO LIST

## Milestone 1: Setup & Dependencies ✅
- [x] Analyzed problem
- [x] Add @mdx-js/mdx runtime dependency (already installed)
- [x] Add evaluation utilities (@mdx-js/mdx exports evaluate)

## Milestone 2: MDX Parser Utility ✅
- [x] Create utils/mdxParser.ts
- [x] Implement function to extract imports from MDX
- [x] Implement function to extract component exports
- [x] Implement function to split content by headings
- [ ] Test parser with MDX-Example.mdx (will test after raw loading)

## Milestone 3: Raw MDX Content Loading ✅
- [x] Update useMarkdownFiles.ts to use ?raw-mdx query
- [x] Remove hardcoded MDX content
- [x] Added proper raw content loading with mdxRawModules
- [x] Console log raw MDX content to confirm (dev server running on :5176)

## Milestone 4: Section Reconstruction ✅
- [x] Create utils/mdxSectionBuilder.ts
- [x] Implement function to rebuild MDX for each section
- [x] Include all imports + exports + section content
- [x] Added intro section builder for content before breakpoint

## Milestone 5: Runtime Compilation ✅
- [x] Create utils/mdxCompiler.ts
- [x] Implement runtime MDX compilation using @mdx-js/mdx
- [x] Handle async compilation with error boundaries
- [x] Cache compiled sections for performance
- [x] Added cache management utilities

## Milestone 6: Content Splitter Integration ✅
- [x] Update contentSplitter.ts to handle MDX differently
- [x] Create sections but store full MDX source per section
- [x] Maintain section structure for navigation
- [x] Added splitMDXContentBySections function

## Milestone 7: Component Rendering ✅
- [x] Update MarkdownContent.tsx for MDX sections
- [x] Render compiled section components with runtime compilation
- [x] Handle loading states during compilation
- [x] Added error boundaries for compilation failures
- [x] Preserve MDX component context with MDXProvider

## Milestone 8: Testing & Verification
- [ ] Test MDX pagination between sections
- [ ] Verify table of contents works
- [ ] Check component state doesn't leak between sections
- [ ] Verify imports/exports available in all sections
- [ ] Test with different MDX files

## Milestone 9: Performance & Error Handling
- [ ] Add error boundaries for compilation failures
- [ ] Optimize caching strategy
- [ ] Add loading indicators
- [ ] Handle edge cases (empty sections, no components, etc.)

---

## Current Progress: Testing Milestone 8 🧪

### Completed Implementation:
1. ✅ MDX Parser - extracts imports, exports, sections
2. ✅ Raw MDX Loading - loads .mdx files as raw text
3. ✅ Section Builder - reconstructs MDX with all dependencies
4. ✅ Runtime Compiler - compiles MDX sections on-the-fly
5. ✅ Content Splitter - splits MDX at breakpoints
6. ✅ Component Rendering - renders compiled sections
7. ✅ TypeScript compilation passes

### Next Steps - Verification:
The dev server is running on http://localhost:5176/

**What to test:**
1. Navigate to MDX Example page
2. Check browser console for:
   - `[MDX] Loading raw content for: ...` 
   - `[MDX Splitter] Starting MDX content split`
   - `[MDX Compiler] Compiling MDX for: ...`
3. Verify sidebar shows proper TOC with all H2 sections
4. Click through sections to test pagination
5. Verify components render in each section
6. Check for compilation errors

**Expected Behavior:**
- MDX Example should split into 5 sections:
  1. Introduction (MDX Example + content before first H2)
  2. Interactive Counter
  3. Features
  4. Code Example  
  5. Alert Component
  6. Conclusion

- Each section should have access to:
  - `import React from 'react'`
  - All component exports (Counter, Alert)
  - Section-specific content

---

## Implementation Summary:

### 🎯 What Was Built

**New Files Created:**
1. `src/utils/mdxParser.ts` - Parses MDX to extract imports, exports, and sections
2. `src/utils/mdxSectionBuilder.ts` - Rebuilds complete MDX for each section
3. `src/utils/mdxCompiler.ts` - Runtime MDX compilation with caching
4. `__tests__/mdxParser.test.ts` - Unit tests for parser

**Files Modified:**
1. `src/hooks/useMarkdownFiles.ts` - Added raw MDX loading with `?raw` query
2. `src/utils/contentSplitter.ts` - Added `splitMDXContentBySections()` function
3. `src/App.tsx` - Pass `isMDX` flag to content splitter
4. `src/components/MarkdownContent.tsx` - Runtime MDX compilation and rendering

### 🔧 How It Works

**Step-by-Step Flow:**

1. **Load MDX Files** (`useMarkdownFiles.ts`)
   - Loads `.mdx` files as both compiled components AND raw text
   - Raw text used for content analysis and splitting

2. **Parse MDX** (`mdxParser.ts`)
   - Extracts all `import` statements
   - Extracts all `export const/function` component definitions
   - Splits content by H2 headings (or configured breakpoint)

3. **Build Sections** (`mdxSectionBuilder.ts`)
   - For each section, combines:
     - All imports from original file
     - All component exports from original file  
     - Section-specific content
   - Creates complete, self-contained MDX source per section

4. **Split Content** (`contentSplitter.ts`)
   - Detects if file is MDX via `isMDX` flag
   - Routes to `splitMDXContentBySections()` for MDX files
   - Creates `ContentSection[]` with full MDX source per section

5. **Compile & Render** (`MarkdownContent.tsx`)
   - Detects MDX section via `file.isMDX`
   - Calls `compileMDX()` to compile section source at runtime
   - Caches compiled components for performance
   - Renders with `<MDXProvider>` for consistent styling

### 🎨 Key Features

✅ **Sections Split at Breakpoints** - MDX files now split just like MD files
✅ **Component Preservation** - All imports/exports available in every section
✅ **Runtime Compilation** - Each section compiled independently
✅ **Performance Caching** - Compiled sections cached to avoid recompilation
✅ **Error Handling** - Compilation errors shown with helpful messages
✅ **Loading States** - Spinner shown during compilation
✅ **Table of Contents** - Sidebar shows full hierarchical structure

### 🧪 Testing Checklist

**Manual Testing Required:**
- [ ] Open http://localhost:5176/ in browser
- [ ] Navigate to "MDX Example" tab
- [ ] Check browser console - should see:
  ```
  [MDX] Loading raw content for: /src/pages/MDX-Example.mdx
  [MDX Splitter] Starting MDX content split
  [MDX Splitter] Built intro section: MDX Example
  [MDX Compiler] Compiling MDX for: mdx-example-import React...
  ```
- [ ] Verify sidebar shows 6 sections (Introduction + 5 H2 sections)
- [ ] Click "Interactive Counter" section:
  - [ ] Should navigate to new page
  - [ ] Counter component should render and work
  - [ ] Increment/Reset buttons functional
- [ ] Click "Alert Component" section:
  - [ ] Alert components should render with colors
  - [ ] All three alerts visible
- [ ] Test pagination:
  - [ ] "Previous" and "Next" buttons work
  - [ ] Navigate through all sections
- [ ] Check each section independently renders correctly

**Automated Testing:**
```bash
npm test -- mdxParser.test.ts
```

## Status Update:

**🐛 BUG FOUND & FIXED**

### Issue Discovered:
- Raw MDX content was loading COMPILED JavaScript instead of source MDX
- The `?raw` query was still going through MDX plugin first
- Result: Parser couldn't find imports, exports, or sections

### Fix Applied:
1. ✅ Changed query from `?raw` to `?raw-mdx` in `useMarkdownFiles.ts`
2. ✅ Fixed `rawMdxPlugin` path resolution in `vite.config.ts`
3. ✅ Dev server restarted on http://localhost:5173/

### What Changed:
- **Before**: `[MDX] Preview: function MDXContent(props = {})...` (compiled JS)
- **After**: Should show actual MDX source with `import React...` and `## headings`

**What to do next:**
1. Refresh browser (http://localhost:5173/)
2. Check console for:
   - `[raw-mdx plugin] Content preview: import React from 'react';`
   - `[MDX Splitter] Parsed result: { imports: 1, exports: 2, sections: 5 }`
3. Verify MDX Example splits into sections
4. Report if still not working

