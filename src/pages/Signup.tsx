import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import VaultDoor from "@/components/VaultDoor";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock, Mail, User, Phone, CreditCard, MapPin, Calendar, Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    password: "",
    confirmPassword: "",
    // Superbet extra fields
    username: "",
    gender: "",
    dateOfBirth: "",
    postalCode: "",
    address: "",
    city: "",
    // Dev/test fields
    wafToken: "",
    correlationId: "",
  });
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

    // Split name into first/last
    const nameParts = form.name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    setLoading(true);
    const { error } = await signUp(form.email, form.password, {
      name: form.name,
      phone: form.phone,
      cpf: form.cpf,
    }, {
      documentNumber: form.cpf.replace(/\D/g, ""),
      dateOfBirth: form.dateOfBirth,
      firstName,
      lastName,
      gender: form.gender,
      nationality: "BR",
      postalCode: form.postalCode,
      address: form.address,
      city: form.city,
      phone: form.phone.startsWith("+55") ? form.phone : `+55${form.phone.replace(/\D/g, "")}`,
      email: form.email,
      username: form.username,
      password: form.password,
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

  const inputFields = [
    { id: "name", label: "Nome completo", icon: User, type: "text", placeholder: "Seu nome completo", required: true },
    { id: "username", label: "Nome de usuário", icon: User, type: "text", placeholder: "Escolha um username", required: true },
    { id: "email", label: "E-mail", icon: Mail, type: "email", placeholder: "seu@email.com", required: true },
    { id: "phone", label: "Telefone", icon: Phone, type: "tel", placeholder: "(11) 99999-9999", required: true },
    { id: "cpf", label: "CPF", icon: CreditCard, type: "text", placeholder: "000.000.000-00", required: true },
    { id: "dateOfBirth", label: "Data de nascimento", icon: Calendar, type: "text", placeholder: "DD/MM/AAAA", required: true },
    { id: "postalCode", label: "CEP", icon: MapPin, type: "text", placeholder: "00000-000", required: true },
    { id: "address", label: "Endereço", icon: MapPin, type: "text", placeholder: "Rua, número", required: true },
    { id: "city", label: "Cidade", icon: Globe, type: "text", placeholder: "Sua cidade", required: true },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8 relative overflow-hidden">
      {showVault && <VaultDoor isOpen onAnimationComplete={handleVaultComplete} />}

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
      }} />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, hsl(358 85% 48% / 0.3), transparent 70%)" }}
      />

      <div className="w-full max-w-sm space-y-6 relative z-10">
        {/* Logo */}
        <div className="text-center">
          <img src="/front/images/logo.webp" alt="La Casa de Lucro" className="h-20 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(237,28,36,0.3)]" />
          <h1 className="text-xl font-bold text-foreground tracking-wider uppercase">Criar Conta</h1>
          <p className="text-muted-foreground text-xs mt-2 tracking-wide">Preencha seus dados para começar</p>
        </div>

        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 glow-pulse">
          <form onSubmit={handleSubmit} className="space-y-4">
            {inputFields.map(({ id, label, icon: Icon, type, placeholder, required }) => (
              <div key={id} className="space-y-1.5">
                <Label htmlFor={id} className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</Label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/60" />
                  <Input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={form[id as keyof typeof form]}
                    onChange={update(id)}
                    className="pl-10 bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 h-10 text-sm"
                    required={required}
                  />
                </div>
              </div>
            ))}

            {/* Gender select */}
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Gênero</Label>
              <Select value={form.gender} onValueChange={(v) => setForm((prev) => ({ ...prev, gender: v }))}>
                <SelectTrigger className="bg-background/50 border-border text-foreground h-10 text-sm">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[10px] uppercase tracking-wider text-muted-foreground">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/60" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={update("password")}
                  className="pl-10 pr-10 bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 h-10 text-sm"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-[10px] uppercase tracking-wider text-muted-foreground">Confirmar senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/60" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={update("confirmPassword")}
                  className="pl-10 bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 h-10 text-sm"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 uppercase tracking-widest text-xs font-bold bg-primary hover:bg-primary/90 shadow-[0_0_20px_hsl(358_85%_48%/0.3)] mt-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Criando...
                </span>
              ) : "Criar Conta"}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground tracking-wide">
          Já tem conta?{" "}
          <Link to="/login" className="text-primary hover:text-primary/80 font-semibold uppercase transition-colors">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
