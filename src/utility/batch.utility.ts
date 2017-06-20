import { AppError, BatchOperation, Item } from 'models';
import { Translator } from 'services';

export class BatchUtility {

    /**
     * Returns true if batchOperations contains a BatchOperation with
     * an exception
     */
    public static containsException(batchOperations: BatchOperation[]): boolean {
        const exceptionsIndex = batchOperations.findIndex((value => {
          return value.exceptionMessage !== undefined;
        }));

        if (exceptionsIndex !== -1) {
          return true;
        }
        return false;
    }

    /**
     * Combines all exceptions in BatchOperations to create one error.
     * The items should be in the same order as the corresponding items in BatchOperations
     */
    public static createError(items: Item[], batchOperations: BatchOperation[], translator: Translator): AppError {
        let errorMessage: string = translator.translate(translator.constants.OPERATION_FAILED_FOR) + '\n';
        let errorDescription: string = '';
        for (let i = 0; i < batchOperations.length; i++) {
            if (batchOperations[i].exceptionMessage !== undefined) {
                if (items[i] && items[i].displayName) {
                    errorMessage += '\n' + items[i].displayName;
                }
                errorDescription += batchOperations[i].exceptionDetail + '\n';
            }
        }

        const error: AppError = new AppError(errorMessage);
        error.description = errorDescription;

        return error;
    }
}
