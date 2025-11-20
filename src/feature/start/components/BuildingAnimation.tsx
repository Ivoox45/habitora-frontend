import * as motion from "motion/react-client";
import { useMemo } from "react";

type BuildingAnimationProps = {
  pisos: number;              // 1..10
  habitacionesPorPiso: number[]; // cantidad de habitaciones por piso
  className?: string;
  highlightFloor?: number | null; // 1 = piso más bajo (piso donde vive el dueño)
};

export default function BuildingAnimation({
  pisos,
  habitacionesPorPiso,
  className = "",
  highlightFloor = null,
}: BuildingAnimationProps) {
  const clampedPisos = Math.min(10, Math.max(1, pisos | 0));

  const MAX_WINDOWS = 8;

  const floors = useMemo(
    () => Array.from({ length: clampedPisos }, (_, i) => i + 1),
    [clampedPisos]
  );

  const windowsByFloor = useMemo(() => {
    const map = new Map<number, number>();
    floors.forEach((floor) => {
      const idx = floor - 1;
      const rooms = Math.max(1, habitacionesPorPiso[idx] ?? 1);
      map.set(floor, Math.min(MAX_WINDOWS, rooms));
    });
    return map;
  }, [floors, habitacionesPorPiso]);

  const gapBetweenFloors = 15;
  const innerTopOffset = 52;
  const innerBottomOffset = 70;

  const MAX_BUILDING_HEIGHT = 635;
  const MAX_INNER_HEIGHT =
    MAX_BUILDING_HEIGHT - innerTopOffset - innerBottomOffset;

  const MIN_INNER_HEIGHT = 220;

  const MAX_GROW_FLOORS: number = 4; // <- anotado como number para evitar el warning
  const floorsForHeight = Math.min(clampedPisos, MAX_GROW_FLOORS);

  const t =
    MAX_GROW_FLOORS <= 1
      ? 1
      : (floorsForHeight - 1) / (MAX_GROW_FLOORS - 1); // 0..1

  const innerHeight =
    MIN_INNER_HEIGHT + (MAX_INNER_HEIGHT - MIN_INNER_HEIGHT) * t;

  const buildingHeight = innerTopOffset + innerBottomOffset + innerHeight;

  const floorHeight =
    (innerHeight - (clampedPisos - 1) * gapBetweenFloors) / clampedPisos;

  const windowGap = 6;
  const BUILDING_WIDTH = 520;

  const horizontalPadding = 40 * 2 + 16 * 2; // px-10 + px-4 aprox
  const availableWidth = BUILDING_WIDTH - horizontalPadding;

  const maxByWidth =
    (availableWidth - (MAX_WINDOWS - 1) * windowGap) / MAX_WINDOWS;

  const maxByHeight = floorHeight * 0.75;

  const windowSize = Math.max(14, Math.min(maxByWidth, maxByHeight));

  const easing: [number, number, number, number] = [0.22, 1, 0.36, 1];

  return (
    <div
      className={`relative flex items-center justify-end ${className}`}
      style={{
        minWidth: BUILDING_WIDTH + 32,
        minHeight: buildingHeight + 40,
      }}
    >
      {/* Glow suave debajo */}
      <motion.div
        className="pointer-events-none absolute rounded-[40px] -z-10"
        style={{
          width: BUILDING_WIDTH * 1.2,
          height: buildingHeight * 0.6,
          bottom: 8,
          right: 0,
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(0,0,0,0.55), rgba(0,0,0,0))",
          filter: "blur(30px)",
        }}
        initial={{ opacity: 0.2 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 1.2, ease: easing }}
      />

      {/* Poste decorativo (farol) */}
      <motion.div
        className="pointer-events-none absolute flex flex-col items-center gap-2"
        style={{ bottom: 18, right: 4 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: easing }}
      >
        {/* Luz */}
        <motion.div
          className="rounded-full"
          style={{
            width: 26,
            height: 26,
            background:
              "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.95), rgba(255,220,160,0.9))",
            boxShadow:
              "0 0 18px rgba(255,220,160,0.85), 0 0 32px rgba(255,220,160,0.55)",
          }}
          animate={{ opacity: [0.8, 1, 0.9, 1] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: [0.42, 0, 0.58, 1],
          }}
        />
        {/* Poste */}
        <div
          style={{
            width: 3,
            height: 70,
            borderRadius: 999,
            background:
              "linear-gradient(180deg, rgba(230,230,235,0.9), rgba(80,85,95,1))",
            boxShadow: "0 0 6px rgba(0,0,0,0.8)",
          }}
        />
        {/* Sombra en el suelo */}
        <div
          className="rounded-full"
          style={{
            width: 40,
            height: 10,
            background:
              "radial-gradient(circle, rgba(0,0,0,0.55), transparent)",
            filter: "blur(3px)",
          }}
        />
      </motion.div>

      {/* Cuerpo del edificio */}
      <motion.div
        className="relative rounded-[28px] bg-gradient-to-b from-[#171b23] via-[#10141b] to-[#06070a] shadow-[0_25px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/8 overflow-hidden"
        style={{ width: BUILDING_WIDTH, height: buildingHeight }}
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: easing }}
      >
        {/* Bordes y luces laterales */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 rounded-[28px] ring-1 ring-white/10" />
          <div className="absolute inset-y-0 left-0 w-[18%] bg-gradient-to-r from-white/10 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-[10%] bg-gradient-to-l from-white/6 to-transparent" />
        </div>

        {/* Techo */}
        <motion.div
          className="absolute left-5 right-5 top-3 h-7 rounded-2xl bg-gradient-to-b from-white/18 to-white/6"
          style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45)" }}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: easing }}
        />
        <div className="absolute left-8 right-8 top-[34px] h-[2px] bg-white/12" />

        {/* PISOS */}
        <div
          className="absolute inset-x-0 px-10"
          style={{ top: innerTopOffset, bottom: innerBottomOffset }}
        >
          <div
            className="flex flex-col justify-end"
            style={{ rowGap: gapBetweenFloors }}
          >
            {floors
              .slice()
              .reverse()
              .map((floorNumber, indexFromTop) => {
                const litCount = windowsByFloor.get(floorNumber) ?? 1;
                const isOwnerFloor = highlightFloor === floorNumber;

                const ownerBaseCount = Math.max(litCount, 1);
                const ownerWindowIndex = isOwnerFloor
                  ? Math.floor((ownerBaseCount - 1) / 2)
                  : null;

                return (
                  <motion.div
                    key={floorNumber}
                    className="relative flex items-center rounded-xl bg-white/[0.03] border border-white/[0.05] px-4"
                    style={{
                      height: floorHeight,
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.45)",
                    }}
                    initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.45,
                      delay: 0.05 + indexFromTop * 0.05,
                      ease: easing,
                    }}
                  >
                    {/* Número de piso */}
                    <div className="absolute -left-7 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-white/70 select-none">
                      {floorNumber}
                    </div>

                    {/* Resalte piso del dueño */}
                    {isOwnerFloor && (
                      <motion.div
                        className="pointer-events-none absolute inset-0 rounded-xl"
                        style={{
                          background:
                            "radial-gradient(120% 220% at 50% 50%, rgba(255,255,255,0.16), rgba(0,0,0,0))",
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                      />
                    )}

                    {/* Ventanas */}
                    <div
                      className="flex w-full h-full items-center justify-center"
                      style={{ columnGap: windowGap }}
                    >
                      {Array.from({ length: MAX_WINDOWS }).map(
                        (_, colIndex) => {
                          const isOn = colIndex < litCount;
                          const isOwnerWindow =
                            isOwnerFloor && ownerWindowIndex === colIndex;

                          const background = isOwnerWindow
                            ? "linear-gradient(180deg, rgba(255,240,200,0.98), rgba(255,210,140,0.9))"
                            : isOn
                            ? "linear-gradient(180deg, rgba(235,235,235,0.9), rgba(210,210,210,0.55))"
                            : "linear-gradient(180deg, rgba(155,160,170,0.28), rgba(115,120,130,0.18))";

                          const boxShadow = isOwnerWindow
                            ? "0 0 14px rgba(255,220,150,0.7), inset 0 1px 0 rgba(255,255,255,0.8)"
                            : isOn
                            ? "0 0 10px rgba(230,230,230,0.32), inset 0 1px 0 rgba(255,255,255,0.70)"
                            : "inset 0 1px 0 rgba(255,255,255,0.3)";

                          const border = isOwnerWindow
                            ? "1px solid rgba(255,230,180,0.95)"
                            : "1px solid rgba(255,255,255,0.22)";

                          return (
                            <motion.div
                              key={`${floorNumber}-${colIndex}-${
                                isOn ? "on" : "off"
                              }`}
                              className="rounded-[6px] overflow-hidden"
                              style={{
                                width: windowSize,
                                height: windowSize,
                                background,
                                boxShadow,
                                border,
                              }}
                              initial={
                                isOn
                                  ? { scale: 0.4, opacity: 0, y: 8 }
                                  : { scale: 0.9, opacity: 0.45, y: 0 }
                              }
                              animate={
                                isOn
                                  ? { scale: 1, opacity: 1, y: 0 }
                                  : { scale: 0.9, opacity: 0.45, y: 0 }
                              }
                              transition={{
                                duration: 0.3,
                                delay:
                                  0.08 + colIndex * 0.04 + indexFromTop * 0.03,
                                ease: easing,
                              }}
                            >
                              <div className="w-full h-1/3 bg-white/10" />
                              {isOn && (
                                <motion.div
                                  className="w-full h-full"
                                  initial={{ opacity: 0.85 }}
                                  animate={{ opacity: [0.7, 1, 0.8, 1] }}
                                  transition={{
                                    duration: isOwnerWindow
                                      ? 2.0
                                      : 2.3 + (colIndex % 3) * 0.3,
                                    repeat: Infinity,
                                    ease: [0.42, 0, 0.58, 1],
                                  }}
                                  style={{ background: "transparent" }}
                                />
                              )}
                            </motion.div>
                          );
                        }
                      )}
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
