import { Props } from "../utils/typealies";

function AdminPage(props: Props) {
  return (
    <section style={{ background: "#EDEDED", height: "100vh" }}>
      {props.children}
    </section>
  );
}

export default AdminPage;
