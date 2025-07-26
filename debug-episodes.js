// Debug script to check episode data and video URLs
// Run this in the browser console on your streaming platform

function debugEpisodeData() {
  console.log('🔍 Debugging Episode Data...');
  
  // Check if anime service is available
  if (typeof window.angular === 'undefined') {
    console.log('⚠️ Angular not detected. Make sure you\'re on the streaming platform page.');
    return;
  }
  
  // Get anime data from localStorage or check network requests
  console.log('📡 Checking for anime data...');
  
  // Check localStorage for any anime data
  const keys = Object.keys(localStorage);
  console.log('🗄️ LocalStorage keys:', keys);
  
  // Look for anime-related data
  keys.forEach(key => {
    if (key.includes('anime') || key.includes('episode')) {
      console.log(`📦 ${key}:`, localStorage.getItem(key));
    }
  });
  
  // Check if we can access the Angular component
  const appRoot = document.querySelector('app-root');
  if (appRoot) {
    console.log('✅ Found app-root element');
    
    // Try to find anime detail component
    const animeDetail = document.querySelector('app-anime-detail');
    if (animeDetail) {
      console.log('✅ Found anime-detail component');
      
      // Check for episode elements
      const episodes = document.querySelectorAll('[class*="episode"]');
      console.log(`📺 Found ${episodes.length} episode-related elements`);
      
      episodes.forEach((ep, index) => {
        if (index < 5) { // Only log first 5
          console.log(`Episode ${index + 1}:`, {
            element: ep,
            classes: ep.className,
            text: ep.textContent?.substring(0, 100)
          });
        }
      });
    }
  }
  
  // Check network requests for anime data
  console.log('🌐 To check network requests:');
  console.log('1. Open DevTools > Network tab');
  console.log('2. Filter by "anime" or "episode"');
  console.log('3. Look for API responses with video URLs');
  
  // Instructions for manual testing
  console.log('\n🧪 Manual Testing Steps:');
  console.log('1. Click on any anime to open details');
  console.log('2. Check console for episode data logs');
  console.log('3. Click on an episode and watch for:');
  console.log('   - "🎬 Episode clicked" logs');
  console.log('   - "✅ Episode has video URL" logs');
  console.log('   - "🎥 Video player should now be visible" logs');
  console.log('4. If video player appears but doesn\'t play, check:');
  console.log('   - Video URL accessibility');
  console.log('   - CORS issues');
  console.log('   - Video format compatibility');
}

// Auto-run when script loads
debugEpisodeData();

// Export for manual use
window.debugEpisodeData = debugEpisodeData;
