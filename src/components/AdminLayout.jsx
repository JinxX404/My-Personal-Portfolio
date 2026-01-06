import React, { useState } from 'react';
import Sidebar from 'pages/admin-dashboard/components/Sidebar';
import Icon from 'components/AppIcon';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Mobile Header Toggle */}
        <div className="lg:hidden bg-white shadow-sm border-b border-primary-100 p-4 sticky top-0 z-30">
            <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors duration-200"
            >
            <Icon name="Menu" size={24} strokeWidth={2} />
            </button>
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
