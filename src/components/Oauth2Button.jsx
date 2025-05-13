import Image from "next/image";
import { useRouter } from "next/router";
import { emitter } from "@/helper/eventemit";
import { useEffect } from "react";

function Oauth2Button() {
    const router = useRouter();
    useEffect(() => {
      const handleLoginSuccess = () => {
        console.log('🟢 Đã nhận tín hiệu loginSuccess!');
        // Xử lý tại đây...
        router.push('/');
      };

      emitter.on('loginSuccess', handleLoginSuccess);
      return () => {
        emitter.off('loginSuccess', handleLoginSuccess);
      };
    }, []);
    const handleLoginGoogle = (e) => {
        e.preventDefault();
        const googleLoginUrl = `${process.env.NEXT_PUBLIC_ANALYTICS_ID}/v1/api/oauth/google`; 
        openSignInWindow(googleLoginUrl, "Google SignIn");
    };

    const handleLoginFacebook = (e) => {
      e.preventDefault();
      const facebookLoginUrl = `${process.env.NEXT_PUBLIC_ANALYTICS_ID}/v1/api/oauth/facebook`; 
      openSignInWindow(facebookLoginUrl, "Facebook SignIn");
    };
      
    const openSignInWindow = (url, name) => {
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.innerWidth - width) / 2;
        const top = window.screenY + (window.innerHeight - height) / 2;
      
        const popup = window.open(
          url,
          name,
          `width=${width},height=${height},left=${left},top=${top}`
        );
      
        const interval = setInterval(() => {
          try {
            if (!popup || popup.closed) {
              clearInterval(interval);
              window.location.reload(); 
            }
          } catch (err) {
            console.error(err);
          }
        }, 1000);
    };
    return (
        <div className="flex justify-center w-[95%] pb-[181px]">
            <div className="flex gap-5 cursor-pointer items-center justify-center mt-5 bg-white drop-shadow-md w-full h-[64px]">
                <Image
                src="/google.svg"
                width={24}
                height={24}
                className="relative left-0"
                alt="google"
                />
                <button 
                className="text-[#A0A3BD]"
                onClick={handleLoginGoogle}
                >Google</button>
            </div>
            <div className="flex gap-5 ml-9 cursor-pointer items-center justify-center mt-5 bg-white drop-shadow-md w-full h-[64px]">
                <Image
                src="/facebook.svg"
                width={24}
                height={24}
                className="relative left-0"
                alt="facebook"
                />
                <button 
                className="text-[#A0A3BD]"
                onClick={handleLoginFacebook}
                >Facebook</button>
            </div>
        </div>
    )
}

export default Oauth2Button;