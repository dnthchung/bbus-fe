// helpers/validate-checkpoint-times-without-star.ts

export function validateCheckpointTimesWithoutStar(checkpoints: { name: string }[], times: string[]): { valid: boolean; message?: string } {
  const total = checkpoints.length

  const timeToMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }

  for (let i = 0; i < total; i++) {
    const [go, ret] = times[i]?.split('/') ?? []
    if (!go || !ret) {
      return { valid: false, message: `Thiếu thời gian tại điểm ${i + 1}.` }
    }

    const goMin = timeToMinutes(go)
    const retMin = timeToMinutes(ret)

    if (goMin < timeToMinutes('06:00') || goMin > timeToMinutes('07:00')) {
      return {
        valid: false,
        message: `Giờ đi của điểm ${i + 1} phải ≥ 06:00 và ≤ 07:00.`,
      }
    }
    if (retMin < timeToMinutes('16:30') || retMin > timeToMinutes('18:00')) {
      return {
        valid: false,
        message: `Giờ về của điểm ${i + 1} phải ≥ 16:30 và ≤ 18:00.`,
      }
    }

    if (i > 0) {
      const [prevGo, prevRet] = times[i - 1]?.split('/') ?? []
      const prevGoMin = timeToMinutes(prevGo)
      const prevRetMin = timeToMinutes(prevRet)

      // Logic chuẩn: đi thì tăng dần về 07:00, về thì giảm dần về 16:30
      if (goMin <= prevGoMin) {
        return {
          valid: false,
          message: 'Giờ đi phải tăng dần về điểm đích (07:00).',
        }
      }
      if (retMin >= prevRetMin) {
        return {
          valid: false,
          message: 'Giờ về phải giảm dần về điểm đích (16:30).',
        }
      }
    }
  }

  return { valid: true }
}
