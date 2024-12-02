import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'localdb',
  database: 'nestjs',
  // entities: ['src/entity/*.entity.ts'],
  synchronize: true,
  autoLoadEntities: true,
};
