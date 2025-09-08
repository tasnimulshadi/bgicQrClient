import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./context/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import OMPList from "./pages/OMP/OMPList";
import OMPForm from "./pages/OMP/OMPForm";
import OMP from "./pages/OMP/OMP";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";
import MRList from "./pages/MR/MRList";
import MRForm from "./pages/MR/MRForm";
import MR from "./pages/MR/MR";
import FieldSettings from "./pages/Fields/FieldSettings";
import FieldSettingList from "./pages/Fields/FieldSettingList";
import ClientField from "./pages/Fields/ClientField";

function App() {
  return (
    <div className="bg-texture bg-gray-50 bg-cover min-h-screen">
      {" "}
      {/*bg-texture  bg-gray-50 */}
      <ToastContainer theme="colored" />
      <Router>
        <Navbar />

        <div className="mx-auto max-w-6xl p-2 sm:p-6 min-h-screen ">
          {" "}
          {/*  bg-gray-50 */}
          <Routes>
            <Route path="/bgichologin" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute allowedRoles={["admin", "all", "omp", "mr"]}>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* OMP */}
            <Route
              path="/omp"
              element={
                <PrivateRoute allowedRoles={["admin", "all", "omp"]}>
                  <OMPList />
                </PrivateRoute>
              }
            />
            {/* MR */}
            <Route
              path="/mr"
              element={
                <PrivateRoute allowedRoles={["admin", "all", "mr"]}>
                  <MRList />
                </PrivateRoute>
              }
            />

            {/* OMP */}
            <Route
              path="/omp/new"
              element={
                <PrivateRoute allowedRoles={["admin", "all", "omp"]}>
                  <OMPForm />
                </PrivateRoute>
              }
            />
            {/* MR */}
            <Route
              path="/mr/new"
              element={
                <PrivateRoute allowedRoles={["admin", "all", "mr"]}>
                  <MRForm />
                </PrivateRoute>
              }
            />

            {/* OMP */}
            <Route
              path="/omp/edit/:id"
              element={
                <PrivateRoute allowedRoles={["admin", "all", "omp"]}>
                  <OMPForm />
                </PrivateRoute>
              }
            />
            {/* MR */}
            <Route
              path="/mr/edit/:id"
              element={
                <PrivateRoute allowedRoles={["admin", "all", "mr"]}>
                  <MRForm />
                </PrivateRoute>
              }
            />

            {/* Others */}
            <Route
              path="/field-settings"
              element={
                <PrivateRoute allowedRoles={["admin", "all", "omp", "mr"]}>
                  <FieldSettings />
                </PrivateRoute>
              }
            />
            <Route
              path="/field-settings/:field"
              element={
                <PrivateRoute allowedRoles={["admin", "all", "omp", "mr"]}>
                  <FieldSettingList />
                </PrivateRoute>
              }
            />
            <Route
              path="/field-settings/client"
              element={
                <PrivateRoute allowedRoles={["admin", "all", "omp", "mr"]}>
                  <ClientField />
                </PrivateRoute>
              }
            />

            {/* this one stays public */}
            {/* OMP */}
            <Route path="/omp/:id" element={<OMP />} />
            {/* MR */}
            <Route path="/mr/:id" element={<MR />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
