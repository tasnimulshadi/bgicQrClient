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

function App() {
  return (
    <div className="bg-gray-50">
      <ToastContainer theme="colored" />
      <Router>
        <Navbar />

        <div className="mx-auto max-w-6xl p-4 min-h-screen">
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
            {/* OMP */}
            <Route
              path="/omp/new"
              element={
                <PrivateRoute>
                  <OMPForm />
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
