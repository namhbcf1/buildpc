const express = require('express');
const path = require('path');
const cors = require('cors');
const compression = require('compression');

const app = express();
const port = process.env.PORT || 3000;

// Enable compression
app.use(compression());

// Configure CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Add security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Serve optimized images with aggressive caching
app.use('/optimized-images', express.static(path.join(__dirname, 'optimized-images'), {
    maxAge: '7d', // Cache for 7 days
    etag: true,
    immutable: true,
    lastModified: true
}));

// Serve static files with improved caching strategy
app.use(express.static(path.join(__dirname), {
    maxAge: '7d',
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
        // CSS, JS files get longer cache time
        if (path.endsWith('.css') || path.endsWith('.js')) {
            res.setHeader('Cache-Control', 'public, max-age=604800'); // 7 days
        }
        // HTML files shouldn't be cached as long
        else if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'public, max-age=43200'); // 12 hours
        }
    }
}));

app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!', details: err.message });
});

// Start server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});
