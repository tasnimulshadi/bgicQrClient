import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./context/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
// import NotFound from "./pages/NotFound";
import OMPList from "./pages/OMP/OMPList";
// import OMPForm from "./pages/OMP/OMPForm";
import OMPForm2 from "./pages/OMP/OMPForm2";
import OMP from "./pages/OMP/OMP";
import OMPPdf from "./pages/OMP/OMPPdf";

function App() {
  return (
    <div className="bg-gray-50">
      <Router>
        <Navbar />

        <div className="mx-auto max-w-6xl p-4 min-h-screen">
          <Routes>
            <Route path="/" element={<Login />} />
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
                  {/* <OMPForm /> */}
                  <OMPForm2 />
                </PrivateRoute>
              }
            />
            {/* OMP */}
            <Route
              path="/omp/edit/:id"
              element={
                <PrivateRoute>
                  {/* <OMPForm /> */}
                  <OMPForm2 />
                </PrivateRoute>
              }
            />

            {/* this one stays public */}
            {/* OMP */}
            <Route path="/omp/:id" element={<OMP />} />
            {/* <Route path="*" element={<NotFound />} /> */}
            <Route path="*" element={<OMPPdf />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
