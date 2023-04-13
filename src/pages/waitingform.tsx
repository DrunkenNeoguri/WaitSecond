import CommonFooter from "../components/common/commonfooter";
import CommonHeader from "../components/common/commonheader";
import WaitingFormContainer from "../components/features/waitingform/waitingformcontainer";
import UserPage from "../layouts/userpage";

function WaitingForm() {
  return (
    <UserPage>
      <CommonHeader page="user" />
      <WaitingFormContainer />
      <CommonFooter />
    </UserPage>
  );
}

export default WaitingForm;
