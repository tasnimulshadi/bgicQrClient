import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./context/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";
import ClaimList from "./pages/Claim/ClaimList";
import ClaimForm from "./pages/Claim/ClaimForm";
import Claim from "./pages/Claim/Claim";
import Fields from "./pages/Fields/Fields";
import FieldList from "./pages/Fields/FieldList";
import config from "./utility/config";

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
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute allowedRoles={config.roles.level_4}>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/claim"
              element={
                <PrivateRoute allowedRoles={config.roles.level_4}>
                  <ClaimList />
                </PrivateRoute>
              }
            />

            <Route
              path="/claim/:id"
              element={
                <PrivateRoute allowedRoles={config.roles.level_4}>
                  <Claim />
                </PrivateRoute>
              }
            />

            <Route
              path="/claim/new"
              element={
                <PrivateRoute allowedRoles={config.roles.level_3}>
                  <ClaimForm />
                </PrivateRoute>
              }
            />

            <Route
              path="/claim/edit/:id"
              element={
                <PrivateRoute allowedRoles={config.roles.level_3}>
                  <ClaimForm />
                </PrivateRoute>
              }
            />

            {/* Fields */}
            <Route
              path="/fields"
              element={
                <PrivateRoute allowedRoles={config.roles.level_3}>
                  <Fields />
                </PrivateRoute>
              }
            />
            <Route
              path="/fields/list"
              element={
                <PrivateRoute allowedRoles={config.roles.level_3}>
                  <FieldList />
                </PrivateRoute>
              }
            />

            {/* this one stays public */}
            {/* <Route path="/mr/:id" element={<MR />} /> */}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
