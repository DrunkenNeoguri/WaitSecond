import { Props } from "../utils/typealies";

function UserPage(props: Props) {
  return (
    <section style={{ background: "#EDEDED", height: "80%" }}>
      {props.children}
    </section>
  );
}

export default UserPage;
