import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { TestingModule } from 'testing';
import { TranslatePipe } from 'pipes/translate.pipe';
import { inject } from '@angular/core/testing';

describe('Translate Pipe', () => {
    let pipe: TranslatePipe;

    beforeAll(() => {
        TestBed.configureTestingModule({
            imports: [
                TestingModule
            ],
            providers: [
                TranslatePipe
            ]
        });
    });

    beforeAll(inject([TranslatePipe], translatePipe => {
        pipe = translatePipe;
    }));

    it('should create the component', () => {
        expect(pipe).toBeTruthy();
    });

    it('Should translate a known key', () => {
        const key = 'AnnotationsLoading';
        const translated: string = pipe.transform(key);
        expect(translated).toEqual('Loading ...');
    });
});
