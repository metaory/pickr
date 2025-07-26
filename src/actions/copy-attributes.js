// Copy element attributes action
try {
  const copyAttributesAction = {
    name: 'Copy Attributes',
    key: 'a',
    description: 'Copy element attributes as JSON',
    category: 'copy',
    execute: (element) => {
      const attrs = {}
      for (let attr of element.attributes) {
        attrs[attr.name] = attr.value
      }
      const json = JSON.stringify(attrs, null, 2)
      navigator.clipboard.writeText(json)
      return {
        feedback: `Copied ${Object.keys(attrs).length} attributes`,
        result: attrs
      }
    }
  }
  if (window.pickrActionManager) {
    window.pickrActionManager.register(copyAttributesAction)
  }
} catch (e) {
  // Action already registered, ignore
} 