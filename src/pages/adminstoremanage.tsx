import CommonHeader from "../components/common/commonheader";
import AdminStoreManageContainer from "../components/features/adminstoremanage/adminstoremanagecontainer";
import AdminPage from "../layouts/adminpage";

function AdminStoreManage() {
  return (
    <AdminPage>
      <CommonHeader page="admin" />
      <AdminStoreManageContainer />
    </AdminPage>
  );
}

export default AdminStoreManage;
