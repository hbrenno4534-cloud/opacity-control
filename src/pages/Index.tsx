import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    window.location.href = "/front/index.html";
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#081019] text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Carregando...</h1>
        <p>Se você não for redirecionado em instantes, <a href="/front/index.html" className="underline">clique aqui</a>.</p>
      </div>
    </div>
  );
};

export default Index;
