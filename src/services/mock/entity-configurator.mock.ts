import { Injectable } from '@angular/core';
import { Entity } from 'models';
import { EntityUtility } from 'utility';
import { EntityConfigurator } from 'services';
import { EntityData } from './mock-data/entity';

@Injectable()
export class EntityConfiguratorMock extends EntityConfigurator {
    public constructor() {
        super();
        this.setEntities([EntityData, EntityData, EntityData]);
        return this;
    }
}
