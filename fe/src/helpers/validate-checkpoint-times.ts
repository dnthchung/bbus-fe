// helpers/validate-checkpoint-times.ts
export function validateCheckpointTimesWithStar(checkpoints: { name: string }[], times: string[]): { valid: boolean; message?: string } {
  const total = checkpoints.length
  const timeToMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }

  const lastCp = checkpoints[total - 1]
  const [lastGo, lastReturn] = times[total - 1]?.split('/') ?? []

  if (!lastCp.name.toLowerCase().includes('ngôi sao')) {
    return { valid: false, message: 'Điểm cuối phải là Trường Ngôi Sao.' }
  }

  if (lastGo !== '07:00' || lastReturn !== '16:30') {
    return { valid: false, message: 'Ngôi Sao phải có giờ 07:00 / 16:30.' }
  }

  for (let i = 0; i < total - 1; i++) {
    const [go, ret] = times[i]?.split('/') ?? []
    const goMin = timeToMinutes(go)
    const retMin = timeToMinutes(ret)

    if (goMin >= timeToMinutes('07:00') || goMin < timeToMinutes('06:30')) {
      return { valid: false, message: `Giờ đi của điểm ${i + 1} phải < 07:00 và ≥ 06:30.` }
    }

    if (retMin <= timeToMinutes('16:30')) {
      return { valid: false, message: `Giờ về của điểm ${i + 1} phải > 16:30.` }
    }

    if (i > 0) {
      const [prevGo, prevRet] = times[i - 1]?.split('/') ?? []
      if (timeToMinutes(go) >= timeToMinutes(prevGo)) {
        return { valid: false, message: 'Giờ đi phải giảm dần về Ngôi Sao (07:00).' }
      }
      if (timeToMinutes(ret) <= timeToMinutes(prevRet)) {
        return { valid: false, message: 'Giờ về phải tăng dần về Ngôi Sao (16:30).' }
      }
    }
  }

  return { valid: true }
}
