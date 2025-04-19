import React, { useState, forwardRef, useImperativeHandle } from "react";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OtpModal = forwardRef((_, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [inputOtp, setInputOtp] = useState("");
  const [resolver, setResolver] = useState(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      setInputOtp("");
      setGeneratedOtp(null);
      setIsOpen(true);
      return new Promise((resolve) => setResolver(() => resolve));
    },
  }));

  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    toast.success(`OTP Generated: ${otp}`, { autoClose: 5000, position: "top-center" });
  };

  const verifyOtp = () => {
    if (inputOtp === generatedOtp) {
      Swal.fire("Verified, OTP matched");
      resolver(true);
      setIsOpen(false);
    } else {
      Swal.fire("Incorrect OTP");
    }
  };

  const cancelOtp = () => {
    resolver(false);
    setIsOpen(false);
  };

  return (
    <>
      <ToastContainer position="bottom-right" />
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="modal-box bg-white p-6 rounded-lg shadow-xl w-96 space-y-4">
            <h2 className="text-xl font-bold text-center">OTP Verification</h2>

            <button className="btn btn-primary w-full" onClick={generateOtp}>
              Generate OTP
            </button>

            <input
              className="input input-bordered w-full"
              type="text"
              placeholder="Enter OTP"
              value={inputOtp}
              onChange={(e) => setInputOtp(e.target.value)}
            />

            <button className="btn btn-success w-full" onClick={verifyOtp}>
              Verify
            </button>

            <button className="btn btn-ghost w-full" onClick={cancelOtp}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
});

export default OtpModal;
