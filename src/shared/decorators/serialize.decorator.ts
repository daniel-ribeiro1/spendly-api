import { SerializeInterceptor } from '@/core/interceptors/serialize.interceptor';
import { UseInterceptors } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';

export function Serialize(
  classConstructor: ClassConstructor<unknown>,
): MethodDecorator & ClassDecorator {
  return UseInterceptors(new SerializeInterceptor(classConstructor));
}
