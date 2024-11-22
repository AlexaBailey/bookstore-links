import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Layout/Sidebar";
import Navbar from "./components/Layout/Navbar";
import HistoryPage from "./pages/History";
import EmployeesPage from "./pages/Employees";
import RegistrationPage from "./pages/Registration";
import LoginPage from "./pages/Login";
import BooksGrid from "./components/Books/BookGrid";
import VisitorsPage from "./pages/Visitors";
import { setAuthState } from "./store/slices/auth";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserFromToken } from "./helpers/auth";
import React from "react";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
const PrivateRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    if (user !== null || localStorage.getItem("authToken") === null) {
      setAuthInitialized(true);
    }
  }, [user]);

  if (!authInitialized) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        const user = getUserFromToken(authToken);
        if (user) {
          dispatch(
            setAuthState({
              token: authToken,
              user: user,
            })
          );
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-full bg-indigo-50">
      <ToastContainer />
      <Sidebar open={open} setOpen={setOpen} />
      <div
        className={`flex relative flex-col w-full h-full bg-gray-200 ml-[70px]`}
      >
        <div
          className={`bg-black transition-opacity duration-300 ease-in-out bg-opacity-50 absolute z-[999] inset-0 w-full h-full ${
            open ? "opacity-50" : "opacity-0 pointer-events-none"
          }`}
        ></div>
        <Navbar />
        <Routes>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <BooksGrid />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <HistoryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <PrivateRoute>
                <EmployeesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/visitors"
            element={
              <PrivateRoute>
                <VisitorsPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/history" />} />
        </Routes>
      </div>
    </div>
  );
}
