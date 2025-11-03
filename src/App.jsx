//router
// import IndexRouters from "./router/index"

//scss
import "./assets/scss/bisec-ui.scss"
import "./assets/scss/custom.scss"
import "./assets/scss/dark.scss"
import "./assets/scss/rtl.scss"
import "./assets/scss/customizer.scss"

import { useEffect } from "react"
// Redux Selector / Action
import { useDispatch } from 'react-redux';

// import state selectors
import { setSetting } from './store/setting/actions'

function App({ children }) {
  const dispatch = useDispatch();
  dispatch(setSetting());

  useEffect(() => {
    // Handle keyboard keys
    const handleKeyDown = (e) => {
      const { key, ctrlKey, altKey, shiftKey, metaKey } = e;
      const isFunctionKey = /^F[1-9]$|^F1[0-1]$/.test(key);

      if (ctrlKey || altKey || shiftKey || metaKey || isFunctionKey) {
        if (isFunctionKey) {
          e.preventDefault();
          // console.log(`Blocked: ${ctrlKey ? 'Ctrl+' : ''}${altKey ? 'Alt+' : ''}${shiftKey ? 'Shift+' : ''}${metaKey ? 'Meta+' : ''}${key}`);
        }

        if (key === 'Control') {
          e.preventDefault();
          // console.log('Blocked: Control key');
        }
      }
    };

    // Handle mouse buttons
    const handleMouseDown = (e) => {
      // 2 = right click, 1 = middle click
      if (e.button === 2) {
        e.preventDefault();
        // console.log('Blocked: Right-click');
      } else if (e.button === 1) {
        e.preventDefault();
        // console.log('Blocked: Middle-click');
      }
    };

    // Disable context menu to fully block right-click menu
    const handleContextMenu = (e) => {
      e.preventDefault();
      // console.log('Blocked: Context menu');
    };

    // Disable text selection
    const handleSelectStart = (e) => {
      e.preventDefault();
      // console.log('Blocked: Text selection');
    };

    // Disable Double Click
    const handleDoubleClick = (e) => {
      e.preventDefault();
      // console.log('Blocked: Double-click');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('selectstart', handleSelectStart);
    window.addEventListener('dblclick', handleDoubleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('selectstart', handleSelectStart);
      window.removeEventListener('dblclick', handleDoubleClick);
    };
  }, []);

  return (
    <div className="App">
      {/* <IndexRouters /> */}
      {children}

    </div>
  );
}

export default App;
