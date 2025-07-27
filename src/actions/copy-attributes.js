// Declarative action definition
const copyAttributesAction = {
  name: 'Copy Attributes',
  key: 'a',
  aliases: [],
  category: 'Copy',
  description: 'Copy element attributes',
  execute: (element) => {
    const attributes = Array.from(element.attributes || [])
      .map(attr => `${attr.name}="${attr.value}"`)
      .join('\n')
    
    return attributes
      ? { feedback: 'Attributes copied to clipboard', result: attributes }
      : { feedback: 'No attributes found', result: null, error: true }
  }
}

// Register action
window.pickrActionManager.register(copyAttributesAction) 