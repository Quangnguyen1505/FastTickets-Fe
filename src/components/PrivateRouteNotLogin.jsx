import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const PrivateRouteNotLogin = ({ children }) => {
  const userData = useSelector((state) => state.user.data?.tokens?.accessToken); // Nếu token không tồn tại, nghĩa là người dùng chưa đăng nhập.
  const router = useRouter();

  if (!userData) {
    router.push("/login");
    return null;
  }

  return children;
};

export default PrivateRouteNotLogin;
