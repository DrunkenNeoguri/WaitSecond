import React, { useState } from "react";
import CommonHeader from "../components/common/commonheader";
import AdminChangePasswordContainer from "../components/features/adminsetting/adminchangepasswordcontainer";
import AdminSettingContainer from "../components/features/adminsetting/adminsettingcontainer";
import AdminWithdrawalContainer from "../components/features/adminsetting/adminwithdrawalcontainer";

import AdminPage from "../layouts/adminpage";

function AdminSetting() {
  const [pageState, setPageState] = useState("default");

  return (
    <AdminPage>
      <CommonHeader page="admin" />
      {pageState === "notice" ? (
        <AdminSettingContainer setPage={setPageState} />
      ) : pageState === "help" ? (
        <AdminSettingContainer setPage={setPageState} />
      ) : pageState === "changepassword" ? (
        <AdminChangePasswordContainer setPage={setPageState} />
      ) : pageState === "withdrawal" ? (
        <AdminWithdrawalContainer setPage={setPageState} />
      ) : (
        <AdminSettingContainer setPage={setPageState} />
      )}
    </AdminPage>
  );
}

export default AdminSetting;
