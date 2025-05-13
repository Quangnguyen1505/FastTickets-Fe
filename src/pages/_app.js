import "@/styles/globals.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "../redux/store";

import { Mulish } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { appWithTranslation } from "next-i18next"; // Đảm bảo rằng bạn đã import đúng appWithTranslation

const mulish = Mulish({ subsets: ["latin"] });

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className={`${mulish.className}`}>
          <Toaster position="top-right" reverseOrder={false} />
          <Component {...pageProps} />
        </div>
      </PersistGate>
    </Provider>
  );
}

// Bọc ứng dụng với appWithTranslation để hỗ trợ tính năng dịch ngôn ngữ
export default appWithTranslation(App);
