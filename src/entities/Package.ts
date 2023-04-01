import Offer from './Offer';

type DeliveryCost = {
  total: number;
  subtotal: number;
  discount: number;
};

class Package {
  id: string;
  weight: number;
  baseDeliveryCost: number;
  distance: number;

  constructor({
    id,
    weight,
    baseDeliveryCost,
    distance
  }: {
    id: string;
    weight: number;
    baseDeliveryCost: number;
    distance: number;
  }) {
    this.id = id;
    this.weight = weight;
    this.baseDeliveryCost = baseDeliveryCost;
    this.distance = distance;
  }

  calculateDeliveryCost(offer?: Offer | null): DeliveryCost {
    const deliveryCost =
      this.baseDeliveryCost + this.weight * 10 + this.distance * 5;

    if (!offer) {
      return {
        total: deliveryCost,
        subtotal: deliveryCost,
        discount: 0
      };
    }

    const discount = offer.calculateDiscount({
      weight: this.weight,
      distance: this.distance,
      total: deliveryCost
    });

    return {
      total: deliveryCost - discount,
      subtotal: deliveryCost,
      discount
    };
  }
}

export default Package;
