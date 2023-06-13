import { Courier } from '../types';
import Parcel from './Parcel';

class Fleet {
  parcels: Parcel[];
  maxSpeed: number;
  maxLoad: number;
  vehicleQty: number;

  constructor({
    parcels,
    maxSpeed,
    maxLoad,
    vehicleQty
  }: {
    parcels: Parcel[];
    maxSpeed: number;
    maxLoad: number;
    vehicleQty: number;
  }) {
    this.parcels = parcels;
    this.maxSpeed = maxSpeed;
    this.maxLoad = maxLoad;
    this.vehicleQty = vehicleQty;
  }

  // Sort parcels by heaviest order
  sortByHeaviestWeight(parcels: Parcel[]) {
    // Extract the weight attribute from each Parcel object and create a list of weights
    const weights: Pick<Parcel, 'weight' | 'id'>[] = parcels.map((parcel) => ({
      weight: parcel.weight,
      id: parcel.id
    }));

    // Sort the array in descending order
    weights.sort((a, b) => b.weight - a.weight);

    return weights;
  }

  // Iterate over the weights and find subsets that add up to the target sum
  matchSetsByMaxload({
    weights,
    parcels,
    maxLoad
  }: {
    weights: Pick<Parcel, 'weight' | 'id'>[];
    parcels: Parcel[];
    maxLoad: number;
  }) {
    // Initialize an empty array to store the subsets
    let subsets: Parcel[][] = [];

    for (let i = 0; i < weights.length; i++) {
      const newSubsets: Parcel[][] = [];
      const weight = weights[i].weight;
      const weightId = weights[i].id;

      for (let j = 0; j < subsets.length; j++) {
        const subset = subsets[j];
        let sum = 0;

        for (let k = 0; k < subset.length; k++) {
          const parcel = parcels.find(
            (parcel) => parcel.id === subset[k].id
          ) as Parcel;
          sum += parcel.weight;
        }

        if (sum + weight <= maxLoad) {
          newSubsets.push(
            subset.concat(
              parcels.find(
                (parcel) => parcel.weight === weight && parcel.id === weightId
              ) as Parcel
            )
          );
        }
      }

      // Add the new subsets to the existing list of subsets
      subsets = subsets.concat(newSubsets);

      // Add the current weight as an individual subset if it does not exceed the target sum
      if (weight <= maxLoad) {
        subsets.push([
          parcels.find(
            (parcel) => parcel.weight === weight && parcel.id === weightId
          ) as Parcel
        ]);
      }
    }

    return subsets;
  }

  // Find subsets that add up to the target sum and return an array of parcel sets
  findPossibleParcelSets(parcels: Parcel[], maxLoad: number): Parcel[][] {
    const weights = this.sortByHeaviestWeight(parcels);

    const subsets: Parcel[][] = this.matchSetsByMaxload({
      maxLoad,
      parcels,
      weights
    });

    // Filter out subsets that exceed the target sum and group the remaining subsets by Parcel objects
    const groupedSubsets: Parcel[][] = [];

    for (let i = 0; i < subsets.length; i++) {
      const subset = subsets[i];
      let sum = 0;

      for (let j = 0; j < subset.length; j++) {
        const parcel = parcels.find(
          (parcel) => parcel.id === subset[j].id
        ) as Parcel;
        sum += parcel.weight;
      }

      if (sum <= maxLoad) {
        groupedSubsets.push(subset);
      }
    }

    return groupedSubsets;
  }

  // Sort parcel sets by heaviest weight and shortest distance
  sortByPriority(parcelSets: Parcel[][]) {
    return parcelSets
      .sort((a, b) => {
        const aTotalWeight = a.reduce((acc, obj) => acc + obj.weight, 0);
        const bTotalWeight = b.reduce((acc, obj) => acc + obj.weight, 0);
        const aTotalDistance = a.reduce((acc, obj) => acc + obj.distance, 0);
        const bTotalDistance = b.reduce((acc, obj) => acc + obj.distance, 0);

        // If both weight are similar, take the shorter distance one
        if (aTotalWeight === bTotalWeight) {
          return aTotalDistance < bTotalDistance ? -1 : 1;
        } else {
          // Else, take the heaviest
          return aTotalWeight > bTotalWeight ? -1 : 1;
        }
      })
      .sort((a, b) => {
        // Prioritize the most amount of a parcel set. Eg: if set A has 2 parcels while set B has 4 parcels, will push set B to the top
        return b.length - a.length;
      });
  }

  // Deduplicate assigned parcels from a list
  deduplicateParcelSets(parcelSets: Parcel[][], availableParcels: Parcel[]) {
    let parcels = availableParcels;

    return parcelSets.filter((parcelSet) => {
      const originalParcelLength = parcels.length;

      // Return parcels which does not being included in a set of assigned parcels.
      // Eg: parcels = [a,b,c], parcelSet = [a,b], result = [c]
      const filterParcels = parcels.filter(
        (parcel) => !parcelSet.find((ps) => ps.id === parcel.id)
      );

      const filterParcelLength = filterParcels.length;

      // if parcels have been found in a parcel set, carry the remain forward
      if (originalParcelLength - filterParcelLength == parcelSet.length) {
        parcels = filterParcels;
        return true;
      }

      return false;
    });
  }

  // Calculate delivery time for each parcel
  calculateDeliveryTime(
    parcelSets: Parcel[][],
    vehicleQty: number,
    maxSpeed: number
  ) {
    // Initialize a number of courier with 0 totalTimeTaken
    let couriers: Courier[] = Array(vehicleQty)
      .fill(undefined)
      .map((c, index) => ({ id: index, totalTimeTaken: 0 }));

    for (let i = 0; i < parcelSets.length; i++) {
      // Take the smallest time as it will be available first
      const availableCourier = couriers.sort(
        (a, b) => a.totalTimeTaken - b.totalTimeTaken
      )[0];

      // Use it to add with next trip
      const lastTripTimeTaken = availableCourier.totalTimeTaken;

      for (let j = 0; j < parcelSets[i].length; j++) {
        const parcel = parcelSets[i][j];
        const deliveryTime =
          Math.floor((parcel.distance / maxSpeed) * 100) / 100;

        parcel.deliveryTime = (deliveryTime + lastTripTimeTaken).toFixed(2);

        // IMPORTANT NOTE: Take the longest time as a time for an entire route
        if (deliveryTime > availableCourier.totalTimeTaken) {
          availableCourier.totalTimeTaken = deliveryTime;
        }

        parcelSets[i][j] = parcel;
      }

      // Total time for return trip
      availableCourier.totalTimeTaken *= 2;

      // Update back a courier
      couriers = couriers.map((courier) => {
        if (courier.id == availableCourier.id) {
          return availableCourier;
        }

        return courier;
      });
    }

    // Flat parcel[][] to parcel[] and sort by id in asc
    return parcelSets.flat().sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    });
  }

  start(): Parcel[] {
    const parcelSets = this.findPossibleParcelSets(this.parcels, this.maxLoad);

    const parcelSetsByHeaviest = this.sortByPriority(parcelSets);

    const finalizedParcelSets = this.deduplicateParcelSets(
      parcelSetsByHeaviest,
      this.parcels
    );

    const parcelsWithDeliveryTime = this.calculateDeliveryTime(
      finalizedParcelSets,
      this.vehicleQty,
      this.maxSpeed
    );

    return parcelsWithDeliveryTime;
  }
}

export default Fleet;
