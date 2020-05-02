import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";

const Notfound: FunctionalComponent = () => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h1 className="text-3xl leading-9 font-extrabold text-gray-900 sm:text-4xl sm:leading-10 pb-5">
          Error 404 :(
        </h1>

        <Link href="/">
          <h4>Back to Home</h4>
        </Link>
      </div>
    </div>
  );
};

export default Notfound;
