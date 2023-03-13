import CommonHeader from "../components/common/commonheader";
import WaitingFormContainer from "../components/features/waitingform/waitingformcontainer";
import UserPage from "../layouts/userpage";

function WaitingForm() {
  return (
    <UserPage>
      <CommonHeader page="user" />
      <WaitingFormContainer />
    </UserPage>
  );
}

export default WaitingForm;
