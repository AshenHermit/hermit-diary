import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Property,
  PropertyTargetType,
} from 'src/database/entities/property.entity';
import { Repository } from 'typeorm';

export class PropertiesDto {
  @ApiProperty({
    type: 'object',
    additionalProperties: {
      oneOf: [
        { type: 'string' },
        { type: 'number' },
        { type: 'boolean' },
        { type: 'null' },
      ],
    },
    example: {
      color: 'blue',
      size: 42,
      isActive: true,
      note: null,
    },
  })
  properties: Record<string, string | number | boolean | null>;
}

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private propertiesRepository: Repository<Property>,
  ) {}

  async getEntitiesForTarget(targetType: PropertyTargetType, targetId: number) {
    const properties = await this.propertiesRepository.find({
      where: { targetType: targetType, targetId: targetId },
    });
    return properties;
  }

  async getEntitiesForMultipleTargets(
    targetType: PropertyTargetType,
    targetIds: number[],
  ) {
    const properties = await this.propertiesRepository
      .createQueryBuilder('prop')
      .where('prop.targetType = :targetType', { targetType })
      .andWhere('prop.targetId IN (:...targetIds)', { targetIds })
      .getMany();
    return properties;
  }

  async getPropertiesForTarget(
    targetType: PropertyTargetType,
    targetId: number,
  ): Promise<PropertiesDto> {
    const entities = await this.getEntitiesForTarget(targetType, targetId);
    const props: PropertiesDto = {
      properties: {},
    };

    entities.forEach((ent) => {
      props.properties[ent.key] = ent.value;
    });

    return props;
  }

  async getPropertiesForMultipleTargets(
    targetType: PropertyTargetType,
    targetIds: number[],
  ): Promise<Record<number, PropertiesDto>> {
    const entities = await this.getEntitiesForMultipleTargets(
      targetType,
      targetIds,
    );

    const props: Record<number, PropertiesDto> = {};

    targetIds.forEach((id) => {
      props[id] = { properties: {} };
    });

    entities.forEach((ent) => {
      props[ent.targetId].properties[ent.key] = ent.value;
    });

    return props;
  }

  async updatePropertiesForTarget(
    targetType: PropertyTargetType,
    targetId: number,
    props: PropertiesDto,
  ): Promise<boolean> {
    const entities = await this.getEntitiesForTarget(targetType, targetId);

    // remove duplicates if any
    const uniqKeys = new Set();
    for (let i = 0; i < entities.length; i++) {
      const ent = entities[i];
      if (uniqKeys.has(ent.key)) {
        await this.propertiesRepository.remove(ent);
      } else {
        uniqKeys.add(ent.key);
      }
    }

    // search in array util
    const searchEntity = (key: string) => {
      const search = entities.filter((x) => x.key == key);
      if (search.length == 0) return null;
      return search[0];
    };

    // updating or creating properties
    const keys = Object.keys(props.properties);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const propValue = props.properties[key];
      if (propValue === null) {
        const ent = searchEntity(key);
        if (ent) await this.propertiesRepository.remove(ent);
      } else {
        let ent = searchEntity(key);
        if (!ent) {
          ent = this.propertiesRepository.create({
            key: key,
            targetType: targetType,
            targetId: targetId,
          });
        }
        ent.value = propValue;
        await this.propertiesRepository.save(ent);
      }
    }

    return true;
  }

  async removePropertiesOfTarget(
    targetType: PropertyTargetType,
    targetId: number,
  ) {
    const properties = await this.getEntitiesForTarget(targetType, targetId);
    await this.propertiesRepository.remove(properties);
  }
}
