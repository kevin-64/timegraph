import Timestamp from "../types/Timestamp";

const SECONDS_IN_DAY = 86400
const SECONDS_IN_HOUR = 3600
const SECONDS_IN_MINUTE = 60

const toTimestamp = (secs: number): Timestamp => {
  let remaining = secs;

  const hh = Math.floor(remaining / SECONDS_IN_HOUR)
  remaining -= (hh*SECONDS_IN_HOUR)

  const mm = Math.floor(remaining / SECONDS_IN_MINUTE)
  remaining -= (mm*SECONDS_IN_MINUTE)

  const ss = remaining

  //TODO: handle days
  return { hh, mm, ss }
}

const toSeconds = (time: Timestamp): number => {
  return (time.hh * SECONDS_IN_HOUR) + ((time.mm || 0) * SECONDS_IN_MINUTE) + (time.ss || 0)
}

const transform = (timestamp: Timestamp) => {
  const secValue = (timestamp.hh * SECONDS_IN_HOUR) + ((timestamp.mm || 0) * SECONDS_IN_MINUTE) + (timestamp.ss || 0)
  return secValue/SECONDS_IN_DAY
}

const sum = (lhs: Timestamp, rhs: Timestamp): Timestamp => {
  const left = toSeconds(lhs)
  const right = toSeconds(rhs)

  return toTimestamp(left + right)
}

const diff = (lhs: Timestamp, rhs: Timestamp): Timestamp => {
  const left = toSeconds(lhs)
  const right = toSeconds(rhs)
  return toTimestamp(left - right)
}

const isBefore = (lhs: Timestamp, rhs: Timestamp): boolean => {
  const left = toSeconds(lhs)
  const right = toSeconds(rhs)
  return left < right;
}

export { transform, sum, diff, isBefore }