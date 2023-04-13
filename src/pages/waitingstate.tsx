import CommonFooter from "../components/common/commonfooter";
import CommonHeader from "../components/common/commonheader";
import WaitingStateContainer from "../components/features/waitingstate/waitingstatecontainer";
import UserPage from "../layouts/userpage";

function WaitingState() {
  return (
    <UserPage>
      <CommonHeader page="user" />
      <WaitingStateContainer />
      <CommonFooter />
    </UserPage>
  );
}

export default WaitingState;
