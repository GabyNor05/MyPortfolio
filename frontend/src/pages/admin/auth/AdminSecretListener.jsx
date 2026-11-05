import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function AdminSecretListener() {
  const navigate = useNavigate();
  
  // Use a ref to keep track of typed characters without forcing re-renders
  const typedBufferRef = useRef("");
  const targetWord = "admin";
  
  // Maximum time allowed between keystrokes in milliseconds (e.g., 1.5 seconds)
  // This resets the buffer if they stop typing, so random typing won't accidentally trigger it.
  const resetTimerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ignore modifier keys like Ctrl, Alt, Cmd, Shift, or Enter
      if (event.key.length > 1) return;
      // Never trigger while typing in the contact form or any field
      const tag = event.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      // Clear the reset timer since the user is actively typing
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

      // Append the lowercase version of the key to our sequence buffer
      typedBufferRef.current += event.key.toLowerCase();

      // Keep the buffer length optimized to only match our target word size
      if (typedBufferRef.current.length > targetWord.length) {
        typedBufferRef.current = typedBufferRef.current.slice(-targetWord.length);
      }

      // Check if the sequence matches "admin"
      if (typedBufferRef.current === targetWord) {
        typedBufferRef.current = ""; // Clear buffer
        navigate("/auth"); // Secretly route them to your authentication page
      }

      // Automatically clear the buffer if they pause typing for 1.5 seconds
      resetTimerRef.current = setTimeout(() => {
        typedBufferRef.current = "";
      }, 1500);
    };

    // Attach listener globally to the window object
    window.addEventListener("keydown", handleKeyDown);

    // CRITICAL: Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, [navigate]);

  return null; // This component doesn't render anything visually
}

export default AdminSecretListener;