// import React, { useState } from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from "../components/common/Sidebar";
// import Navbar from "../components/common/Navbar";

// const AdminLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Desktop Sidebar */}
//       <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72">
//         <Sidebar />
//       </div>

//       {/* Mobile Sidebar */}
//       <div className="lg:hidden">
//         <Sidebar
//           isMobileOpen={sidebarOpen}
//           onClose={() => setSidebarOpen(false)}
//         />
//       </div>

//       {/* Main content */}
//       <div className="lg:pl-72">
//         <Navbar onMenuClick={() => setSidebarOpen(true)} />
//         <main className="p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;


import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sidebar
          isMobileOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;