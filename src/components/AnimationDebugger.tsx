import React from 'react';

export const AnimationDebugger: React.FC = () => {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div style={{ position: 'fixed', bottom: 10, right: 10, zIndex: 9999 }}>
      <div>Animation Debug Info</div>
    </div>
  );
};
