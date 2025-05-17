import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type PropertyValueType = 'string' | 'number' | 'boolean';
export type PropertyTargetType = 'note' | 'diary';

@Entity()
export class Property {
  @ApiProperty({ example: 1, description: 'id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'some_property',
    description: 'code name of property',
  })
  @Column()
  key: string;

  @Column({ type: 'enum', enum: ['string', 'number', 'boolean'] })
  valueType: PropertyValueType;

  @Column({ type: 'varchar', nullable: true })
  valueString: string | null;

  @Column({ type: 'float', nullable: true })
  valueNumber: number | null;

  @Column({ type: 'boolean', nullable: true })
  valueBoolean: boolean | null;

  @Column({ type: 'enum', enum: ['note', 'diary'] })
  targetType: PropertyTargetType;

  @Column()
  targetId: number;

  get value(): string | number | boolean | null {
    switch (this.valueType) {
      case 'string':
        return this.valueString;
      case 'number':
        return this.valueNumber;
      case 'boolean':
        return this.valueBoolean;
      default:
        return null;
    }
  }

  set value(val: string | number | boolean) {
    if (typeof val === 'string') {
      this.valueType = 'string';
      this.valueString = val;
      this.valueNumber = null;
      this.valueBoolean = null;
    } else if (typeof val === 'number') {
      this.valueType = 'number';
      this.valueNumber = val;
      this.valueString = null;
      this.valueBoolean = null;
    } else if (typeof val === 'boolean') {
      this.valueType = 'boolean';
      this.valueBoolean = val;
      this.valueString = null;
      this.valueNumber = null;
    } else {
      throw new Error('Unsupported value type');
    }
  }
}
