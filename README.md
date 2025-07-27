<div align="center">
  <h1>
    <img valign="middle" src="res/xpick-256.png" alt="pickr" height="96" />
    ꛠickr
  </h1>
  <h2>Pick elements like a pro</h2>
  <strong>A modern Chrome extension for interactive element selection and DOM inspection</strong>
  <br>
  <strong>with overlay-based interface and comprehensive action hints</strong>
</div>

---

`pickr` is a powerful Chrome extension that transforms how you interact with web page elements.
Built with modern functional programming principles,
it provides intuitive visual element selection through multiple modes - from hover-based mouse selection to precise CSS selector input. 
With overlay-based interface, comprehensive legend hints, and real-time sidebar previews, pickr makes DOM inspection and element selection effortless and precise.

## Features

### 🎯 **Selection Modes**

#### 1. **Live Interactive Mouse Selector** (`Alt+M`)
- **Trigger**: Press `Alt+M` to activate
- **Behavior**: 
  - Opens overlay interface with legend hints
  - Highlights elements under mouse cursor with enhanced visual feedback
  - Real-time element detection and highlighting
  - Comprehensive sidebar with element statistics and previews
- **Interface**:
  - Legend overlay showing all available actions and shortcuts
  - Enhanced sidebar with detailed element information
  - Visual element highlighting with improved styling

#### 2. **Live Interactive Input Selector** (`Alt+I`)
- **Trigger**: Press `Alt+I` to activate
- **Behavior**:
  - Opens overlay interface with legend hints
  - Displays enhanced input overlay for CSS selector input
  - Real-time CSS selector validation with debounced querySelectorAll
  - Highlights matching elements with improved visual feedback
- **Interface**:
  - Legend overlay showing all available actions and shortcuts
  - Enhanced input overlay with better styling and examples
  - Comprehensive sidebar with detailed results and samples

### 🎨 **Overlay Interface**
- **Legend Overlay**: Comprehensive action hints with categorized shortcuts
- **Enhanced Sidebar**: Detailed element previews with improved styling
- **Input Overlay**: Modern CSS selector input with examples and validation
- **Visual Feedback**: Improved highlighting with better contrast and effects
- **Settings Popup**: Extension configuration with toggle controls

### 🔧 **Element Actions**
- **Modular Plugin System**: Extensible action framework with clear contracts
- **Directory-based Architecture**: Each action in its own file for easy maintenance
- **Keyboard Shortcuts**: Quick access to element operations
- **Copy Operations**: Text, HTML, CSS selectors, attributes, and URLs
- **Inspect Operations**: Element details and properties
- **Modify Operations**: Visual highlighting and element manipulation
- **Real-time Feedback**: Instant visual and textual feedback
- **Action Categories**: Organized by functionality (copy, inspect, modify, navigate)
- **Legend Integration**: All actions displayed in overlay with key bindings

### 📊 **Enhanced Sidebar Features**
- **Element Statistics**: Comprehensive element properties and attributes
- **Live Previews**: Enhanced content previews with better formatting
- **Selector Validation**: Real-time CSS selector testing with error handling
- **Element Hierarchy**: Parent-child relationships and DOM structure
- **Action Results**: Detailed operation feedback with formatted output
- **Visual Design**: Modern styling with improved readability and organization

### ⚙️ **Settings & Configuration**
- **Settings Popup**: Extension configuration interface
- **Toggle Controls**: Enable/disable features like auto-sidebar, help overlay, highlighting
- **Keyboard Shortcuts**: Display of available shortcuts
- **Action Settings**: Configure copy behavior and notifications
- **Persistent Storage**: Settings saved across browser sessions

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension directory
5. The extension icon will appear in your toolbar

## Usage

### Keyboard Shortcuts
- `Alt+M`: Activate mouse selector mode
- `Alt+I`: Activate input selector mode

### Element Action Shortcuts
- `y`: Copy element text content
- `h`: Copy element HTML
- `s`: Copy CSS selector for element
- `a`: Copy element attributes as JSON
- `u`: Copy element URL (href/src)
- `i`: Inspect element details
- `l`: Highlight element permanently

### Interface Controls
- **Compact Help**: Always visible in top-left corner with essential shortcuts
- **Full Help**: Press `?` to open comprehensive help overlay
- **Sidebar Toggle**: Press `S` to toggle sidebar
- **Legend Toggle**: Press `H` to show/hide the compact help
- **Input Toggle**: Press `I` to show/hide input overlay (Input Mode only)
- **Pause/Resume**: Press `P` to pause/resume selection
- **Exit Mode**: Press `ESC` to exit current mode

### Toast Notifications
- **Action Feedback**: Toast notifications appear for all actions
- **Interface Feedback**: Toasts confirm interface state changes
- **Auto-dismiss**: Toasts automatically disappear after 3 seconds
- **Color-coded**: Success (green), Error (red), Warning (yellow), Info (blue)

### Keyboard Shortcuts
- `Alt+M`: Activate mouse selector mode
- `Alt+I`: Activate input selector mode

### Element Action Shortcuts
- `y`: Copy element text content
- `h`: Copy element HTML
- `s`: Copy CSS selector for element
- `a`: Copy element attributes as JSON
- `u`: Copy element URL (href/src)
- `i`: Inspect element details
- `l`: Highlight element permanently

### Interface Shortcuts
- `S`: Toggle sidebar visibility
- `H`: Toggle compact help visibility
- `?`: Toggle full help overlay
- `I`: Toggle input overlay (Input Mode only)
- `P`: Pause/resume selection mode
- `ESC`: Exit current mode

### Selection Workflow
1. **Choose Mode**: Use appropriate keyboard shortcut (`Alt+M` or `Alt+I`)
2. **View Legend**: Check the overlay for available actions and shortcuts
3. **Select Elements**: 
   - Mouse mode: Hover over elements to highlight
   - Input mode: Type CSS selectors in the overlay
4. **View Results**: Check sidebar for comprehensive statistics and samples
5. **Extract Data**: Use action shortcuts to copy or inspect selected content
6. **Configure**: Click extension icon to access settings

## Technical Architecture

### Core Components
- **Service Worker** (`sw.js`): Functional command handling and script injection
- **Element Selector** (`element-selector.js`): Overlay-based interface with enhanced UI
- **Action System** (`actions/`): Modular plugin system with individual action files
- **Settings Popup** (`popup.html/js`): Configuration interface with toggle controls
- **Enhanced Sidebar**: Comprehensive preview and action results display
- **Legend Overlay**: Dynamic action hints and keyboard shortcuts

### Modern Patterns
- **Functional Programming**: Pure functions, composition, and immutability
- **Proxy-based State**: Reactive state management with listeners
- **Overlay Architecture**: Non-intrusive UI elements with backdrop blur
- **Modular Actions**: Plugin-based action system with clear contracts
- **Settings Persistence**: Chrome storage integration for configuration 

### License

[MIT](LICENSE)
