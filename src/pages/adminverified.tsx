import CommonHeader from "../components/common/commonheader";
import AdminVerifiedContainer from "../components/features/adminverified/adminverifiedcontainer";
import AdminPage from "../layouts/adminpage";

const AdminVerified: React.FC = () => {
  return (
    <AdminPage>
      <CommonHeader page="none" />
      <AdminVerifiedContainer />
    </AdminPage>
  );
};

export default AdminVerified;
