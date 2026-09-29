/**
 * Ansh JEE — Pre-paint Theme Initializer
 * This file is loaded synchronously in <head> without defer to prevent theme flash.
 * Required as an external file to comply with strict Content-Security-Policy.
 */
(function() {
  try {
    var raw = localStorage.getItem('ajee:v1:profile');
    var theme = 'mono';
    if (raw) {
      var profile = JSON.parse(raw);
      if (profile && profile.theme) {
        theme = profile.theme;
      }
    }
    // Validate theme against supported themes
    var validThemes = ['mono', 'paper', 'midnight', 'ember', 'sage'];
    if (validThemes.indexOf(theme) === -1) {
      theme = 'mono';
    }
    document.documentElement.setAttribute('data-theme', theme);

    // Update browser theme-color meta tag
    var themeColors = {
      mono: '#050505',
      paper: '#f6f3ee',
      midnight: '#060a12',
      ember: '#0a0705',
      sage: '#070b09'
    };
    var metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor && themeColors[theme]) {
      metaThemeColor.setAttribute('content', themeColors[theme]);
    }
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'mono');
  }
})();
