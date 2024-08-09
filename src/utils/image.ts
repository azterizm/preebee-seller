import sharp from 'sharp'

export async function compressImageToWebp(options: {
  input:
    | Parameters<typeof sharp>[0]
    | Buffer
    | string
  dest: string
  width: number
  height?: number
  quality?: number
}) {
  return await sharp(options.input)
    .resize(options.width, options.height, {
      fit: 'cover',
    })
    .webp({ quality: options.quality || 80 })
    .toBuffer()
}
