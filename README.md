# Plant Breeding - Next.js GitHub Pages

A simple Next.js website configured for GitHub Pages deployment.

## Getting Started

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

Build the static site:
```bash
npm run build
```

The static files will be in the `out` directory.

## GitHub Pages Deployment

This project is configured to automatically deploy to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Push to GitHub**: Push this repository to GitHub.

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" in the left sidebar
   - Under "Source", select "GitHub Actions"

3. **Configure basePath (if needed)**:
   - If your repository name is not `plant-breeding`, you'll need to update the `basePath` in `next.config.js`
   - Uncomment and set the `basePath` and `assetPrefix` to match your repository name:
   ```js
   basePath: '/your-repo-name',
   assetPrefix: '/your-repo-name',
   ```

4. **Deploy**: The GitHub Actions workflow will automatically build and deploy your site when you push to the `main` branch.

Your site will be available at: `https://yourusername.github.io/plant-breeding/`

## Project Structure

```
.
├── app/              # Next.js app directory
│   ├── layout.tsx   # Root layout
│   ├── page.tsx     # Homepage
│   └── globals.css  # Global styles
├── .github/         # GitHub Actions workflow
├── next.config.js   # Next.js configuration
├── tailwind.config.ts # Tailwind CSS configuration
└── package.json     # Dependencies
```

## Technologies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **GitHub Actions** - CI/CD



