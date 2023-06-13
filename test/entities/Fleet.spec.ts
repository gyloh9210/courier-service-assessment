import Fleet from '../../src/entities/Fleet';
import Parcel from '../../src/entities/Parcel';

describe('Fleet', () => {
  let fleet: Fleet;

  beforeAll(() => {
    fleet = new Fleet({
      parcels: [],
      maxSpeed: 70,
      maxLoad: 200,
      vehicleQty: 2
    });
  });

  describe('#findPossibleParcelSets', () => {
    it('should return a list of parcel sets which sum under a max load', () => {
      const parcels = [
        new Parcel({
          id: 'pkg1',
          weight: 50,
          distance: 30,
          baseDeliveryCost: 100
        }),
        new Parcel({
          id: 'pkg2',
          weight: 75,
          distance: 125,
          baseDeliveryCost: 100
        }),
        new Parcel({
          id: 'pkg3',
          weight: 175,
          distance: 100,
          baseDeliveryCost: 100
        })
      ];

      const result = fleet.findPossibleParcelSets(parcels, fleet.maxLoad);

      expect(result).toEqual([
        [
          new Parcel({
            id: 'pkg3',
            weight: 175,
            baseDeliveryCost: 100,
            distance: 100,
            offer: null,
            deliveryTime: ''
          })
        ],
        [
          new Parcel({
            id: 'pkg2',
            weight: 75,
            baseDeliveryCost: 100,
            distance: 125,
            offer: null,
            deliveryTime: ''
          })
        ],
        [
          new Parcel({
            id: 'pkg2',
            weight: 75,
            baseDeliveryCost: 100,
            distance: 125,
            offer: null,
            deliveryTime: ''
          }),
          new Parcel({
            id: 'pkg1',
            weight: 50,
            baseDeliveryCost: 100,
            distance: 30,
            offer: null,
            deliveryTime: ''
          })
        ],
        [
          new Parcel({
            id: 'pkg1',
            weight: 50,
            baseDeliveryCost: 100,
            distance: 30,
            offer: null,
            deliveryTime: ''
          })
        ]
      ]);
    });
  });

  describe('#sortByHeaviestWeight', () => {
    it('should return parcels in heaviest order', () => {
      const result = fleet.sortByHeaviestWeight([
        new Parcel({
          id: 'pkg1',
          weight: 100,
          baseDeliveryCost: 100,
          distance: 70
        }),
        new Parcel({
          id: 'pkg2',
          weight: 10,
          baseDeliveryCost: 100,
          distance: 70
        }),
        new Parcel({
          id: 'pkg3',
          weight: 50,
          baseDeliveryCost: 100,
          distance: 70
        })
      ]);

      expect(result).toEqual([
        {
          id: 'pkg1',
          weight: 100
        },
        {
          id: 'pkg3',
          weight: 50
        },
        {
          id: 'pkg2',
          weight: 10
        }
      ]);
    });
  });

  describe('#matchSetsByMaxload', () => {
    it('should return all sets which not exceed a given max load', () => {
      const result = fleet.matchSetsByMaxload({
        weights: [
          {
            id: 'pkg1',
            weight: 100
          },
          {
            id: 'pkg3',
            weight: 50
          }
        ],
        parcels: [
          new Parcel({
            id: 'pkg1',
            weight: 100,
            baseDeliveryCost: 100,
            distance: 70
          }),
          new Parcel({
            id: 'pkg3',
            weight: 50,
            baseDeliveryCost: 100,
            distance: 70
          })
        ],
        maxLoad: 150
      });

      expect(result).toEqual([
        [
          new Parcel({
            baseDeliveryCost: 100,
            deliveryTime: '',
            distance: 70,
            id: 'pkg1',
            offer: null,
            weight: 100
          })
        ],
        [
          new Parcel({
            baseDeliveryCost: 100,
            deliveryTime: '',
            distance: 70,
            id: 'pkg1',
            offer: null,
            weight: 100
          }),
          new Parcel({
            baseDeliveryCost: 100,
            deliveryTime: '',
            distance: 70,
            id: 'pkg3',
            offer: null,
            weight: 50
          })
        ],
        [
          new Parcel({
            baseDeliveryCost: 100,
            deliveryTime: '',
            distance: 70,
            id: 'pkg3',
            offer: null,
            weight: 50
          })
        ]
      ]);
    });
  });

  describe('#sortByPriority', () => {
    it('should return parcels in heaviest, with shortest distance and most parcels in a set', () => {
      const result = fleet.sortByPriority([
        [
          new Parcel({
            id: 'pkg3',
            weight: 100,
            baseDeliveryCost: 100,
            distance: 70
          }),
          new Parcel({
            id: 'pkg2',
            weight: 55,
            baseDeliveryCost: 100,
            distance: 30
          })
        ],
        [
          new Parcel({
            id: 'pkg5',
            weight: 155,
            baseDeliveryCost: 100,
            distance: 95
          })
        ]
      ]);

      expect(result).toEqual([
        [
          new Parcel({
            id: 'pkg3',
            weight: 100,
            baseDeliveryCost: 100,
            distance: 70,
            offer: null,
            deliveryTime: ''
          }),
          new Parcel({
            id: 'pkg2',
            weight: 55,
            baseDeliveryCost: 100,
            distance: 30,
            offer: null,
            deliveryTime: ''
          })
        ],
        [
          new Parcel({
            id: 'pkg5',
            weight: 155,
            baseDeliveryCost: 100,
            distance: 95,
            offer: null,
            deliveryTime: ''
          })
        ]
      ]);
    });
  });

  describe('#deduplicateParcelSets', () => {
    it('should return parcels which dont get repeated in other set', () => {
      const parcels = [
        new Parcel({
          id: 'pkg1',
          weight: 30,
          baseDeliveryCost: 100,
          distance: 20
        }),
        new Parcel({
          id: 'pkg2',
          weight: 55,
          baseDeliveryCost: 100,
          distance: 30
        }),
        new Parcel({
          id: 'pkg3',
          weight: 100,
          baseDeliveryCost: 100,
          distance: 70
        }),
        new Parcel({
          id: 'pkg5',
          weight: 155,
          baseDeliveryCost: 100,
          distance: 95
        })
      ];

      const parcelSets = [
        [
          new Parcel({
            id: 'pkg3',
            weight: 100,
            baseDeliveryCost: 100,
            distance: 70
          }),
          new Parcel({
            id: 'pkg2',
            weight: 55,
            baseDeliveryCost: 100,
            distance: 30
          })
        ],
        [
          new Parcel({
            id: 'pkg5',
            weight: 155,
            baseDeliveryCost: 100,
            distance: 95
          })
        ],
        [
          new Parcel({
            id: 'pkg1',
            weight: 155,
            baseDeliveryCost: 100,
            distance: 95
          }),
          new Parcel({
            id: 'pkg2',
            weight: 55,
            baseDeliveryCost: 100,
            distance: 30
          })
        ]
      ];

      const result = fleet.deduplicateParcelSets(parcelSets, parcels);

      expect(result).toEqual([
        [
          new Parcel({
            id: 'pkg3',
            weight: 100,
            baseDeliveryCost: 100,
            distance: 70
          }),
          new Parcel({
            id: 'pkg2',
            weight: 55,
            baseDeliveryCost: 100,
            distance: 30
          })
        ],
        [
          new Parcel({
            id: 'pkg5',
            weight: 155,
            baseDeliveryCost: 100,
            distance: 95
          })
        ]
      ]);
    });
  });

  describe('calculateDeliveryTime', () => {
    it('should return a delivery time for each parcel correctly', () => {
      const result = fleet.calculateDeliveryTime(
        [
          [
            new Parcel({
              id: 'pkg3',
              weight: 100,
              baseDeliveryCost: 100,
              distance: 70
            }),
            new Parcel({
              id: 'pkg2',
              weight: 55,
              baseDeliveryCost: 100,
              distance: 30
            })
          ],
          [
            new Parcel({
              id: 'pkg5',
              weight: 155,
              baseDeliveryCost: 100,
              distance: 95
            })
          ],
          [
            new Parcel({
              id: 'pkg1',
              weight: 30,
              baseDeliveryCost: 100,
              distance: 20
            })
          ]
        ],
        fleet.vehicleQty,
        fleet.maxSpeed
      );

      expect(result).toEqual([
        new Parcel({
          baseDeliveryCost: 100,
          deliveryTime: '2.28',
          distance: 20,
          id: 'pkg1',
          offer: null,
          weight: 30
        }),
        new Parcel({
          baseDeliveryCost: 100,
          deliveryTime: '0.42',
          distance: 30,
          id: 'pkg2',
          offer: null,
          weight: 55
        }),
        new Parcel({
          baseDeliveryCost: 100,
          deliveryTime: '1.00',
          distance: 70,
          id: 'pkg3',
          offer: null,
          weight: 100
        }),
        new Parcel({
          baseDeliveryCost: 100,
          deliveryTime: '1.35',
          distance: 95,
          id: 'pkg5',
          offer: null,
          weight: 155
        })
      ]);
    });
  });

  describe('#start', () => {
    it('should calculate an estimated delivery time for each parcel', () => {
      fleet.parcels = [
        new Parcel({
          id: 'pkg1',
          weight: 50,
          distance: 30,
          baseDeliveryCost: 100
        }),
        new Parcel({
          id: 'pkg2',
          weight: 75,
          distance: 125,
          baseDeliveryCost: 100
        }),
        new Parcel({
          id: 'pkg3',
          weight: 175,
          distance: 100,
          baseDeliveryCost: 100
        }),
        new Parcel({
          id: 'pkg4',
          weight: 110,
          distance: 60,
          baseDeliveryCost: 100
        }),
        new Parcel({
          id: 'pkg5',
          weight: 155,
          distance: 95,
          baseDeliveryCost: 100
        })
      ];

      const result = fleet.start();

      expect(result).toEqual([
        new Parcel({
          baseDeliveryCost: 100,
          deliveryTime: '3.98',
          distance: 30,
          id: 'pkg1',
          offer: null,
          weight: 50
        }),
        new Parcel({
          baseDeliveryCost: 100,
          deliveryTime: '1.78',
          distance: 125,
          id: 'pkg2',
          offer: null,
          weight: 75
        }),
        new Parcel({
          baseDeliveryCost: 100,
          deliveryTime: '1.42',
          distance: 100,
          id: 'pkg3',
          offer: null,
          weight: 175
        }),
        new Parcel({
          baseDeliveryCost: 100,
          deliveryTime: '0.85',
          distance: 60,
          id: 'pkg4',
          offer: null,
          weight: 110
        }),
        new Parcel({
          baseDeliveryCost: 100,
          deliveryTime: '4.19',
          distance: 95,
          id: 'pkg5',
          offer: null,
          weight: 155
        })
      ]);
    });

    afterAll(() => {
      fleet.parcels = [];
    });
  });
});
