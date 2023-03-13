import React from "react";
import { useLocation } from "react-router-dom";
import CommonHeader from "../components/common/commonheader";
import AdminChangePasswordContainer from "../components/features/adminsetting/adminchangepasswordcontainer";
import AdminSettingContainer from "../components/features/adminsetting/adminsettingcontainer";
import AdminWithdrawalContainer from "../components/features/adminsetting/adminwithdrawalcontainer";

import AdminPage from "../layouts/adminpage";

function AdminSetting() {
  return (
    <AdminPage>
      <CommonHeader page="admin" />
      <AdminSettingMenuBox />
    </AdminPage>
  );
}

const AdminSettingMenuBox: React.FC = () => {
  const location = useLocation();

  switch (location.pathname) {
    case "/adminsetting/findpassword":
      return <AdminChangePasswordContainer />;
    case "/adminsetting/withdrawal":
      return <AdminWithdrawalContainer />;
    default:
      return <AdminSettingContainer />;
  }
};

export default AdminSetting;
