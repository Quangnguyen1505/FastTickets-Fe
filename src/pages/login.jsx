import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import SideForAuth from "@/components/AuthSide";
import Layout from "@/components/Layout";
import PrivateRouteLOGIN from "@/components/PrivateRouteLogin";
import { usersAction } from "@/redux/slice/users";
import { login } from "@/utils/https/auth";
import Oauth2Button from "@/components/Oauth2Button";

function Login() {
  const controller = useMemo(() => new AbortController(), []);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [invalid, setInvalid] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const { email, password } = formData;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setMsg("Email is invalid!");
        setInvalid(true);
        setIsLoading(false);
        return;
      }
      await login(email, password, controller);
      // console.log(result);
      dispatch(usersAction.storeLogin({ email, password, controller }));
      setIsLoading(false);
      router.push("/");
    } catch (err) {
      // console.log(err.response.data.msg);
      setMsg(err.response.data.msg);
      setInvalid(true);
      setIsLoading(false);
    }
  };

  return (
    <PrivateRouteLOGIN>
      <Layout title={"Login"}>
        <div className="md:flex">
          <SideForAuth />
          <form className="md:flex-[1] bg-slate-300/20 h-screen md:h-full">
            <div className=" ml-6 md:ml-[50px] lg:ml-[83px] pt-[54px] md:pt-[60px] lg:w-[75%] ">
              <Image
                src="/images/logo.svg"
                width={130}
                height={72}
                className="md:hidden "
                alt="Tickits"
              />
              <p className="text-[#121212] text-3xl font-semibold inline-block mt-12 md:mt-0">
                Sign In
              </p>
              <p className="text-md mt-3 text-[#aaaaaa] hidden md:inline-block">
                Sign in with your data that you entered during your registration
              </p>
              <p className="mt-6 text-base text-[#4E4B66]">Email</p>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData(
                    { ...formData, email: e.target.value },
                    setInvalid(false)
                  );
                }}
                className="mt-3 outline-none border border-solid border-[#dedede] w-[95%]   h-16 p-6"
                placeholder=" Write your email"
              />
              <p className="mt-6 text-base text-[#4E4B66]">Password</p>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value }),
                    setInvalid(false);
                }}
                className="mt-3 outline-none border border-solid border-[#dedede] w-[95%]  h-16 p-6"
                placeholder=" Write your password"
              />

              {isLoading ? (
                <button className="btn btn-primary loading  w-[94%] rounded mt-5">
                  Sign in
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={handleLogin}
                  disabled={
                    (formData.password === "" && formData.password === "") ||
                    invalid ||
                    isLoading
                  }
                  className="btn btn-primary w-[94%] rounded mt-5"
                >
                  Sign in
                </button>
              )}

              <p className="text-info text-center mt-4">{invalid && msg}</p>
              <p className="text-[#696F79] mt-6 text-center">
                Forgot your password?{" "}
                <span
                  onClick={() => {
                    router.push("/reset-password");
                  }}
                  className="text-[#9570FE] cursor-pointer"
                >
                  Reset now
                </span>
              </p>
              <Oauth2Button/>
            </div>
          </form>
        </div>
      </Layout>
    </PrivateRouteLOGIN>
  );
}

export default Login;
