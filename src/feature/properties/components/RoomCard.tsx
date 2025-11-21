// src/feature/properties/components/RoomCard.tsx
import { Building2, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RoomStatus } from "../types";

type RoomCardProps = {
  roomId: number;
  codigo: string;
  estado: RoomStatus | string;
  precioRenta: string;
  numeroPiso: number;
  onEdit?: () => void;
  onDelete?: () => void;
};

const getEstadoStyles = (estado: string) => {
  if (estado === "OCUPADA") {
    return {
      label: "Ocupada",
      className:
        "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/60",
    };
  }

  if (estado === "DISPONIBLE") {
    return {
      label: "Disponible",
      className:
        "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/60",
    };
  }

  return {
    label: estado,
    className:
      "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-900/40 dark:text-slate-200 dark:border-slate-700",
  };
};

const getFloorLabel = (numeroPiso: number) => {
  switch (numeroPiso) {
    case 1:
      return "Primer piso";
    case 2:
      return "Segundo piso";
    case 3:
      return "Tercer piso";
    case 4:
      return "Cuarto piso";
    case 5:
      return "Quinto piso";
    case 6:
      return "Sexto piso";
    case 7:
      return "Séptimo piso";
    case 8:
      return "Octavo piso";
    default:
      return `Piso ${numeroPiso}`;
  }
};

export function RoomCard({
  roomId,
  codigo,
  estado,
  precioRenta,
  numeroPiso,
  onEdit,
  onDelete,
}: RoomCardProps) {
  const estadoInfo = getEstadoStyles(estado);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col gap-4 dark:bg-slate-900 dark:border-slate-800">
      {/* Header */}
      <header className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-100 text-black dark:bg-slate-800 dark:text-slate-100">
            <Building2 className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-50">
            Habitación {codigo}
          </h3>
        </div>

        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${estadoInfo.className}`}
        >
          {estadoInfo.label}
        </span>
      </header>

      {/* Piso */}
      <section className="space-y-1">
        <p className="text-xs font-medium text-slate-500 uppercase dark:text-slate-400">
          Piso
        </p>
        <p className="text-sm text-slate-900 dark:text-slate-100">
          {getFloorLabel(numeroPiso)}
        </p>
      </section>

      {/* Precio mensual */}
      <section className="space-y-1">
        <p className="text-xs font-medium text-slate-500 uppercase dark:text-slate-400">
          Precio mensual
        </p>
        <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          S/ {Number(precioRenta || 0).toFixed(2)}
        </p>
      </section>

      {/* Botones acciones */}
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-center gap-2 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
          onClick={onEdit}
        >
          <Pencil className="w-3 h-3" />
          <span className="text-xs">Editar</span>
        </Button>

        <Button
          type="button"
          variant="destructive"
          className="w-full justify-center gap-2"
          onClick={onDelete}
        >
          <Trash2 className="w-3 h-3" />
          <span className="text-xs">Eliminar</span>
        </Button>
      </div>
    </article>
  );
}
