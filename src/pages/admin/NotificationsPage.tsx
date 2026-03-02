import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Send, Bell } from "lucide-react";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setSending(true);
    const { error } = await supabase.from("notifications").insert({
      title: title.trim(),
      body: body.trim(),
      sent_by: user?.id,
    });
    setSending(false);

    if (error) {
      toast({ title: "Erro ao enviar", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Notificação registrada com sucesso!" });
    setTitle("");
    setBody("");
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">Enviar Notificação</h1>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Bell className="h-5 w-5 text-primary" />
            Nova Notificação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSend} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground">Título</Label>
              <Input
                placeholder="Título da notificação"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-background border-border"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Conteúdo</Label>
              <Textarea
                placeholder="Mensagem da notificação..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="bg-background border-border min-h-[120px]"
                required
              />
            </div>

            {/* Preview */}
            {(title || body) && (
              <div className="rounded-lg border border-border p-4 bg-muted/30">
                <p className="text-xs text-muted-foreground mb-2">Preview</p>
                <p className="font-semibold text-foreground text-sm">{title || "Título"}</p>
                <p className="text-muted-foreground text-sm mt-1">{body || "Conteúdo"}</p>
              </div>
            )}

            <Button type="submit" disabled={sending} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              {sending ? "Enviando..." : "Enviar Notificação"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
