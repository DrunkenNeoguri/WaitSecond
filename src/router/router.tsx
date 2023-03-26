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

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:storeuid" element={<WaitingMain />} />
        <Route path="/:storeuid/waitingform" element={<WaitingForm />} />
        <Route
          path="/:storeuid/waitingstate/:telnumber"
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
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
