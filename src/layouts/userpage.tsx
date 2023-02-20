import { Props } from "../utils/typealies";

function UserPage(props: Props) {
  return (
    <section style={{ background: "#EDEDED", height: "100vh" }}>
      {props.children}
    </section>
  );
}

export default UserPage;
