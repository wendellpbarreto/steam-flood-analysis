import { describe, it, expect } from "vitest";
import {
  validateSteamRate,
  syncSteamRateUnits,
} from "./steam-rate";
import {
  bblPerDayToMetricTonsPerDay,
  metricTonsPerDayToBblPerDay,
} from "../constants/conversions";
import type { SteamRateCase } from "../../data/presets";

describe("Validação de Vazão de Vapor", () => {
  describe("Conversão bbl/d ↔ t/d", () => {
    it("deve converter 565 bbl/d para ~89,7 t/d", () => {
      const tons = bblPerDayToMetricTonsPerDay(565);
      expect(tons).toBeCloseTo(89.698, 3);
    });

    it("deve converter 755 bbl/d para ~119,86 t/d", () => {
      const tons = bblPerDayToMetricTonsPerDay(755);
      expect(tons).toBeCloseTo(119.862, 3);
    });

    it("deve converter 90 t/d para ~566,9 bbl/d", () => {
      const bbl = metricTonsPerDayToBblPerDay(90);
      expect(bbl).toBeCloseTo(566.902, 3);
    });

    it("deve converter 120 t/d para ~755,87 bbl/d", () => {
      const bbl = metricTonsPerDayToBblPerDay(120);
      expect(bbl).toBeCloseTo(755.870, 3);
    });

    it("deve usar conversão consistente (ida e volta)", () => {
      const originalBbl = 565;
      const tons = bblPerDayToMetricTonsPerDay(originalBbl);
      const backToBbl = metricTonsPerDayToBblPerDay(tons);
      expect(backToBbl).toBeCloseTo(originalBbl, 2);
    });
  });

  describe("Validação de SteamRateCase", () => {
    it("deve validar caso com apenas bbl/d", () => {
      const caseItem: SteamRateCase = {
        rateBblPerDay: 565,
      };

      const validation = validateSteamRate(caseItem);
      expect(validation.valid).toBe(true);
      expect(validation.calculatedTonsPerDay).toBeCloseTo(89.698, 3);
    });

    it("deve validar caso com bbl/d e t/d consistentes", () => {
      const caseItem: SteamRateCase = {
        rateBblPerDay: 565,
        rateTonsPerDay: 89.698,
      };

      const validation = validateSteamRate(caseItem);
      expect(validation.valid).toBe(true);
    });

    it("deve detectar inconsistência entre bbl/d e t/d", () => {
      const caseItem: SteamRateCase = {
        rateBblPerDay: 565,
        rateTonsPerDay: 100,
      };

      const validation = validateSteamRate(caseItem);
      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it("deve rejeitar valores negativos ou zero", () => {
      const caseItem1: SteamRateCase = {
        rateBblPerDay: 0,
      };

      const caseItem2: SteamRateCase = {
        rateBblPerDay: 565,
        rateTonsPerDay: -10,
      };

      expect(validateSteamRate(caseItem1).valid).toBe(false);
      expect(validateSteamRate(caseItem2).valid).toBe(false);
    });
  });

  describe("Sincronização de Unidades", () => {
    it("deve calcular t/d a partir de bbl/d", () => {
      const caseItem: SteamRateCase = {
        rateBblPerDay: 565,
      };

      const synced = syncSteamRateUnits(caseItem);
      expect(synced.rateTonsPerDay).toBeCloseTo(89.698, 3);
    });

    it("deve sincronizar bbl/d quando há inconsistência com t/d", () => {
      const caseItem: SteamRateCase = {
        rateBblPerDay: 500,
        rateTonsPerDay: 89.698,
      };

      const synced = syncSteamRateUnits(caseItem);
      expect(synced.rateBblPerDay).toBeCloseTo(565, 0);
    });

    it("não deve alterar caso já completo", () => {
      const caseItem: SteamRateCase = {
        rateBblPerDay: 565,
        rateTonsPerDay: 89.698,
      };

      const synced = syncSteamRateUnits(caseItem);
      expect(synced).toEqual(caseItem);
    });
  });

  describe("Valores do Serigado IV", () => {
    it("deve validar caso 1: 565 bbl/d = 90 t/d", () => {
      const caseItem: SteamRateCase = {
        rateBblPerDay: 565,
        rateTonsPerDay: 89.698,
      };

      const validation = validateSteamRate(caseItem);
      expect(validation.valid).toBe(true);
    });

    it("deve validar caso 2: 755 bbl/d = 120 t/d", () => {
      const caseItem: SteamRateCase = {
        rateBblPerDay: 755,
        rateTonsPerDay: 119.862,
      };

      const validation = validateSteamRate(caseItem);
      expect(validation.valid).toBe(true);
    });
  });
});
