import Offer from './entities/Offer';

export type Operator = 'lt' | 'gt' | 'bt';

export type Range = {
  from: number;
  to: number;
};

export type Rule = {
  operator: Operator;
  threshold: number | Range;
};

export type Rules = {
  weight: Rule;
  distance: Rule;
};

export type DeliveryCost = {
  total: number;
  subtotal: number;
  discount: number;
};

export type Courier = {
  totalTimeTaken: number;
  id: number;
};

export type CourierInput = {
  baseDeliveryCost: number;
  noOfParcel: number;
};

export type ParcelInput = {
  id: string;
  weight: string;
  distance: string;
  offer?: Offer | undefined;
};

export type FleetInput = {
  vehicleQty: number;
  maxLoad: number;
  maxSpeed: number;
};

export type OfferType = {
  rules: Rules;
  discount: number;
  title: string;
};

export type OffersType = Array<OfferType>;
