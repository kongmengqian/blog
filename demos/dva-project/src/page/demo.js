import demo from "kongmq-demo";
import Demo from "kongmq-demo";
import { Link } from "dva/router";

const Page = () => {
  return (
    <div>
      <div style={{ textAlign: "center", lineHeight: "40px" }}>
        <Link to="/">首页</Link>
      </div>
      <Demo />
    </div>
  );
};

export default Page;
