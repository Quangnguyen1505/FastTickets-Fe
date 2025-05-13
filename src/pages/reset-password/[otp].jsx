import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import SideForAuth from "@/components/AuthSide";
import Layout from "@/components/Layout";
import PrivateRouteLOGIN from "@/components/PrivateRouteLogin";
import { resetPassword } from "@/utils/https/auth";
import { useTranslation } from "next-i18next";

function ResetPassword() {
  const { t } = useTranslation('auth');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const id = router.query.otp;

  const reset = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setMsg("Your passwords do not match");
      setInvalid(true);
      return;
    }

    setIsLoading(true);

    resetPassword(id, formData.newPassword)
      .then((response) => {
        setIsLoading(false);
        setSuccess(true);
        setMsg("Reset Password Success");
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      })
      .catch((error) => {
        console.error(error);
        setInvalid(true);
        setMsg(error.response?.data?.message || "Reset password failed");
        setIsLoading(false);
      });
  };

  return (
    <PrivateRouteLOGIN>
      <Layout title={"Reset Password"}>
        <div className="md:flex">
          <SideForAuth />
          <div className="md:flex-[1] bg-slate-300/20 h-screen md:h-[1024px]">
            <div className="ml-6 md:ml-[83px] md:pt-[176px] pt-14 md:w-[77%]">
              <Link href={"/"}>
                <Image
                  src="/images/logo.svg"
                  width={120}
                  height={62}
                  className="md:hidden"
                  alt="Tickits"
                />
              </Link>
              <p className="text-[#121212] text-[26px] font-semibold mt-11 md:hidden">
                {t('right_reset_password.title')}
              </p>
              <p className="text-[#121212] text-[26px] font-semibold hidden md:inline-block">
                {t('right_reset_password.description')}
              </p>
              <p className="text-md text-[#8692a6] mt-[10px] md:mt-0">
                We&apos;ll reset the password for you
              </p>

              <input
                value={formData.newPassword}
                onChange={(e) => {
                  setFormData({ ...formData, newPassword: e.target.value });
                  setInvalid(false);
                }}
                type="password"
                className="mt-10 outline-none border border-solid border-[#dedede] w-[95%] h-16 p-6"
                placeholder={t('right_reset_password.placeholder_password')}
              />
              <input
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  setInvalid(false);
                }}
                type="password"
                className="mt-3 outline-none border border-solid border-[#dedede] w-[95%] h-16 p-6"
                placeholder={t('right_reset_password.placeholder_comfirm_password')}
              />
              
              {invalid && (
                <p className="text-info text-center mt-4">{msg}</p>
              )}
              {success && (
                <p className="text-success text-center mt-4">{msg}</p>
              )}

              {isLoading ? (
                <button className="btn btn-primary loading w-[94%] rounded mt-7">
                  Resetting
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={reset}
                  disabled={
                    formData.confirmPassword === "" ||
                    formData.newPassword === ""
                  }
                  className="btn btn-primary w-[94%] rounded mt-7"
                >
                  {t('right_reset_password.button')}
                </button>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </PrivateRouteLOGIN>
  );
}

export default ResetPassword;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'auth'])),
    },
  };  
}
