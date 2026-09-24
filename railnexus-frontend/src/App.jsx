import { BrowserRouter, Routes, Route } from "react-router-dom";
import Booking from "./pages/booking/Booking";
import MainLayout from "./layouts/MainLayout/MainLayout";
import Home from "./pages/home/Home";
import Payment from "./pages/payment/Payment";
import TrainSearch from "./pages/trains/TrainSearch";
import TrainDetails from "./pages/trains/TrainDetails";
import BookingConfirmation from "./pages/confirmation/BookingConfirmation";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PassengerBookings from "./pages/passenger/PassengerBookings";
import Profile from "./pages/profile/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import AdminTrains from "./pages/admin/AdminTrains";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRoute from "./pages/admin/AdminRoute";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import AdminStations from "./pages/admin/AdminStations";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />
          <Route path="/trains" element={<TrainSearch />} />
          <Route
            path="/trains/:trainNumber"
            element={<TrainDetails />}
          />
          <Route
            path="/booking/:trainNumber"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:trainNumber"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/confirmation/:pnr"
            element={
              <ProtectedRoute>
                <BookingConfirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <PassengerBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/trains"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminTrains />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/stations"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminStations />
                </AdminLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/bookings"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminBookings />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminUsers />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminProfile />
                </AdminLayout>
              </AdminRoute>
            }
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;