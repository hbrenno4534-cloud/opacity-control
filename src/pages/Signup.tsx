import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import VaultDoor from "@/components/VaultDoor";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock, Mail, User, Phone, CreditCard } from "lucide-react";

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", cpf: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVault, setShowVault] = useState(false);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast({ title: "Senhas não coincidem", variant: "destructive" });
      return;
    }
    if (form.password.length < 6) {
      toast({ title: "A senha deve ter pelo menos 6 caracteres", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await signUp(form.email, form.password, {
      name: form.name,
      phone: form.phone,
      cpf: form.cpf,
    });
    setLoading(false);

    if (error) {
      toast({ title: "Erro ao criar conta", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Conta criada com sucesso!" });
    setShowVault(true);
  };

  const handleVaultComplete = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const fields = [
    { id: "name", label: "Nome completo", icon: User, type: "text", placeholder: "Seu nome" },
    { id: "email", label: "E-mail", icon: Mail, type: "email", placeholder: "seu@email.com" },
    { id: "phone", label: "Telefone", icon: Phone, type: "tel", placeholder: "(11) 99999-9999" },
    { id: "cpf", label: "CPF", icon: CreditCard, type: "text", placeholder: "000.000.000-00" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      {showVault && <VaultDoor isOpen onAnimationComplete={handleVaultComplete} />}

      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <img src="/front/images/logo.webp" alt="Logo" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Criar sua conta</h1>
          <p className="text-muted-foreground text-sm mt-1">Preencha seus dados para começar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ id, label, icon: Icon, type, placeholder }) => (
            <div key={id} className="space-y-1.5">
              <Label htmlFor={id} className="text-foreground text-sm">{label}</Label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id={id}
                  type={type}
                  placeholder={placeholder}
                  value={form[id as keyof typeof form]}
                  onChange={update(id)}
                  className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
                  required={id !== "phone" && id !== "cpf"}
                />
              </div>
            </div>
          ))}

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-foreground text-sm">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={update("password")}
                className="pl-10 pr-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-foreground text-sm">Confirmar senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={update("confirmPassword")}
                className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
