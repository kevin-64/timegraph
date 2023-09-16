import Timestamp from "../types/Timestamp";

const transform = (timestamp: Timestamp) => {
  const secValue = (timestamp.hh * 3600) + ((timestamp.mm || 0) * 60) + (timestamp.ss || 0)
  return secValue/86400
}

export default transform;