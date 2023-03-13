import CommonHeader from "../components/common/commonheader";
import AdminFindPasswordContainer from "../components/features/adminfindpassword/adminfindpasswordcontainer";
import AdminPage from "../layouts/adminpage";

const AdminFindPassword: React.FC = () => {
  return (
    <AdminPage>
      <CommonHeader page="admin" />
      <AdminFindPasswordContainer />
    </AdminPage>
  );
};

export default AdminFindPassword;
