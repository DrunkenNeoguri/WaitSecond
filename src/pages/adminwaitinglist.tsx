import CommonHeader from "../components/common/commonheader";
import AdminWaitingListContainer from "../components/features/adminwaitinglist/adminwaitinglistcontainer";
import AdminPage from "../layouts/adminpage";

function AdminWaitingList() {
  return (
    <AdminPage>
      <CommonHeader page="admin" />
      <AdminWaitingListContainer />
    </AdminPage>
  );
}

export default AdminWaitingList;
