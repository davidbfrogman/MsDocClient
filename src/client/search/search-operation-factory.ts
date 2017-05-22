import { AttributeType, OperationType } from 'enumerations';
import { Attribute,  Operation } from 'models';
import { AttributeUtility } from 'utility';


// TODO: The Text in these operation's needs to be translated.
export class SearchOperationFactory {

  public getOperations(attribute: Attribute): Array<Operation> {
    attribute = AttributeUtility.mapAttributeTypeEnumeration(attribute);
    const searchOperations = new Array<Operation>();

    if (AttributeUtility.isValueset(attribute)) {
      searchOperations.push(
          this.findOperationByType(OperationType.EqualTo),
          this.findOperationByType(OperationType.NotEqual),
          this.findOperationByType(OperationType.Like),
          this.findOperationByType(OperationType.NotLike),
          this.findOperationByType(OperationType.HasValue),
          this.findOperationByType(OperationType.NoValue),
        );
        return searchOperations;
    }

    switch (attribute.attributeType) {
      case AttributeType.String:
      case AttributeType.Long:
      case AttributeType.Decimal:
      case AttributeType.Double:
      case AttributeType.MultiValue:
      case AttributeType.GUID:
        searchOperations.push(
          this.findOperationByType(OperationType.EqualTo),
          this.findOperationByType(OperationType.NotEqual),
          this.findOperationByType(OperationType.Like),
          this.findOperationByType(OperationType.NotLike),
          this.findOperationByType(OperationType.HasValue),
          this.findOperationByType(OperationType.NoValue),
        );
        break;
      case AttributeType.Date:
      case AttributeType.Time:
      case AttributeType.Timestamp:
        searchOperations.push(
          this.findOperationByType(OperationType.EqualTo),
          this.findOperationByType(OperationType.NotEqual),
          this.findOperationByType(OperationType.Before),
          this.findOperationByType(OperationType.After),
          this.findOperationByType(OperationType.BeforeOrEqual),
          this.findOperationByType(OperationType.AfterOrEqual),
        );
        break;
      case AttributeType.Boolean:
              searchOperations.push(
          this.findOperationByType(OperationType.True),
          this.findOperationByType(OperationType.False),
          this.findOperationByType(OperationType.HasValue),
          this.findOperationByType(OperationType.NoValue),
        );
        break;
    }

    return searchOperations;
  }

  public findOperationByType(operationType: OperationType): Operation {
    return Operation.standardSearchOperations.find((operation: Operation) => {
      return operation.operationType === operationType;
    });
  }
}
