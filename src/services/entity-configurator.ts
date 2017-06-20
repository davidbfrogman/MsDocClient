import { Injectable } from '@angular/core';
import { Entity } from 'models';
import { EntityUtility } from 'utility';

@Injectable()
export class EntityConfigurator {
    private static instance: EntityConfigurator;
    private entities: Entity[] = [];

    public static getInstance() {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }

    public constructor() { }

    public setEntities(entities: Entity[]): this {
        this.entities = entities;
        this.entities.forEach((entity: Entity) => {
            EntityUtility.BuildComprehensiveAttributes(entity);
        });
        return this;
    }

    public getEntity(name: string): Entity {
        return this.entities.find((entity: Entity) => {
            return entity.name === name;
        });
    }

    public getEntities(): Entity[] {
        return this.entities;
    }
}
