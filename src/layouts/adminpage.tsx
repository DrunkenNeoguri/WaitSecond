import { useLocation } from "react-router-dom";
import { Props } from "../utils/typealies";

function AdminPage(props: Props) {
  const location = useLocation();
  return (
    <section
      style={{
        background: "#F2F2F2",
        height: "100vh",
        padding:
          location.pathname === "/adminwaitinglist"
            ? "5.5rem 0 3rem 0"
            : "3.5rem 0 0 0",
        maxWidth: "40rem",
        margin: "0 auto",
      }}
    >
      {props.children}
    </section>
  );
}

export default AdminPage;
