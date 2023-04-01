import Offer from '../../src/entities/Offer';
import Package from '../../src/entities/Package';

describe('Package', () => {
  const tenPercentOffer = new Offer({
    rules: {
      distance: {
        operator: 'gt',
        threshold: 200
      },
      weight: {
        operator: 'bt',
        threshold: {
          from: 50,
          to: 150
        }
      }
    },
    discount: 10
  });

  describe('#calculateDeliveryCost', () => {
    it('should discount 10 percent', () => {
      const testPackage = new Package({
        id: 'PKG1',
        weight: 60,
        distance: 500,
        baseDeliveryCost: 100
      });

      const costDetail = testPackage.calculateDeliveryCost(tenPercentOffer);

      // equal to 10%
      expect(costDetail.subtotal / costDetail.discount).toBe(10);
    });

    it('should not discount if no offer is given', () => {
      const testPackage = new Package({
        id: 'PKG1',
        weight: 60,
        distance: 500,
        baseDeliveryCost: 100
      });

      const costDetail = testPackage.calculateDeliveryCost();

      expect(costDetail.discount).toBe(0);
    });

    it('should not discount if criteria is unmatched', () => {
      const testPackage = new Package({
        id: 'PKG1',
        weight: 30,
        distance: 100,
        baseDeliveryCost: 100
      });

      const costDetail = testPackage.calculateDeliveryCost();

      expect(costDetail.discount).toBe(0);
    });
  });
});
