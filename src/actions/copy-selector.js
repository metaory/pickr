// Copy CSS selector for element action
try {
  const generateSelector = (element) => {
    if (element.id) return `#${element.id}`
    let path = []
    let current = element
    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase()
      if (current.className) {
        const classes = current.className.split(' ').filter(c => c.trim())
        if (classes.length > 0) {
          selector += '.' + classes.join('.')
        }
      }
      const siblings = Array.from(current.parentNode?.children || [])
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1
        selector += `:nth-child(${index})`
      }
      path.unshift(selector)
      current = current.parentNode
    }
    return path.join(' > ')
  }
  
  const copySelectorAction = {
    name: 'Copy Selector',
    key: 's',
    description: 'Copy CSS selector for element',
    category: 'copy',
    execute: (element) => {
      const selector = generateSelector(element)
      navigator.clipboard.writeText(selector)
      return {
        feedback: `Copied selector: ${selector}`,
        result: selector
      }
    }
  }
  if (window.pickrActionManager) {
    window.pickrActionManager.register(copySelectorAction)
  }
} catch (e) {
  // Action already registered, ignore
} 