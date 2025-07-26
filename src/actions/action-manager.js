// Global action manager for pickr
if (window.pickrActionManager) {
  // Already initialized, exit early
  console.log('pickr action manager already initialized')
} else {
window.pickrActionManager = {
  actions: [],
  registeredKeys: new Set(),
  
  register(action) {
    // Prevent duplicate registrations
    if (this.registeredKeys.has(action.key)) {
      return // Already registered
    }
    
    this.actions.push(action)
    this.registeredKeys.add(action.key)
  },
  
  getAll() { return this.actions },
  getByCategory(category) { return this.actions.filter(a => a.category === category) },
  getByKey(key) { return this.actions.find(a => a.key === key) },
  
  executeByKey(key, element) {
    const action = this.getByKey(key)
    if (action) {
      try {
        return action.execute(element)
      } catch (error) {
        return { feedback: `Error executing ${action.name}: ${error.message}`, result: null, error: true }
      }
    }
    return null
  },
  
  getHelpContent() {
    const grouped = this.actions.reduce((acc, action) => {
      if (!acc[action.category]) acc[action.category] = []
      acc[action.category].push(action)
      return acc
    }, {})
    return Object.entries(grouped).map(([category, categoryActions]) => `
      <div style="margin-bottom: 16px;">
        <h4 style="margin: 0 0 8px 0; color: #374151; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px;">
          ${category}
        </h4>
        ${categoryActions.map(action => `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="color: #6b7280; font-size: 13px;">${action.description}</span>
            <kbd style="background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 3px; padding: 2px 6px; font-size: 11px; font-family: monospace;">
              ${action.key}
            </kbd>
          </div>
        `).join('')}
      </div>
    `).join('')
  },
  
  getLegendContent() {
    const grouped = this.actions.reduce((acc, action) => {
      if (!acc[action.category]) acc[action.category] = []
      acc[action.category].push(action)
      return acc
    }, {})
    
    return Object.entries(grouped).map(([category, categoryActions]) => `
      <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 12px;">
        <div style="font-weight: 600; font-size: 12px; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
          ${category} ACTIONS
        </div>
        ${categoryActions.map(action => `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 13px;">
            <span style="color: rgba(255,255,255,0.9);">${action.description}</span>
            <kbd style="background: rgba(255,255,255,0.25); color: white; border-radius: 4px; padding: 3px 8px; font-size: 12px; font-weight: 600; font-family: 'SF Mono', Monaco, monospace; min-width: 20px; text-align: center; border: 1px solid rgba(255,255,255,0.3);">
              ${action.key.toUpperCase()}
            </kbd>
          </div>
        `).join('')}
      </div>
    `).join('')
  },
  
  getAvailableKeys() {
    const usedKeys = this.actions.map(a => a.key)
    const allKeys = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('')
    return allKeys.filter(key => !usedKeys.includes(key))
  }
}
} 