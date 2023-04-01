type Operator = 'lt' | 'gt' | 'bt';
type Range = {
  from: number;
  to: number;
};
type Rule = {
  operator: Operator;
  threshold: number | Range;
};
type Rules = {
  weight: Rule;
  distance: Rule;
};

class Offer {
  rules: Rules;
  discount: number;

  constructor({ rules, discount }: { rules: Rules; discount: number }) {
    this.rules = rules;
    this.discount = discount;

    this.validateRules(rules.distance);
    this.validateRules(rules.weight);
  }

  validateRules(rule: Rule) {
    if (rule.operator === 'bt' && typeof rule.threshold !== 'object') {
      throw new Error('Invalid rule. You need to provide a range.');
    }
  }

  validateCriteria(given: number, discountRule: Rule) {
    if (
      discountRule.operator === 'gt' &&
      given >= (discountRule.threshold as number)
    ) {
      return true;
    }

    if (
      discountRule.operator === 'lt' &&
      given <= (discountRule.threshold as number)
    ) {
      return true;
    }

    if (discountRule.operator === 'bt') {
      const threshold = discountRule.threshold as Range;

      if (given >= threshold.from && given <= threshold.to) {
        return true;
      }
    }

    return false;
  }

  calculateDiscount({
    weight,
    distance,
    total
  }: {
    weight: number;
    distance: number;
    total: number;
  }): number {
    if (
      this.validateCriteria(weight, this.rules.weight) &&
      this.validateCriteria(distance, this.rules.distance)
    ) {
      return (total * this.discount) / 100;
    }

    return 0;
  }
}

export default Offer;
