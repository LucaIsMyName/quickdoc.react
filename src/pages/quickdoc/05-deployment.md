# Deployment

## Build

```bash
npm run build
```

This creates a `dist/` directory with your static site.

## Deployment Options

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### GitHub Pages
```bash
npm install --save-dev gh-pages
npm run build
npx gh-pages -d dist
```

### Static Hosting
Upload the `dist/` folder to any static hosting service:
- AWS S3
- Firebase Hosting
- Surge.sh
- Any web server

## Environment Variables

Set these for production:
- `VITE_SITE_URL`: Your site's URL
- `VITE_GA_ID`: Google Analytics ID (optional)
