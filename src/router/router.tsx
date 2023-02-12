import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminChangePassword from "../pages/adminchangepassword";
import AdminEmailCheck from "../pages/adminemailcheck";
import AdminFindPassword from "../pages/adminfindpassword";
import AdminLogin from "../pages/adminlogin";
import AdminMain from "../pages/adminmain";
import AdminSetting from "../pages/adminsetting";
import AdminSignUp from "../pages/adminsignup";
import WaitingForm from "../pages/waitingform";
import WaitingState from "../pages/waitingstate";

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
        <Route path="/adminemailcheck" element={<AdminEmailCheck />} />
        <Route path="/adminfindpassword" element={<AdminFindPassword />} />
        <Route path="/adminchangepassword" element={<AdminChangePassword />} />
        <Route path="/:store/adminmain" element={<AdminMain />} />
        <Route path="/:store/adminsetting" element={<AdminSetting />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
