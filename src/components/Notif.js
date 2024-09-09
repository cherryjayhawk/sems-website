import React, { useState, useEffect } from 'react';

function Notif({ show, message, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Close the alert after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    show && (
      <div className="">
        {message}
        <button onClick={onClose}>Close</button>
      </div>
    )
  );
}

export default Notif;
