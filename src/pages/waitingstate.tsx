import CommonHeader from "../components/common/commonheader";
import WaitingStateContainer from "../components/features/waitingstate/waitingstatecontainer";
import AdminPage from "../layouts/adminpage";
import UserPage from "../layouts/userpage";

function WaitingState() {
  return (
    <UserPage>
      <CommonHeader page="user" />
      <WaitingStateContainer />
    </UserPage>
  );
}

export default WaitingState;
