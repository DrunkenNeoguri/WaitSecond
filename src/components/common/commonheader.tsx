import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";

const CommonHeader: React.FC<{
  children?: React.ReactNode;
  page: "admin" | "user";
}> = (props) => {
  return (
    <NavBar>
      {props.page === "admin" ? (
        <>
          <menu /> <button>예</button>
        </>
      ) : (
        <>
          <button></button>{" "}
          <button>
            <FontAwesomeIcon
              icon={faGlobe}
              color="#ffffff"
              style={{ height: "2.25rem", width: "2.25rem" }}
            />
          </button>
        </>
      )}
    </NavBar>
  );
};

export default CommonHeader;

const NavBar = styled.nav`
  background: #5a5a5a;
  width: 100vw;
  height: 3.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem;
  position: fixed;
  z-index: 3;
  top: 0;
`;
