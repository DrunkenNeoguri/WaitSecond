import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import CommonHeader from "../components/common/commonheader";
import AdminStoreManageContainer from "../components/features/adminstoremanage/adminstoremanagecontainer";
import AdminPage from "../layouts/adminpage";
import { loginStateCheck } from "../utils/verifiedcheck";

function AdminStoreManage() {
  const navigate = useNavigate();
  const toastMsg = useToast();

  if (loginStateCheck() === false) {
    if (toastMsg.isActive("error-notLogin")) {
      toastMsg({
        title: "로그인 상태가 아님",
        id: "error-notLogin",
        description:
          "로그인 상태가 아닙니다. 로그인 페이지에서 정상적으로 로그인해주세요.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    navigate("/adminlogin");
  }

  return (
    <AdminPage>
      <CommonHeader page="admin" />
      <AdminStoreManageContainer />
    </AdminPage>
  );
}

export default AdminStoreManage;
