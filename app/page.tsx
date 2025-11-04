import Button from "./components/Button";

const Home = () => {
  return (
    <div>
      Home
      <p className="text-secondary text-7xl font-extrabold">Hi Bro</p>
      <Button text="Submit" variant="warning" className="bg-red-500" />
    </div>
  );
};

export default Home;
