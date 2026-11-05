import { Routes, Route, Navigate } from 'react-router-dom';

import PublicLayout from '../layout/PublicLayout';

import Home from "../pages/home/Home";
import AllAppartements from "../pages/allAppartements/AllAppartements";
import DetailsAppartement from "../pages/detailsAppartement/DetailsAppartement";
import AppView from "../dashboards/admin/components/appView/appView";

import AdminLayout from '../dashboards/admin/layout/AdminLayout';
import DashboardAdmin from '../dashboards/admin/components/dashboardAdmin/DashboardAdmin';
import AppartementsAdmin from '../dashboards/admin/components/appartementsAdmin/AppartementsAdmin';
import AdminReservations from "../dashboards/admin/pages/adminReservations/AdminReservations"
import Clients from "../dashboards/admin/pages/clients/Clients"
import Parametres from "../dashboards/admin/pages/parametres/Parametres";

import ClientLayout from "../dashboards/client/layout/ClientLayout";
import ReservationsPage from "../dashboards/client/pages/reservationsPage/ReservationsPage";
import ExploreDep from "../dashboards/client/pages/exploreDepartementsPage/ExploreDep";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/logements" element={<AllAppartements />} />
        <Route path="/appartement/:id" element={<DetailsAppartement />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardAdmin />} />
        <Route path="appartements" element={<AppartementsAdmin />} />
        <Route path="appartement/:id" element={<AppView/>} />
        <Route path="reservations" element={<AdminReservations/>}    />
        <Route path="clients" element={<Clients/>}    />
        <Route path="parametres" element={<Parametres />} />
      </Route>

      <Route path="/client" element={<ClientLayout />}>
        <Route index element={<Navigate to="reservations" replace />} />
        <Route path="reservations" element={<ReservationsPage />} />
        <Route path="explorer" element={<ExploreDep />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;