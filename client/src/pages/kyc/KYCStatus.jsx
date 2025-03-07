import React, { useState, useEffect } from "react";
import axios from "axios";

const KYCStatus = () => {
  const [kycStatus, setKycStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/kyc/status");
        setKycStatus(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">KYC Status</h2>
        {kycStatus ? (
          <div className="text-center">
            <p className="text-lg font-semibold">
              Status: <span className={`text-${kycStatus.status === "verified" ? "green" : "red"}-600`}>{kycStatus.status}</span>
            </p>
            {kycStatus.status === "rejected" && (
              <p className="mt-2 text-red-500">Reason: {kycStatus.adminRemarks}</p>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-600">Loading status...</p>
        )}
      </div>
    </div>
  );
};

export default KYCStatus;
