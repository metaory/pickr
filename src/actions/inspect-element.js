// Inspect element action
try {
  const inspectElementAction = {
    name: 'Inspect Element',
    key: 'i',
    description: 'Show element details and properties',
    category: 'inspect',
    execute: (element) => {
      const details = {
        tagName: element.tagName,
        id: element.id,
        className: element.className,
        innerText: element.innerText?.substring(0, 100) + (element.innerText?.length > 100 ? '...' : ''),
        children: element.children.length,
        attributes: Array.from(element.attributes).map(attr => `${attr.name}="${attr.value}"`),
        computedStyle: {
          display: getComputedStyle(element).display,
          position: getComputedStyle(element).position,
          width: getComputedStyle(element).width,
          height: getComputedStyle(element).height
        }
      }
      return {
        feedback: `Inspected ${element.tagName.toLowerCase()} element`,
        result: details
      }
    }
  }
  if (window.pickrActionManager) {
    window.pickrActionManager.register(inspectElementAction)
  }
} catch (e) {
  // Action already registered, ignore
} 