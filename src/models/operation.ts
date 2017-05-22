
import {AttributeType, OperationType}  from 'enumerations';
import { TranslationConstants } from '../constants';

export class Operation {
  constructor(public sign: string, public name: string, public operationType: OperationType) { }

  public static standardSearchOperations: Array<Operation> = [
      new Operation("= ", TranslationConstants.OPERATION_EQUAL, OperationType.EqualTo),
      new Operation("!= ", TranslationConstants.OPERATION_NOT_EQUAL, OperationType.NotEqual),
      new Operation("",  TranslationConstants.OPERATION_LIKE, OperationType.Like),
      new Operation("", TranslationConstants.OPERATION_NOT_LIKE, OperationType.NotLike),
      new Operation("< ", TranslationConstants.OPERATION_BEFORE, OperationType.Before),
      new Operation("> ", TranslationConstants.OPERATION_AFTER, OperationType.After),
      new Operation("<= ", TranslationConstants.OPERATION_BEFORE_EQUAL, OperationType.BeforeOrEqual),
      new Operation(">= ", TranslationConstants.OPERATION_AFTER_EQUAL, OperationType.AfterOrEqual),
      new Operation("", "True", OperationType.True),
      new Operation("", "False", OperationType.False),
      new Operation("", TranslationConstants.OPERATION_HAS_VALUE, OperationType.HasValue),
      new Operation("", TranslationConstants.OPERATION_NO_VALUE, OperationType.NoValue)
  ];
}
