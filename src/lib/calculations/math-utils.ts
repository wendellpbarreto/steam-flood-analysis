export function erfc(x: number): number {
  if (x < 0) {
    return 2 - erfc(-x);
  }

  if (x === 0) {
    return 1;
  }

  if (x > 26) {
    return 0;
  }

  const a1 = -1.26551223;
  const a2 = 1.00002368;
  const a3 = 0.37409196;
  const a4 = 0.09678418;
  const a5 = -0.18628806;
  const a6 = 0.27886807;
  const a7 = -1.13520398;
  const a8 = 1.48851587;
  const a9 = -0.82215223;
  const a10 = 0.17087277;

  const t = 1 / (1 + 0.5 * Math.abs(x));
  const tau =
    t *
    Math.exp(
      -x * x +
        a1 +
        t *
          (a2 +
            t *
              (a3 +
                t *
                  (a4 +
                    t *
                      (a5 +
                        t * (a6 + t * (a7 + t * (a8 + t * (a9 + t * a10))))))))
    );

  if (x >= 0) {
    return tau;
  } else {
    return 2 - tau;
  }
}

export function calculateGTd(td: number): number {
  if (td <= 0) {
    return 0;
  }

  const sqrtTd = Math.sqrt(td);
  const expTd = Math.exp(td);
  const erfcSqrtTd = erfc(sqrtTd);
  const sqrtTdOverPi = (2 * sqrtTd) / Math.sqrt(Math.PI);

  const result = expTd * erfcSqrtTd + sqrtTdOverPi - 1;

  return result;
}

export function calculateG1(tcd: number): number {
  if (tcd <= 0) {
    return 0;
  }

  const sqrtTcd = Math.sqrt(tcd);
  const expTcd = Math.exp(tcd);
  const erfcSqrtTcd = erfc(sqrtTcd);

  return expTcd * erfcSqrtTcd;
}
