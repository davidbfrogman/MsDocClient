import { Injectable } from '@angular/core';
import { ResultListConfig } from 'models';

@Injectable()
export class ResultListConfigurator {
    private static instance: ResultListConfigurator;
    private resultListConfigs: ResultListConfig[] = [];

    public static getInstance() {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }

    public constructor() { }

    public setResultListConfig(resultListConfigs: ResultListConfig[]): this {
        this.resultListConfigs = resultListConfigs;
        return this;
    }

    public getResultListConfigByEntityName(entityName: string): ResultListConfig {
        return this.resultListConfigs.find((resultListConfig: ResultListConfig) => {
            return resultListConfig.name === entityName;
        });
    }

    public getResultListConfig() {
        return this.resultListConfigs;
    }
}
