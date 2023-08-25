import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  if (userInfo === null) {
    <Navigate to="/" replace />;
  } else {
    return <Outlet />;
  }
};

export default PrivateRoute;
