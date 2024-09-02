import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import prismaMainClient from 'src/core/repository/prisma/service/client';
import { UniqueConstraintsType } from 'src/core/types/constraints/unique-constraints.type';

@ValidatorConstraint({ name: 'IsUniqueDB', async: true })
@Injectable()
export class IsUniqueDBConstraint implements ValidatorConstraintInterface {
  private readonly client = prismaMainClient;
  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    const { tableName, column, exclude }: UniqueConstraintsType =
      args.constraints[0];
    if (!tableName || !column) {
      throw new Error('Table name or column name is not defined');
    }
    let excludeWhere = '';
    if (exclude) {
      excludeWhere = ` AND ${exclude} != '${args.object[exclude]}' `;
    }

    const dataExist = await this.client.$queryRawUnsafe(
      `SELECT EXISTS(SELECT 1 FROM ${tableName} WHERE ${column} = '${value}' ${excludeWhere} LIMIT 1)`,
    );
    return !dataExist[0].exists;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const field: string = validationArguments.property;
    return `${field} is already exist`;
  }
}
