import React, { useEffect, useRef, useState } from "react";

function Window({ id, children, onClose, initialX = 200, initialY = 200, bringToFront }) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ width: 400, height: 300 });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [prevPosition, setPrevPosition] = useState(null);
  const [prevSize, setPrevSize] = useState(null);
  const randomHue = useRef(Math.floor(Math.random() * 360));
  const borderColor = `hsl(${randomHue.current}, 100%, 70%)`;
  const glowColor = `hsl(${randomHue.current}, 100%, 60%)`;
  const [zIndex, setZIndex] = useState(1);

  const offset = useRef({ x: 0, y: 0 });
  const windowRef = useRef();

  const handleClose = () => {
    if (onClose) onClose(id);
  };

  const handleMouseDown = (e) => {
    // prevent dragging from resizer
    if (e.target.classList.contains("resizer")) return;

    setDragging(true);

    const rect = windowRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    const newZ = bringToFront?.();
    if (newZ !== undefined) setZIndex(newZ);
  };

  const handleResizeMouseDown = (e) => {
    e.stopPropagation(); // prevent triggering drag
    setResizing(true);
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    } else if (resizing) {
      const rect = windowRef.current.getBoundingClientRect();
      const newWidth = e.clientX - rect.left;
      const newHeight = e.clientY - rect.top;

      setSize({
        width: Math.max(newWidth, 200),
        height: Math.max(newHeight, 150),
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
  };

  const handleMaximizeToggle = () => {
    if (!isMaximized) {
      setPrevPosition(position);
      setPrevSize(size);
      setIsMaximized(true);
    } else {
      if (prevPosition && prevSize) {
        setPosition(prevPosition);
        setSize(prevSize);
      }
      setIsMaximized(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, resizing]);

  return (
    <div
      ref={windowRef}
      className="window"
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        top: isMaximized ? 0 : position.y,
        left: isMaximized ? 0 : position.x,
        width: isMaximized ? "100vw" : size.width,
        height: isMaximized ? "100vh" : size.height,
        cursor: dragging ? "grabbing" : "grab",
        zIndex: isMaximized ? 999 : zIndex,
        transition: "all 0.3s ease",
        pointerEvents: isMaximized ? "auto" : "auto",
        border: `2px solid ${borderColor}`,
        boxShadow: `0 0 20px ${glowColor}, 0 0 40px ${glowColor}`,
        background: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(12px)",
        borderRadius: "16px",
        zIndex,
      }}
    >
      <div className="window-controls">
        <div className="control-btn red" onClick={handleClose}></div>
        <div className="control-btn yellow" onClick={() => console.log("Minimize action")}></div>
        <div className="control-btn green" onClick={handleMaximizeToggle}></div>
      </div>

      <div className="window-content" style={{ maxHeight: isMaximized ? "calc(100vh - 80px)" : size.height - 80, overflowY: "auto" }}>
        {children}
      </div>

      <div
        className="resizer"
        onMouseDown={handleResizeMouseDown}
        style={{
          position: "absolute",
          width: "16px",
          height: "16px",
          right: 0,
          bottom: 0,
          cursor: "nwse-resize",
          background: "transparent",
        }}
      />
    </div>
  );
}

export default Window;
