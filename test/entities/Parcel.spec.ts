import Offer from '../../src/entities/Offer';
import Parcel from '../../src/entities/Parcel';

describe('Parcel', () => {
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
    discount: 10,
    title: 'OFFER01'
  });

  describe('#calculateDeliveryCost', () => {
    it('should discount 10 percent', () => {
      const testParcel = new Parcel({
        id: 'PKG1',
        weight: 60,
        distance: 500,
        baseDeliveryCost: 100,
        offer: tenPercentOffer
      });

      const costDetail = testParcel.calculateDeliveryCost();

      // equal to 10%
      expect(costDetail.subtotal / costDetail.discount).toBe(10);
    });

    it('should not discount if no offer is given', () => {
      const testParcel = new Parcel({
        id: 'PKG1',
        weight: 60,
        distance: 500,
        baseDeliveryCost: 100
      });

      const costDetail = testParcel.calculateDeliveryCost();

      expect(costDetail.discount).toBe(0);
    });

    it('should not discount if criteria is unmatched', () => {
      const testParcel = new Parcel({
        id: 'PKG1',
        weight: 30,
        distance: 100,
        baseDeliveryCost: 100
      });

      const costDetail = testParcel.calculateDeliveryCost();

      expect(costDetail.discount).toBe(0);
    });
  });
});
