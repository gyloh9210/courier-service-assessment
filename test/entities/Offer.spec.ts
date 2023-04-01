import Offer from '../../src/entities/Offer';

describe('Offer', function () {
  describe('#validateRule', function () {
    it('should return error if operator is between but given a number only', function () {
      try {
        new Offer({
          rules: {
            distance: {
              operator: 'bt',
              threshold: 10
            },
            weight: {
              operator: 'bt',
              threshold: {
                from: 10,
                to: 150
              }
            }
          },
          discount: 5,
          title: 'OFFER1'
        });
      } catch (err) {
        expect(err).toStrictEqual(
          new Error('Invalid rule. You need to provide a range.')
        );
      }
    });

    it('should return error if operator is greater than but given an object', () => {
      try {
        new Offer({
          rules: {
            distance: {
              operator: 'lt',
              threshold: 10
            },
            weight: {
              operator: 'gt',
              threshold: {
                from: 10,
                to: 150
              }
            }
          },
          discount: 5,
          title: 'OFFER01'
        });
      } catch (err) {
        expect(err).toStrictEqual(
          new Error('Invalid rule. You need to provide a number.')
        );
      }
    });
  });

  describe('#validateCriteria', function () {
    it('should return true if a given value is greater than a threshold', () => {
      const offer = new Offer({
        rules: {
          distance: {
            operator: 'gt',
            threshold: 10
          },
          weight: {
            operator: 'gt',
            threshold: 50
          }
        },
        discount: 5,
        title: 'OFFER02'
      });

      expect(offer.validateCriteria(10, offer.rules.distance)).toBeTruthy();
    });

    it('should return true if a given value is less than a threshold', () => {
      const offer = new Offer({
        rules: {
          distance: {
            operator: 'lt',
            threshold: 40
          },
          weight: {
            operator: 'gt',
            threshold: 50
          }
        },
        discount: 5,
        title: 'OFFER02'
      });

      expect(offer.validateCriteria(30, offer.rules.distance)).toBeTruthy();
    });

    it('should return true if a given value is in between thresholds', () => {
      const offer = new Offer({
        rules: {
          distance: {
            operator: 'bt',
            threshold: {
              from: 10,
              to: 20
            }
          },
          weight: {
            operator: 'gt',
            threshold: 50
          }
        },
        discount: 5,
        title: 'OFFER02'
      });

      expect(offer.validateCriteria(15, offer.rules.distance)).toBeTruthy();
    });

    it('should return false if a given value is not in between thresholds', () => {
      const offer = new Offer({
        rules: {
          distance: {
            operator: 'bt',
            threshold: {
              from: 40,
              to: 70
            }
          },
          weight: {
            operator: 'gt',
            threshold: 50
          }
        },
        discount: 5,
        title: 'OFFER02'
      });

      expect(offer.validateCriteria(10, offer.rules.distance)).toBeFalsy();
    });
  });

  describe('#calculateDiscount', () => {
    it('should discount 0 if criteria is not match', () => {
      const offer = new Offer({
        rules: {
          distance: {
            operator: 'gt',
            threshold: 10
          },
          weight: {
            operator: 'gt',
            threshold: 50
          }
        },
        discount: 5,
        title: 'OFFER02'
      });

      expect(
        offer.calculateDiscount({
          distance: 5,
          weight: 60,
          total: 10
        })
      ).toBe(0);
    });

    it('should discount 10 if criteria is matched', () => {
      const offer = new Offer({
        rules: {
          distance: {
            operator: 'gt',
            threshold: 10
          },
          weight: {
            operator: 'gt',
            threshold: 50
          }
        },
        discount: 5,
        title: 'OFFER02'
      });

      expect(
        offer.calculateDiscount({
          distance: 15,
          weight: 60,
          total: 100
        })
      ).toBe(5);
    });
  });
});
