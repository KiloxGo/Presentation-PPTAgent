import React from 'react';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="widget">组件1</div>
      <div className="widget">组件2</div>
      <div className="widget">组件3</div>
    </div>
  );
};

export default Sidebar;
