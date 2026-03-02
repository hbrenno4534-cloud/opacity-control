import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DepositWithProfile {
  id: string;
  amount: number;
  status: "pending" | "confirmed" | "failed";
  created_at: string;
  user_id: string;
  profiles: { name: string | null; email: string | null; cpf: string | null } | null;
}

const statusColors: Record<string, string> = {
  confirmed: "bg-primary/20 text-primary",
  pending: "bg-accent/20 text-accent",
  failed: "bg-destructive/20 text-destructive",
};

const statusLabels: Record<string, string> = {
  confirmed: "Confirmado",
  pending: "Pendente",
  failed: "Falhou",
};

export default function DepositsPage() {
  const [deposits, setDeposits] = useState<DepositWithProfile[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("deposits")
        .select("*, profiles(name, email, cpf)")
        .order("created_at", { ascending: false });
      if (data) setDeposits(data as unknown as DepositWithProfile[]);
    };
    fetch();
  }, []);

  const filtered = deposits.filter(
    (d) =>
      (d.profiles?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (d.profiles?.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const header = "Nome,Email,CPF,Valor,Status,Data\n";
    const rows = filtered
      .map(
        (d) =>
          `"${d.profiles?.name}","${d.profiles?.email}","${d.profiles?.cpf}","${d.amount}","${statusLabels[d.status]}","${new Date(d.created_at).toLocaleDateString("pt-BR")}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "depositos.csv";
    a.click();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Depósitos</h1>
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <Download className="h-4 w-4 mr-2" /> Exportar CSV
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-card border-border"
        />
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-medium">{d.profiles?.name || "—"}</TableCell>
                <TableCell>{d.profiles?.email || "—"}</TableCell>
                <TableCell>R$ {Number(d.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={statusColors[d.status]}>
                    {statusLabels[d.status]}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(d.created_at).toLocaleDateString("pt-BR")}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Nenhum depósito encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
