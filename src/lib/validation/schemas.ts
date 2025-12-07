import { z } from "zod";

export const commonDataSchema = z.object({
  Eb: z.number().min(0).max(1),
  Tb: z.number(),
  Ts: z.number().positive(),
  Tr: z.number().positive(),
  Ps: z.number().positive(),
  K2: z.number().positive(),
  rho1C1: z.number().positive(),
  rho2C2: z.number().positive(),
  tYears: z.number().positive(),
  So: z.number().min(0).max(1),
  Sor: z.number().min(0).max(1),
  gammaO: z.number().positive(),
  phi: z.number().min(0).max(1),
  zn: z.number().positive(),
  zt: z.number().positive(),
  fsd: z.number().min(0).max(1),
  Fsb: z.number().min(0).max(1),
  Lv: z.number().positive(),
  rhoW: z.number().positive(),
  CwTs: z.number(),
  CwTr: z.number(),
  CwTb: z.number(),
  fPVRef: z.number().min(0).max(1),
});

export const steamRateCaseSchema = z.object({
  rateBblPerDay: z.number().positive(),
  rateTonsPerDay: z.number().positive().optional(),
});

export const presetDataSchema = z.object({
  common: commonDataSchema,
  cases: z.array(steamRateCaseSchema).min(1),
});

export type ValidatedCommonData = z.infer<typeof commonDataSchema>;
export type ValidatedSteamRateCase = z.infer<typeof steamRateCaseSchema>;
export type ValidatedPresetData = z.infer<typeof presetDataSchema>;

export function validatePresetData(data: unknown): {
  success: boolean;
  data?: ValidatedPresetData;
  errors?: z.ZodError;
} {
  const result = presetDataSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, errors: result.error };
}

export function validateCommonData(data: unknown): {
  success: boolean;
  data?: ValidatedCommonData;
  errors?: z.ZodError;
} {
  const result = commonDataSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, errors: result.error };
}
