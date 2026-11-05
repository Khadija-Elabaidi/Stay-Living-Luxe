import { Outlet } from 'react-router-dom'; 


import SidebarDash from '../components/sidebarDash/SidebarDash';
import TopbarDash from '../components/topbarDash/TopbarDash';

import './ClientLayout.css';

const ClientLayout = () => {
  return (
    <div className="client-dashboard-layout">
      <SidebarDash />

      <div className="main-content-wrapper">
        
        <TopbarDash />

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;