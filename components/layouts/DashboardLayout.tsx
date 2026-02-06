
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Header from '../Header';

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-neutral-light font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main
          className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-light"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M0 10h20M10 0v20' stroke='%23dfe1e6' stroke-width='0.5'/%3E%3C/svg%3E")`,
          }}
        >
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
