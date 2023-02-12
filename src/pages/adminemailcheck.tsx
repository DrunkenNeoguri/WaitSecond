import CommonHeader from "../components/common/commonheader";
import AdminEmailCheckContainer from "../components/features/adminemailcheck/adminemailcheckcontainer";
import AdminPage from "../layouts/adminpage";

const AdminEmailCheck: React.FC = () => {
  return (
    <AdminPage>
      <CommonHeader page="admin" />
      <AdminEmailCheckContainer />
    </AdminPage>
  );
};

export default AdminEmailCheck;
