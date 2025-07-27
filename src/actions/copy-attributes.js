// Declarative action definition
const copyAttributesAction = {
  name: 'Copy Attributes',
  key: 'a',
  aliases: [],
  category: 'Copy',
  description: 'Copy element attributes',
  execute: (element) => {
    const attributes = Array.from(element.attributes || [])
    if (attributes.length === 0) {
      return { feedback: 'No attributes found', result: null, error: true }
    }
    
    const attrString = attributes.map(attr => `${attr.name}="${attr.value}"`).join(' ')
    return { feedback: 'Attributes copied to clipboard', result: attrString }
  }
}

// Register action
window.pickrActionManager.register(copyAttributesAction) 