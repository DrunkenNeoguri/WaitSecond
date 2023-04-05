import CommonHeader from "../components/common/commonheader";
import AdminLoginContainer from "../components/features/adminlogin/adminlogincontainer";
import AdminPage from "../layouts/adminpage";

const AdminLogin: React.FC = () => {
  return (
    <AdminPage>
      <CommonHeader page="none" />
      <AdminLoginContainer />
    </AdminPage>
  );
};

export default AdminLogin;
