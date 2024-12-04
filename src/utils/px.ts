import { config } from "../config";

export function pxToMeter(px: number) {
  return px / config.PX_PER_METER;
}

export function meterToPx(m: number) {
  return m * config.PX_PER_METER;
}
