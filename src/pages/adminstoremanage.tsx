import CommonHeader from "../components/common/commonheader";
import AdminSettingContainer from "../components/features/adminsetting/adminstoremanagecontainer";
import AdminPage from "../layouts/adminpage";

function AdminStoreManage() {
  return (
    <AdminPage>
      <CommonHeader page="admin" />
      <AdminSettingContainer />
    </AdminPage>
  );
}

export default AdminStoreManage;
