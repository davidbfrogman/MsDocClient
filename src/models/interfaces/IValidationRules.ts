export interface ValidationRule {
  number?: ValidationRuleDefinition;
  time?: ValidationRuleDefinition;
  string?: ValidationRuleDefinition;
}

export interface ValidationRuleDefinition {
  check: (value) => {};
  message: string;
}
