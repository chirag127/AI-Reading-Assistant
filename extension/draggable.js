// Make an element draggable
function makeDraggable(element) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  
  // Add a draggable handle if it's the toolbar
  if (element.classList.contains('ai-reading-assistant-toolbar')) {
    // Use the entire toolbar as the drag handle
    element.onmousedown = dragMouseDown;
  } else if (element.classList.contains('ai-reading-assistant-popup')) {
    // Use the header as the drag handle for popups
    const header = element.querySelector('.popup-header');
    if (header) {
      header.style.cursor = 'move';
      header.onmousedown = dragMouseDown;
    }
  } else if (element.classList.contains('ai-reading-assistant-explanation')) {
    // Use the entire explanation popup as the drag handle
    element.onmousedown = dragMouseDown;
  }
  
  function dragMouseDown(e) {
    e = e || window.event;
    // Skip if clicking on a button
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    e.preventDefault();
    // Get the mouse cursor position at startup
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // Call a function whenever the cursor moves
    document.onmousemove = elementDrag;
  }
  
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // Calculate the new cursor position
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // Set the element's new position
    element.style.top = (element.offsetTop - pos2) + 'px';
    element.style.left = (element.offsetLeft - pos1) + 'px';
  }
  
  function closeDragElement() {
    // Stop moving when mouse button is released
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
