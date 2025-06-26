import { Transform } from 'class-transformer'
export function ToUpperCase() {
  return Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
}
