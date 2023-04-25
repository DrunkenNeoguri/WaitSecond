import React, { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CommonHeader from "../components/common/commonheader";
import AdminChangePasswordContainer from "../components/features/adminsetting/adminchangepasswordcontainer";
import AdminSettingContainer from "../components/features/adminsetting/adminsettingcontainer";
import AdminWithdrawalContainer from "../components/features/adminsetting/adminwithdrawalcontainer";

import AdminPage from "../layouts/adminpage";
import { loginStateCheck } from "../utils/verifiedcheck";

function AdminSetting() {
  const navigate = useNavigate();
  const toastMsg = useToast();

  useEffect(() => {
    if (loginStateCheck() === false) {
      if (toastMsg.isActive("error-notLogin")) {
        toastMsg({
          title: "로그인 상태가 아님",
          id: "error-notLogin",
          description:
            "로그인 상태가 아닙니다. 로그인 페이지에서 정상적으로 로그인해주세요.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      navigate("/adminlogin");
    }
  }, []);

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
