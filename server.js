
const express = require('express');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const performanceCalculator = require('./performance-calculator.js');

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

// API endpoints
app.post('/api/calculate-performance', (req, res) => {
    try {
        const { cpuScore, gpuScore, gameType } = req.body;
        
        const performance = {
            game: performanceCalculator.calculateGamePerformance(cpuScore, gpuScore),
            graphics: performanceCalculator.calculateGraphicsPerformance(cpuScore, gpuScore),
            office: performanceCalculator.calculateOfficePerformance(cpuScore, gpuScore),
            bottleneck: performanceCalculator.calculateBottleneck(cpuScore, gpuScore),
            stability: performanceCalculator.calculateStability(cpuScore, gpuScore),
            tips: performanceCalculator.generatePerformanceTips(gameType, cpuScore, gpuScore)
        };
        
        res.json(performance);
    } catch (error) {
        console.error('Error calculating performance:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!', details: err.message });
});

// Start server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});
