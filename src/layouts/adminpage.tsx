import { Props } from "../utils/typealies";

function AdminPage(props: Props) {
  return (
    <section
      style={{
        background: "#F2F2F2",
        height: "100%",
        padding: "5.5rem 0 3rem 0",
      }}
    >
      {props.children}
    </section>
  );
}

export default AdminPage;
