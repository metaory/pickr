// Copy element URL action
try {
  const copyUrlAction = {
    name: 'Copy URL',
    key: 'u',
    description: 'Copy element href or src URL',
    category: 'copy',
    execute: (element) => {
      const url = element.href || element.src || ''
      if (url) {
        navigator.clipboard.writeText(url)
        return {
          feedback: `Copied URL: ${url}`,
          result: url
        }
      }
      return {
        feedback: 'No URL found on element',
        result: null
      }
    }
  }
  if (window.pickrActionManager) {
    window.pickrActionManager.register(copyUrlAction)
  }
} catch (e) {
  // Action already registered, ignore
} 