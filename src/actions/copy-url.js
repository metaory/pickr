// Declarative action definition
const copyUrlAction = {
  name: 'Copy URL',
  key: 'u',
  aliases: [],
  category: 'Copy',
  description: 'Copy element URL',
  execute: (element) => {
    const url = element.href || element.src || element.getAttribute('data-url') || ''
    if (!url) {
      return { feedback: 'No URL found', result: null, error: true }
    }
    
    return { feedback: 'URL copied to clipboard', result: url }
  }
}

// Register action
window.pickrActionManager.register(copyUrlAction) 