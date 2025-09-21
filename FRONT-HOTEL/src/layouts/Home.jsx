import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Hotel System</h1>

      {!user ? (
        <>
          <p className="mb-4">Please login or register to continue.</p>
          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Register
            </Link>
          </div>
        </>
      ) : (
        <>
          <p className="mb-4">
            Hello, <span className="font-semibold">{user.username}</span>! 👋
          </p>

          {user.rol === "client" && (
            <Link
              to="/reservations"
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            >
              View My Reservations
            </Link>
          )}

          {(user.rol === "admin" || user.rol === "employee") && (
            <div className="flex justify-center gap-4">
              <Link
                to="/rooms"
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
              >
                Manage Rooms
              </Link>
              <Link
                to="/clients"
                className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
              >
                Manage Clients
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
