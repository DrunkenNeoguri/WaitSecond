import CommonHeader from "../components/common/commonheader";
import AdminSettingContainer from "../components/features/adminsetting/adminsettingcontainer";
import AdminPage from "../layouts/adminpage";

function AdminSetting() {
  return (
    <AdminPage>
      <CommonHeader page="admin" />
      <AdminSettingContainer />
    </AdminPage>
  );
}

export default AdminSetting;
