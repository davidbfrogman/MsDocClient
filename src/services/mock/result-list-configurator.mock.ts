import { Injectable } from '@angular/core';
import { ResultListConfigurator } from 'services';
import { ResultListConfigsData } from 'services/mock';

@Injectable()
export class ResultListConfiguratorMock extends ResultListConfigurator {
    public constructor() {
        super();
        this.setResultListConfig(ResultListConfigsData);
        return this;
    }
}
