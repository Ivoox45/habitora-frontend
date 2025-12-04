import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CrearRecordatorioManualModal({ inquilinos = [], disabled }: { inquilinos: { id: number; nombreCompleto: string; telefonoWhatsapp?: string }[]; disabled?: boolean; }) {
  const [open, setOpen] = useState(false);
  const [facturaId, setFacturaId] = useState("");
  const [mensaje, setMensaje] = useState("");

  return (
    <>
      <Button disabled={disabled} onClick={() => setOpen(true)}>Crear recordatorio manual</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear recordatorio manual</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>ID Factura</Label>
              <Input value={facturaId} onChange={(e) => setFacturaId(e.target.value)} placeholder="Ej: 123" />
            </div>
            <div className="space-y-2">
              <Label>Mensaje</Label>
              <Input value={mensaje} onChange={(e) => setMensaje(e.target.value)} placeholder="Texto opcional" />
            </div>
            <div className="text-xs text-muted-foreground">Inquilinos activos: {inquilinos.length}</div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cerrar</Button>
              <Button onClick={() => setOpen(false)}>Crear</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
