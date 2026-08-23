"use client";

import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` en el cliente, `useEffect` en el servidor —donde no existe
 * el layout y React advertiría—. Sirve para corregir estado que depende del
 * navegador antes del primer paint, sin romper el render del servidor.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
