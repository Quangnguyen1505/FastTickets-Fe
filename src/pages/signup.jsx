import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useRouter } from 'next/router';

import SideForAuth from '@/components/AuthSide';
import Layout from '@/components/Layout';
import PrivateRouteLOGIN from '@/components/PrivateRouteLogin';
import { useDispatch } from 'react-redux';
import { usersAction } from '@/redux/slice/users';
import Oauth2Button from '@/components/Oauth2Button';
import { register } from '@/utils/https/auth';
import toast from 'react-hot-toast';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function Signup(props) {
  const { t } = useTranslation('auth');
  const controller = useMemo(() => new AbortController(), []);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [msg, setMsg] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.email) {
      setFormData({ ...formData, email: router.query.email });
    }
  }, [router.isReady]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const handleSignUp = async (event) => {
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
      const result = await register(email, password, controller);
      // console.log(result);
      dispatch(usersAction.storeRegister({ response: result }));
      setIsLoading(false);
      router.push("/");
      toast.success("Đăng ký thành công!");
    } catch (error) {
      console.log(error.response.data.message);
      setIsLoading(false);
      setInvalid(true);
      // setMsg(error.response.data.msg);
      setMsg(error.response.data.message ||  "Có lỗi xảy ra!" );
    }
  };
  const isDisabled = isChecked;
  return (
    <PrivateRouteLOGIN>
      <Layout title={"Sign Up"}>
        <div className="md:flex">
          <SideForAuth />
          <form className="md:flex-[1] bg-slate-300/20 h-full">
            <div className=" ml-6 md:ml-[50px] lg:ml-[83px] pt-[54px] md:pt-[60px] lg:w-[75%] ">
              {/* <Link href={"/"}>
                <Image
                  src="/images/logo.svg"
                  width={130}
                  height={72}
                  className="md:hidden "
                  alt="Tickits"
                />
              </Link> */}
              <p className="text-[#121212] text-[26px] font-semibold hidden md:inline-block">
                {t('right.title')}
              </p>
              {/* <p className="text-3xl font-semibold text-[#121212] mt-12 md:hidden">
                Sign Up
              </p> */}
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
                placeholder={t('right.placeholder_email')}
              />
              <p className="mt-6 text-base text-[#4E4B66]">{t('right.password')}</p>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => {
                  setFormData(
                    { ...formData, password: e.target.value },
                    setInvalid(false)
                  );
                }}
                className="mt-3 outline-none border border-solid border-[#dedede] w-[95%]  h-16 p-6"
                placeholder={t('right.placeholder_password')}
              />
              <div className="mt-6">
                <label className="cursor-pointer">
                  <input
                    type="checkbox"
                    id="checkbox"
                    checked={!isChecked}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 text-red-500 rounded focus:ring-0 focus:outline-none md:inline-block hidden"
                  />

                  <span className="text-[#696F79] ml-[10px] hidden md:inline-block">
                    {t('right.comfirm_checkbox')}
                  </span>
                  <p className="text-info text-center mt-4">{invalid && msg}</p>
                  <p className="text-success text-center mt-4">
                    {success && msg}
                  </p>
                </label>
              </div>
              {isLoading ? (
                <button className="btn btn-primary loading  w-[94%] rounded mt-5">
                  Sign Up
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={handleSignUp}
                  disabled={
                    isDisabled ||
                    invalid ||
                    formData.email === "" ||
                    formData.password === ""
                  }
                  className="btn btn-primary w-[94%] rounded mt-5"
                >
                  {t('right.button')}
                </button>
              )}
              <p className="text-[#696F79] mt-6 text-center">
                {t('right.login')}{" "}
                <span
                  onClick={() => {
                    router.push("/login");
                  }}
                  className="text-[#9570FE] cursor-pointer"
                >
                  {t('right.login_link')}
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

export default Signup;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['auth'])),
    },
  };  
}
