export async function extractWaveform(audioFile: File, samples: number = 200): Promise<number[]> {
  const audioContext = new AudioContext()
  const arrayBuffer = await audioFile.arrayBuffer()
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
  const channelData = audioBuffer.getChannelData(0)

  const blockSize = Math.floor(channelData.length / samples)
  const waveform: number[] = []

  for (let i = 0; i < samples; i++) {
    let sum = 0
    const start = i * blockSize
    for (let j = start; j < start + blockSize; j++) {
      sum += Math.abs(channelData[j] || 0)
    }
    waveform.push(sum / blockSize)
  }

  // Normalize to 0-1
  const max = Math.max(...waveform)
  return waveform.map(v => v / (max || 1))
}

export function waveformToSVGPath(waveform: number[], width: number = 800, height: number = 200): string {
  const centerY = height / 2
  const barWidth = width / waveform.length
  let path = ''

  waveform.forEach((amplitude, i) => {
    const x = i * barWidth + barWidth / 2
    const barHeight = amplitude * height * 0.8
    const y1 = centerY - barHeight / 2
    const y2 = centerY + barHeight / 2
    path += `M${x},${y1} L${x},${y2} `
  })

  return path
}

export function generateWaveformSVG(waveform: number[], color: string = '#c9a96e'): string {
  const width = 800
  const height = 200
  const path = waveformToSVGPath(waveform, width, height)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="none"/>
    <path d="${path}" stroke="${color}" stroke-width="2" stroke-linecap="round" fill="none"/>
  </svg>`
}
