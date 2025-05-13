import { emitter } from '@/helper/eventemit';
import { storeOauthLogin } from '@/redux/slice/users';
import { ApiloginSuccess } from '@/utils/https/oauth2';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

const LoginSuccess = () => {
  const controller = useMemo(() => new AbortController(), []);
  const router = useRouter();
  const dispatch = useDispatch();
  const { userId, oauth_login } = router.query;

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!router.isReady) return;

    const processLoginSuccess = async () => {
      const id = typeof userId === 'string' ? userId : '';
      const oauthHash = typeof oauth_login === 'string' ? oauth_login : '';

      try {
        const res = await ApiloginSuccess(id, oauthHash, controller);
        console.log("res ", res.data);

        if (res.data?.metadata?.err === 0) {
          dispatch(storeOauthLogin({ userData: res.data?.metadata }));
          setMessage('Login successful! Redirecting...');

          await emitter.emit('loginSuccess');
          setTimeout(() => window.close(), 1000);
          router.push('/');
        } else {
          setMessage('Login failed! Please try again.');
        }
      } catch (err) {
        console.error(err);
        setMessage('Something went wrong!');
      }
    };

    processLoginSuccess();

    return () => {
      controller.abort();
    };
  }, [router.isReady, userId, oauth_login, dispatch]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        <h1 className="text-3xl font-semibold">{message}</h1>
      </div>
    </div>
  );
};

export default LoginSuccess;
