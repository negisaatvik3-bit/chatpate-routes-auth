import qrCode from "@/assets/chatpate-routes-qr.png";

export default function QRCode() {
  return (
    <div className="qr-code">
      <img
        src={qrCode}
        alt="Scan to connect with Chatpate Routes"
      />
      <p>Scan to connect with us</p>
    </div>
  );
}