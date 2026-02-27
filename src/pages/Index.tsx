import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    window.location.replace("/front/");
  }, []);

  return null;
};

export default Index;
