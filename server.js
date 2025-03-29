addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
  }

  // Serve static files
  if (request.method === 'GET') {
    try {
      // Remove domain name from path if present
      let path = url.pathname
      console.log('Original path:', path)
      
      if (path.startsWith('/tpcom.id.vn/')) {
        path = path.replace('/tpcom.id.vn/', '/')
      }
      console.log('Normalized path:', path)
      
      // Serve index.html for root path
      if (path === '/' || path === '/index.html') {
        try {
          console.log('Attempting to serve index.html')
          // Try multiple possible paths for index.html
          const possiblePaths = ['index.html', './index.html', '/index.html']
          let asset = null
          
          for (const tryPath of possiblePaths) {
            console.log('Trying path:', tryPath)
            try {
              asset = await __STATIC_CONTENT.get(tryPath)
              if (asset) {
                console.log('Found index.html at:', tryPath)
                break
              }
            } catch (e) {
              console.log('Failed to get index.html from:', tryPath)
            }
          }
          
          if (!asset) {
            // Try serving index.html directly from filesystem
            console.log('Trying to serve index.html from filesystem')
            const fsPath = path === '/' ? '/index.html' : path
            const response = await fetch(new Request(fsPath))
            if (response.ok) {
              asset = await response.text()
              console.log('Successfully loaded index.html from filesystem')
            } else {
              throw new Error('index.html not found in any location')
            }
          }
          
          return new Response(asset, {
            headers: {
              'Content-Type': 'text/html;charset=UTF-8',
              'Cache-Control': 'no-cache',
              'Access-Control-Allow-Origin': '*'
            }
          })
        } catch (error) {
          console.error('Error serving index.html:', error)
          return new Response('index.html not found: ' + error.message, { 
            status: 404,
            headers: {
              'Content-Type': 'text/plain',
              'Access-Control-Allow-Origin': '*'
            }
          })
        }
      }
      
      // Handle other static files
      let filePath = path
      if (filePath.startsWith('/')) {
        filePath = filePath.slice(1)
      }

      console.log('Fetching file:', filePath)
      try {
        // Try multiple possible paths
        const possiblePaths = [filePath, './' + filePath, '/' + filePath]
        let asset = null
        
        for (const tryPath of possiblePaths) {
          console.log('Trying path:', tryPath)
          try {
            asset = await __STATIC_CONTENT.get(tryPath)
            if (asset) {
              console.log('Found file at:', tryPath)
              break
            }
          } catch (e) {
            console.log('Failed to get file from:', tryPath)
          }
        }
        
        if (!asset) {
          // Try serving file directly from filesystem
          console.log('Trying to serve file from filesystem')
          const response = await fetch(new Request(filePath))
          if (response.ok) {
            asset = await response.arrayBuffer()
            console.log('Successfully loaded file from filesystem')
          } else {
            throw new Error(`${filePath} not found in any location`)
          }
        }
        
        // Set appropriate content type
        let contentType = 'text/plain'
        if (filePath.endsWith('.html')) contentType = 'text/html'
        if (filePath.endsWith('.css')) contentType = 'text/css'
        if (filePath.endsWith('.js')) contentType = 'application/javascript'
        if (filePath.endsWith('.json')) contentType = 'application/json'
        if (filePath.match(/\.(jpg|jpeg)$/i)) contentType = 'image/jpeg'
        if (filePath.endsWith('.png')) contentType = 'image/png'
        if (filePath.endsWith('.gif')) contentType = 'image/gif'
        if (filePath.endsWith('.webp')) contentType = 'image/webp'
        
        // Set appropriate cache control
        let cacheControl = 'public, max-age=3600' // Default 1 hour
        if (filePath.endsWith('.css') || filePath.endsWith('.js')) {
          cacheControl = 'public, max-age=86400' // 24 hours for CSS/JS
        } else if (filePath.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          cacheControl = 'public, max-age=604800' // 7 days for images
        }
        
        console.log('Successfully serving file:', filePath)
        return new Response(asset, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': cacheControl,
            'Access-Control-Allow-Origin': '*'
          }
        })
      } catch (error) {
        console.error('Error serving static file:', error)
        return new Response(`File not found: ${error.message}`, { 
          status: 404,
          headers: {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*'
          }
        })
      }
    } catch (error) {
      console.error('Error in GET handler:', error)
      return new Response(`Server error: ${error.message}`, { 
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }
  }
  
  // Handle API requests
  if (url.pathname === '/api/calculate-performance' && request.method === 'POST') {
    try {
      const { cpuScore, gpuScore, gameType } = await request.json()
      
      const performance = {
        game: calculateGamePerformance(cpuScore, gpuScore),
        graphics: calculateGraphicsPerformance(cpuScore, gpuScore),
        office: calculateOfficePerformance(cpuScore, gpuScore),
        bottleneck: calculateBottleneck(cpuScore, gpuScore),
        stability: calculateStability(cpuScore, gpuScore),
        tips: generatePerformanceTips(gameType, cpuScore, gpuScore)
      }
      
      return new Response(JSON.stringify(performance), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    } catch (error) {
      console.error('Error handling API request:', error)
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }
  }
  
  return new Response('Not Found', { 
    status: 404,
    headers: {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*'
    }
  })
}
