import CommonHeader from "../components/common/commonheader";
import AdminChangePasswordContainer from "../components/features/adminchangepassword/adminchangepasswordcontainer";
import AdminPage from "../layouts/adminpage";

const AdminChangePassword: React.FC = () => {
  return (
    <AdminPage>
      <CommonHeader page="admin" />
      <AdminChangePasswordContainer />
    </AdminPage>
  );
};

export default AdminChangePassword;
