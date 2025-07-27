// Global action manager for pickr
if (window.pickrActionManager) {
  // Already initialized, exit early
  console.log('pickr action manager already initialized')
} else {
window.pickrActionManager = {
  // Declarative action definitions
  actions: new Map(),
  
  // Declarative alias mappings
  aliases: new Map(),
  
  // Action categories for organization
  categories: new Set(),
  
  // Declarative clipboard utility
  clipboard: {
    write: async (text) => {
      try {
        await navigator.clipboard.writeText(text)
        return true
      } catch (error) {
        console.warn('Clipboard write failed:', error)
        return false
      }
    }
  },
  
  register(action) {
    // Validate action structure
    if (!action.key || !action.name || !action.execute) {
      console.warn('Invalid action structure:', action)
      return
    }
    
    // Register action
    this.actions.set(action.key, {
      ...action,
      category: action.category || 'General',
      aliases: action.aliases || []
    })
    
    // Track category
    this.categories.add(action.category || 'General')
    
    // Register aliases declaratively
    if (action.aliases && Array.isArray(action.aliases)) {
      action.aliases.forEach(alias => {
        this.aliases.set(alias, action.key)
      })
    }
  },
  
  // Functional getters
  getAll: () => Array.from(window.pickrActionManager.actions.values()),
  getByCategory: (category) => Array.from(window.pickrActionManager.actions.values()).filter(a => a.category === category),
  getByKey: (key) => window.pickrActionManager.actions.get(key),
  getByAlias: (alias) => {
    const actualKey = window.pickrActionManager.aliases.get(alias)
    return actualKey ? window.pickrActionManager.actions.get(actualKey) : null
  },
  
  // Functional execution with error handling
  executeByKey: async (key, element) => {
    const action = window.pickrActionManager.getByKey(key) || window.pickrActionManager.getByAlias(key)
    if (!action) return null
    
    try {
      const result = action.execute(element)
      
      // Handle clipboard operations declaratively
      if (result && result.result && !result.error) {
        const success = await window.pickrActionManager.clipboard.write(result.result)
        if (!success) {
          return { 
            feedback: 'Clipboard operation failed', 
            result: null, 
            error: true 
          }
        }
      }
      
      return result
    } catch (error) {
      return { 
        feedback: `Error executing ${action.name}: ${error.message}`, 
        result: null, 
        error: true 
      }
    }
  },
  
  // Declarative help content generation
  getHelpContent: () => {
    const grouped = window.pickrActionManager.getAll().reduce((acc, action) => {
      if (!acc[action.category]) acc[action.category] = []
      acc[action.category].push(action)
      return acc
    }, {})
    
    return Object.entries(grouped).map(([category, actions]) => `
      <div style="margin-bottom: 16px;">
        <h4 style="margin: 0 0 8px 0; color: #374151; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px;">
          ${category}
        </h4>
        ${actions.map(action => `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="color: #6b7280; font-size: 13px;">${action.description}</span>
            <kbd style="background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 3px; padding: 2px 6px; font-size: 11px; font-family: monospace;">
              ${action.key}${action.aliases.length ? ` (${action.aliases.join(', ')})` : ''}
            </kbd>
          </div>
        `).join('')}
      </div>
    `).join('')
  },
  
  // Declarative legend content generation
  getLegendContent: () => {
    const grouped = window.pickrActionManager.getAll().reduce((acc, action) => {
      if (!acc[action.category]) acc[action.category] = []
      acc[action.category].push(action)
      return acc
    }, {})
    
    return Object.entries(grouped).map(([category, actions]) => `
      <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 12px;">
        <div style="font-weight: 600; font-size: 12px; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
          ${category} ACTIONS
        </div>
        ${actions.map(action => `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 13px;">
            <span style="color: rgba(255,255,255,0.9);">${action.description}</span>
            <kbd style="background: rgba(255,255,255,0.25); color: white; border-radius: 4px; padding: 3px 8px; font-size: 12px; font-weight: 600; font-family: 'SF Mono', Monaco, monospace; min-width: 20px; text-align: center; border: 1px solid rgba(255,255,255,0.3);">
              ${action.key.toUpperCase()}${action.aliases.length ? ` (${action.aliases.join(', ')})` : ''}
            </kbd>
          </div>
        `).join('')}
      </div>
    `).join('')
  },
  
  // Functional utility methods
  getAvailableKeys: () => {
    const usedKeys = Array.from(window.pickrActionManager.actions.keys())
    const allKeys = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('')
    return allKeys.filter(key => !usedKeys.includes(key))
  },
  
  getCategories: () => Array.from(window.pickrActionManager.categories),
  
  // Declarative action lookup
  resolveAction: (input) => {
    return window.pickrActionManager.actions.get(input) || 
           window.pickrActionManager.actions.get(window.pickrActionManager.aliases.get(input))
  }
}
} 