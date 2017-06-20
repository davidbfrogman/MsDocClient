
import { ResultListConfig } from 'models';

export const ResultListConfigsData: ResultListConfig[] = [{
        name: 'MDS_File',
        'properties': {
            'property': [
                'MDS_Name',
                'MDS_Status',
                'prop:filename',
                'prop:size'
            ]
        },
        getJSON: () => {
            return 'Testing MDS_File';
        }
    }
];
