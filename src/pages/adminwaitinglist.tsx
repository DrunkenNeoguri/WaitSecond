import React, { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import CommonHeader from "../components/common/commonheader";
import AdminWaitingListContainer from "../components/features/adminwaitinglist/adminwaitinglistcontainer";
import AdminPage from "../layouts/adminpage";
import { loginStateCheck } from "../utils/verifiedcheck";

function AdminWaitingList() {
  const navigate = useNavigate();
  const toastMsg = useToast();

  useEffect(() => {
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
  }, []);

  return (
    <AdminPage>
      <CommonHeader page="admin" />
      <AdminWaitingListContainer />
    </AdminPage>
  );
}

export default AdminWaitingList;
