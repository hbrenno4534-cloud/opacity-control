import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Activity, UserPlus } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalDeposits: number;
  depositVolume: number;
  recentSignups: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalDeposits: 0, depositVolume: 0, recentSignups: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [{ count: totalUsers }, { count: totalDeposits }, { data: deposits }, { count: recentSignups }] =
        await Promise.all([
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("deposits").select("*", { count: "exact", head: true }),
          supabase.from("deposits").select("amount").eq("status", "confirmed"),
          supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString()),
        ]);

      setStats({
        totalUsers: totalUsers ?? 0,
        totalDeposits: totalDeposits ?? 0,
        depositVolume: deposits?.reduce((sum, d) => sum + Number(d.amount), 0) ?? 0,
        recentSignups: recentSignups ?? 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "Total de Usuários", value: stats.totalUsers, icon: Users, color: "text-primary" },
    { title: "Total de Depósitos", value: stats.totalDeposits, icon: DollarSign, color: "text-accent" },
    { title: "Volume (R$)", value: `R$ ${stats.depositVolume.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, icon: Activity, color: "text-primary" },
    { title: "Cadastros (7d)", value: stats.recentSignups, icon: UserPlus, color: "text-accent" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ title, value, icon: Icon, color }) => (
          <Card key={title} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
              <Icon className={`h-5 w-5 ${color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
