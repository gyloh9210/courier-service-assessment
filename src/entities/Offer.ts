import { Rules, Rule, Range } from '../types';
class Offer {
  rules: Rules;
  title: string;

  /**
   * Discount Percentage
   */
  discount: number;

  constructor({
    rules,
    discount,
    title
  }: {
    rules: Rules;
    discount: number;
    title: string;
  }) {
    this.rules = rules;
    this.discount = discount;
    this.title = title;

    this.validateRules(rules.distance);
    this.validateRules(rules.weight);
  }

  validateRules(rule: Rule) {
    if (rule.operator === 'bt' && typeof rule.threshold !== 'object') {
      throw new Error('Invalid rule. You need to provide a range.');
    }

    if (rule.operator !== 'bt' && typeof rule.threshold !== 'number') {
      throw new Error('Invalid rule. You need to provide a number.');
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
