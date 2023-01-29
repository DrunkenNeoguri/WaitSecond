import { Props } from "../utils/typealies";

function UserPage(props: Props) {
  return <section>{props.children}</section>;
}

export default UserPage;
