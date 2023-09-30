import { sum, diff } from "../src/engine/TimestampUtils"

describe('TimestampTransformer', () => {
  test('should add two times together', () => {
    let left = { hh: 5, mm: 30 }
    let right = { hh: 2, mm: 15 }
    expect(sum(left, right)).toMatchObject({hh: 7, mm: 45})

    left = { hh: 5, mm: 30 }
    right = { hh: 3, mm: 45 }
    expect(sum(left, right)).toMatchObject({hh: 9, mm: 15})
  })
})