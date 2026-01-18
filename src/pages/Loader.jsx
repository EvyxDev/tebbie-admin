import { tebbieLoader } from "../assets";

const Loader = () => {
  return (
    <div className="h-[80vh] w-full flex justify-center items-center">
      <img alt="loader" className="w-96" src={tebbieLoader} />
    </div>
  );
};

export default Loader;
