import CommonFooter from "../components/common/commonfooter";
import CommonHeader from "../components/common/commonheader";
import WaitingMainContainer from "../components/features/waitingmain/waitingmaincontainer";
import UserPage from "../layouts/userpage";

const WaitingMain: React.FC = () => {
  return (
    <UserPage>
      <CommonHeader page="user" />
      <WaitingMainContainer />
      <CommonFooter />
    </UserPage>
  );
};

export default WaitingMain;
