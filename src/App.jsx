import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./context/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import DataEdit from "./pages/DataEdit";
import DataForm from "./pages/DataForm";
import DataList from "./pages/DataList";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import SingleData from "./pages/SingleData";

function App() {
  return (
    <>
      <Router>
        <Navbar />

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
          <Route
            path="/data/new"
            element={
              <PrivateRoute>
                <DataForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/data"
            element={
              <PrivateRoute>
                <DataList />
              </PrivateRoute>
            }
          />
          <Route
            path="/data/edit/:id"
            element={
              <PrivateRoute>
                <DataEdit />
              </PrivateRoute>
            }
          />
          {/* this one stays public */}
          <Route path="/data/:id" element={<SingleData />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
