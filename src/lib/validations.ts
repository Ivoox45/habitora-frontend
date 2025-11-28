// src/lib/validations.ts

/**
 * Validación de nombres completos
 * - Solo permite letras (mayúsculas, minúsculas), espacios, tildes, ñ y Ñ
 * - Al menos 2 caracteres
 */
export const isValidFullName = (value: string): boolean => {
  const trimmed = value.trim();
  if (trimmed.length < 2) return false;
  
  // Permite letras (incluidas tildes y ñ), espacios y guiones
  const nameRegex = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'-]+$/;
  return nameRegex.test(trimmed);
};

/**
 * Validación de DNI peruano
 * - Exactamente 8 dígitos numéricos
 */
export const isValidDni = (value: string): boolean => {
  return /^\d{8}$/.test(value.trim());
};

/**
 * Validación de email
 */
export const isValidEmail = (value: string): boolean => {
  const email = value.trim();
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validación de teléfono peruano
 * - Exactamente 9 dígitos numéricos
 * - Opcional (puede estar vacío)
 */
export const isValidPeruvianPhone = (value: string): boolean => {
  const phone = value.trim();
  if (!phone) return true; // opcional
  return /^\d{9}$/.test(phone);
};

/**
 * Formatea el número de teléfono para mostrar con código de país
 * - Entrada: "987654321"
 * - Salida: "+51 987 654 321"
 */
export const formatPeruvianPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length !== 9) return phone;
  
  return `+51 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
};

/**
 * Limpia y valida input de nombre
 * - Remueve caracteres no permitidos
 * - Mantiene solo letras, espacios, tildes, ñ y guiones
 */
export const sanitizeNameInput = (value: string): string => {
  // Remueve cualquier carácter que no sea letra, espacio, tilde, ñ o guión
  return value.replace(/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'-]/g, "");
};

/**
 * Limpia y valida input de teléfono
 * - Solo dígitos
 * - Máximo 9 caracteres
 */
export const sanitizePhoneInput = (value: string): string => {
  return value.replace(/\D/g, "").slice(0, 9);
};

/**
 * Limpia y valida input de DNI
 * - Solo dígitos
 * - Máximo 8 caracteres
 */
export const sanitizeDniInput = (value: string): string => {
  return value.replace(/\D/g, "").slice(0, 8);
};

/**
 * Mensajes de error para validaciones
 */
export const VALIDATION_MESSAGES = {
  fullName: {
    required: "El nombre completo es obligatorio",
    invalid: "El nombre solo puede contener letras, espacios y tildes",
    minLength: "El nombre debe tener al menos 2 caracteres",
  },
  dni: {
    required: "El DNI es obligatorio",
    invalid: "El DNI debe tener exactamente 8 dígitos numéricos",
  },
  email: {
    required: "El correo electrónico es obligatorio",
    invalid: "Ingresa un correo electrónico válido",
  },
  phone: {
    invalid: "El teléfono debe tener exactamente 9 dígitos",
    format: "Formato: 9 dígitos (se agregará +51 automáticamente)",
  },
};
