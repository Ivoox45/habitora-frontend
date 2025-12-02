// src/feature/properties/components/RoomCard.tsx
import { Pencil, Trash2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RoomStatus } from "../types/rooms.types";

type Props = {
  roomId: number;
  codigo: string;
  estado: RoomStatus | string;
  precioRenta: number;   // ✅ AHORA ES NUMBER
  numeroPiso: number;
  onEdit?: () => void;
  onDelete?: () => void;
};

const estadoClasses = (estado: string) => {
  if (estado === "OCUPADA")
    return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
  if (estado === "DISPONIBLE")
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300";
  return "bg-neutral-200 text-neutral-700 dark:bg-neutral-900/40 dark:text-neutral-200";
};

export function RoomCard({
  codigo,
  estado,
  precioRenta,
  numeroPiso,
  onEdit,
  onDelete,
}: Props) {
  return (
    <article className="rounded-xl border p-4 bg-white dark:bg-neutral-900 dark:border-neutral-800 flex flex-col gap-4">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
            <Building2 className="w-4 h-4" />
          </div>
          <h3 className="font-semibold">Habitación {codigo}</h3>
        </div>

        <span className={`text-xs px-3 py-1 rounded-full ${estadoClasses(estado)}`}>
          {estado}
        </span>
      </header>

      <section>
        <p className="text-xs text-muted-foreground">Piso</p>
        <p className="text-sm">{numeroPiso}</p>
      </section>

      <section>
        <p className="text-xs text-muted-foreground">Precio mensual</p>
        <p className="text-lg font-semibold">S/ {precioRenta.toFixed(2)}</p>
      </section>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil className="w-4 h-4" /> Editar
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="w-4 h-4" /> Eliminar
        </Button>
      </div>
    </article>
  );
}
