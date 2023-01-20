import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLogin from "../pages/adminlogin";
import AdminMain from "../pages/adminmain";
import AdminSetting from "../pages/adminsetting";
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
        <Route path="/:store/adminmain" element={<AdminMain />} />
        <Route path="/:store/adminsetting" element={<AdminSetting />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
