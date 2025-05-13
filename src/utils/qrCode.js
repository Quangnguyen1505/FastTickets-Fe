import QRCode from "qrcode-generator";
import { useEffect, useRef, useState } from "react";

export default function QRCodeGenerator({ data }) {
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const imgRef = useRef();

  useEffect(() => {
    const qr = QRCode(0, "L");
    qr.addData(data);
    qr.make();
    const base64 = qr.createDataURL(7); // size 7
    setQrDataUrl(base64);
  }, [data]);

  if (!qrDataUrl) return null;

  return (
    <div className="flex flex-col items-center mt-4">
      <img ref={imgRef} src={qrDataUrl} alt="QR Code" className="w-40 h-40" />
      <a
        href={qrDataUrl}
        download="ticket-qr.png"
        className="btn btn-outline btn-sm mt-4"
      >
        Tải QR về máy
      </a>
    </div>
  );
}
