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

function App() {
  return (
    <div className="bg-texture bg-gray-50 bg-cover min-h-screen">
      {" "}
      {/*bg-texture  bg-gray-50 */}
      <ToastContainer theme="colored" />
      <Router>
        <Navbar />

        <div className="mx-auto max-w-6xl p-4 min-h-screen ">
          {" "}
          {/*  bg-gray-50 */}
          <Routes>
            <Route path="/bgichologin" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* OMP */}
            <Route
              path="/omp"
              element={
                <PrivateRoute>
                  <OMPList />
                </PrivateRoute>
              }
            />
            {/* MR */}
            <Route
              path="/mr"
              element={
                <PrivateRoute>
                  <MRList />
                </PrivateRoute>
              }
            />

            {/* OMP */}
            <Route
              path="/omp/new"
              element={
                <PrivateRoute>
                  <OMPForm />
                </PrivateRoute>
              }
            />
            {/* MR */}
            <Route
              path="/mr/new"
              element={
                <PrivateRoute>
                  <MRForm />
                </PrivateRoute>
              }
            />

            {/* OMP */}
            <Route
              path="/omp/edit/:id"
              element={
                <PrivateRoute>
                  {/* <OMPForm /> */}
                  <OMPForm />
                </PrivateRoute>
              }
            />

            {/* this one stays public */}
            {/* OMP */}
            <Route path="/omp/:id" element={<OMP />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
