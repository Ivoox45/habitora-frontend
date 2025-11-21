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
        "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-700",
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
      "bg-neutral-100 text-neutral-700 border border-neutral-200 dark:bg-neutral-900/40 dark:text-neutral-200 dark:border-neutral-700",
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
    <article className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-5 flex flex-col gap-4 dark:bg-neutral-900 dark:border-neutral-800">
      {/* Header */}
      <header className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-neutral-100 text-black dark:bg-neutral-800 dark:text-neutral-100">
            <Building2 className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">
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
        <p className="text-xs font-medium text-neutral-500 uppercase dark:text-neutral-400">
          Piso
        </p>
        <p className="text-sm text-neutral-900 dark:text-neutral-100">
          {getFloorLabel(numeroPiso)}
        </p>
      </section>

      {/* Precio mensual */}
      <section className="space-y-1">
        <p className="text-xs font-medium text-neutral-500 uppercase dark:text-neutral-400">
          Precio mensual
        </p>
        <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          S/ {Number(precioRenta || 0).toFixed(2)}
        </p>
      </section>

      {/* Botones acciones */}
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-center gap-2 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800"
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
