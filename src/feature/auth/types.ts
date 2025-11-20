// src/feature/auth/types.ts

// >>> Coincide con tu RegisterRequest de Spring Boot
export type RegisterRequest = {
  nombreCompleto: string;
  email: string;
  telefonoWhatsapp: string;
  password: string;
};

// >>> Coincide con tu LoginRequest de Spring Boot
export type LoginRequest = {
  email: string;
  password: string;
};

// Por ahora el backend devuelve solo un String ("Registro exitoso", "Login exitoso")
export type AuthMessageResponse = string;

// Usuario autenticado básico que guardaremos en el store
export type AuthUser = {
  id?: number; // 👈 se completa luego con /tiene-propiedades
  nombreCompleto: string;
  email: string;
  telefonoWhatsapp?: string;
};

export type TienePropiedadesResponse = {
  usuarioId: number;
  tienePropiedades: boolean;
};
export type UsuarioResponse = {
  id: number;
  nombreCompleto: string;
  email: string;
  telefonoWhatsapp: string;
};
