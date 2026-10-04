import { Outlet } from "react-router-dom";

import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <AppHeader />

      <main className="flex-1">
        <Outlet />
      </main>

      <AppFooter />
    </div>
  );
}

export default AppLayout;