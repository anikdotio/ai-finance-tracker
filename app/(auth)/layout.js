import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0C0D0E] text-[#F4F0E6] flex flex-col">
      {children}
    </div>
  );
};

export default AuthLayout;
