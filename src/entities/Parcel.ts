import Offer from './Offer';

type DeliveryCost = {
  total: number;
  subtotal: number;
  discount: number;
};

class Parcel {
  id: string;
  weight: number;
  baseDeliveryCost: number;
  distance: number;
  offer: Offer | null;
  deliveryTime: string;

  constructor({
    id,
    weight,
    baseDeliveryCost,
    distance,
    offer = null,
    deliveryTime = ''
  }: {
    id: string;
    weight: number;
    baseDeliveryCost: number;
    distance: number;
    offer?: Offer | null;
    deliveryTime?: string;
  }) {
    this.id = id;
    this.weight = weight;
    this.baseDeliveryCost = baseDeliveryCost;
    this.distance = distance;
    this.offer = offer;
    this.deliveryTime = deliveryTime;
  }

  calculateDeliveryCost(): DeliveryCost {
    const deliveryCost =
      this.baseDeliveryCost + this.weight * 10 + this.distance * 5;

    if (!this.offer) {
      return {
        total: deliveryCost,
        subtotal: deliveryCost,
        discount: 0
      };
    }

    const discount = this.offer.calculateDiscount({
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

export default Parcel;
