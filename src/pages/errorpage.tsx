import CommonHeader from "../components/common/commonheader";
import ErrorPageContainer from "../components/features/errorpage/errorpagecontainer";
import AdminPage from "../layouts/adminpage";

const ErrorPage: React.FC = () => {
  return (
    <AdminPage>
      <CommonHeader page="none" />
      <ErrorPageContainer />
    </AdminPage>
  );
};

export default ErrorPage;
