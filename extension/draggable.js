// Make an element draggable
function makeDraggable(element) {
    let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    let isDragging = false;
    let dragStartTime = 0;

    // Add a draggable handle if it's the toolbar
    if (element.classList.contains("ai-reading-assistant-toolbar")) {
        // For the toolbar, we'll handle mousedown events differently based on collapsed state
        element.addEventListener("mousedown", function (e) {
            // Only allow dragging when the toolbar is collapsed
            if (!element.classList.contains("collapsed")) {
                return;
            }

            // If clicking on the toggle button, we'll wait to see if it's a drag or a click
            if (e.target.id === "ai-toggle" || e.target.closest("#ai-toggle")) {
                // Record the start time and position
                dragStartTime = Date.now();
                pos3 = e.clientX;
                pos4 = e.clientY;

                // Set up the move and up handlers
                document.addEventListener("mousemove", handleDragMove);
                document.addEventListener("mouseup", handleToggleClick);

                // Prevent default to avoid text selection
                e.preventDefault();
                return;
            }

            // For any other part of the collapsed toolbar, start dragging immediately
            startDrag(e);
        });
    } else if (element.classList.contains("ai-reading-assistant-popup")) {
        // Use the header as the drag handle for popups
        const header = element.querySelector(".popup-header");
        if (header) {
            header.style.cursor = "move";
            header.addEventListener("mousedown", startDrag);
        }
    } else if (element.classList.contains("ai-reading-assistant-explanation")) {
        // Use the entire explanation popup as the drag handle
        element.addEventListener("mousedown", function (e) {
            // Skip if clicking on a button
            if (e.target.tagName === "BUTTON" || e.target.closest("button")) {
                return;
            }
            startDrag(e);
        });
    }

    // Function to handle the toggle button click vs. drag decision
    function handleToggleClick(e) {
        document.removeEventListener("mousemove", handleDragMove);
        document.removeEventListener("mouseup", handleToggleClick);

        // If it was a short interaction and the mouse didn't move much, treat it as a click
        const timeDiff = Date.now() - dragStartTime;
        const distanceX = Math.abs(e.clientX - pos3);
        const distanceY = Math.abs(e.clientY - pos4);

        if (timeDiff < 200 && distanceX < 5 && distanceY < 5) {
            // It was a click - trigger the toggle button click event
            const toggleBtn = document.getElementById("ai-toggle");
            if (toggleBtn) {
                toggleBtn.click();
            }
        }

        // Reset dragging state
        isDragging = false;
    }

    // Function to handle drag movement for the toggle button
    function handleDragMove(e) {
        // If we've moved enough, consider it a drag and start moving the toolbar
        const distanceX = Math.abs(e.clientX - pos3);
        const distanceY = Math.abs(e.clientY - pos4);

        if (!isDragging && (distanceX > 5 || distanceY > 5)) {
            isDragging = true;
            // Start the actual dragging
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // Move the element
            element.style.top = element.offsetTop - pos2 + "px";
            element.style.left = element.offsetLeft - pos1 + "px";
        } else if (isDragging) {
            // Continue dragging
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // Move the element
            element.style.top = element.offsetTop - pos2 + "px";
            element.style.left = element.offsetLeft - pos1 + "px";
        }
    }

    // Function to start dragging for non-toggle elements
    function startDrag(e) {
        // Skip if clicking on a button (except in collapsed toolbar)
        if (
            !element.classList.contains("collapsed") &&
            (e.target.tagName === "BUTTON" || e.target.closest("button"))
        ) {
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
        element.style.top = element.offsetTop - pos2 + "px";
        element.style.left = element.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
        // Stop moving when mouse button is released
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
