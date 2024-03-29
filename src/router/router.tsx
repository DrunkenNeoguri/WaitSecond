import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminFindPassword from "../pages/adminfindpassword";
import AdminLogin from "../pages/adminlogin";
import AdminWaitingList from "../pages/adminwaitinglist";
import AdminSignUp from "../pages/adminsignup";
import AdminVerified from "../pages/adminverified";
import WaitingForm from "../pages/waitingform";
import WaitingState from "../pages/waitingstate";
import AdminStoreManage from "../pages/adminstoremanage";
import AdminSetting from "../pages/adminsetting";
import WaitingMain from "../pages/waitingmain";
import ErrorPage from "../pages/errorpage";
import Main from "../pages/main";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/store/:storeuid" element={<WaitingMain />} />
        <Route path="/store/:storeuid/waitingform" element={<WaitingForm />} />
        <Route
          path="/store/:storeuid/waitingstate/:telnumber"
          element={<WaitingState />}
        />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/adminsignup" element={<AdminSignUp />} />
        <Route path="/adminverified" element={<AdminVerified />} />
        <Route path="/adminfindpassword" element={<AdminFindPassword />} />
        <Route path="/adminwaitinglist" element={<AdminWaitingList />} />
        <Route path="/adminstoremanage" element={<AdminStoreManage />} />
        <Route path="/adminsetting" element={<AdminSetting />} />
        <Route path="/adminsetting/findpassword" element={<AdminSetting />} />
        <Route path="/adminsetting/withdrawal" element={<AdminSetting />} />
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
