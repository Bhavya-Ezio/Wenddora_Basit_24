import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminKYCReview = () => {
    const [kycList, setKycList] = useState([]);
  
    useEffect(() => {
      const fetchKYCs = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/kyc/all");
          setKycList(response.data.kycs);
        } catch (error) {
          console.error(error);
        }
      };
      fetchKYCs();
    }, []);
  
    const handleVerify = async (kycId, status) => {
      try {
        await axios.post("http://localhost:5000/api/kyc/verify", { kycId, status });
        alert("KYC " + status + " successfully");
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <div>
        <h2>Admin KYC Review</h2>
        {kycList.map((kyc) => (
          <div key={kyc._id}>
            <p>Name: {kyc.fullName}</p>
            <p>Business: {kyc.businessName}</p>
            <img src={kyc.documents.aadhaarFront} alt="Aadhaar Front" width="100" />
            <img src={kyc.documents.aadhaarBack} alt="Aadhaar Back" width="100" />
            <img src={kyc.documents.panCard} alt="PAN Card" width="100" />
            <button onClick={() => handleVerify(kyc._id, "verified")}>Approve</button>
            <button onClick={() => handleVerify(kyc._id, "rejected")}>Reject</button>
          </div>
        ))}
      </div>
    );
  };
  
  export default AdminKYCReview;
  