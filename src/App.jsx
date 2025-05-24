import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./context/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import MoneyReciptList from "./pages/MoneyRecipt/MoneyReciptList";
import MoneyReciptForm from "./pages/MoneyRecipt/MoneyReciptForm";
import MoneyReciptView from "./pages/MoneyRecipt/MoneyReciptView";

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

          {/* Money Receipt */}
          <Route
            path="/money-receipt"
            element={
              <PrivateRoute>
                <MoneyReciptList />
              </PrivateRoute>
            }
          />
          <Route
            path="/money-receipt/new"
            element={
              <PrivateRoute>
                <MoneyReciptForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/money-receipt/edit/:id"
            element={
              <PrivateRoute>
                <MoneyReciptForm />
              </PrivateRoute>
            }
          />

          {/* this one stays public */}
          <Route path="/money-receipt/:id" element={<MoneyReciptView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
