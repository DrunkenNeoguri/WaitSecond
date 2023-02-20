import CommonHeader from "../components/common/commonheader";
import AdminSignUpContainer from "../components/features/adminsignup/adminsignupcontainer";
import AdminPage from "../layouts/adminpage";

const AdminSignUp: React.FC = () => {
  return (
    <AdminPage>
      <CommonHeader page="admin" />
      <AdminSignUpContainer />
    </AdminPage>
  );
};

export default AdminSignUp;
