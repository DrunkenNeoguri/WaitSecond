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

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:store/waitingform" element={<WaitingForm />} />
        <Route
          path="/:store/waitingstate/:telnumber"
          element={<WaitingState />}
        />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/adminsignup" element={<AdminSignUp />} />
        <Route path="/adminverified" element={<AdminVerified />} />
        <Route path="/adminfindpassword" element={<AdminFindPassword />} />
        <Route path="/:store/adminwaitinglist" element={<AdminWaitingList />} />
        <Route path="/:store/adminstoremanage" element={<AdminStoreManage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
