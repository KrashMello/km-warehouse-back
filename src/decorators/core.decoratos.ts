import { HttpException, HttpStatus, SetMetadata } from '@nestjs/common'

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
        if (e.status) throw new HttpException(e.response, e.status)
        else
          throw new HttpException(
            {
              data: 'OCURRIO UN ERROR INESPERADO EN EL SERVIDOR',
              type: 'DANGER',
              status: HttpStatus.INTERNAL_SERVER_ERROR,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          )
      }
    }
    return descriptor
  }
}

export const Public = () => SetMetadata('isPublic', true)
