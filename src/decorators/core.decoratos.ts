import { HttpException } from '@nestjs/common'

export const TryCatch = () => {
  return (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value
    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args)
      } catch (e) {
        console.error(e)
        throw new HttpException(e.response, e.status)
      }
    }
    return descriptor
  }
}
