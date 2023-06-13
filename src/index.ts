import Fleet from './entities/Fleet';
import Offer from './entities/Offer';
import Parcel from './entities/Parcel';
import OffersJson from './offers.json';
import * as readline from 'readline';
import { CourierInput, FleetInput, OfferType, ParcelInput } from './types';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ofr001 = new Offer(OffersJson.offers[0] as OfferType);

const ofr002 = new Offer(OffersJson.offers[1] as OfferType);

const ofr003 = new Offer(OffersJson.offers[2] as OfferType);

const offers: Offer[] = [ofr001, ofr002, ofr003];

const parseCourierInput = (input: string): CourierInput => {
  const inputArr = input.split(' ');

  if (inputArr.length < 2) {
    throw new Error('Your courier input is invalid');
  }

  return {
    baseDeliveryCost: parseInt(inputArr[0]),
    noOfParcel: parseInt(inputArr[1])
  };
};

const parseParcelInput = (input: string): ParcelInput => {
  const inputArr = input.split(' ');

  if (inputArr.length < 4) {
    throw new Error('Your parcel input is invalid');
  }

  const offer = offers.find((offer) => offer.title === inputArr[3]);

  return {
    id: inputArr[0],
    weight: inputArr[1],
    distance: inputArr[2],
    offer
  };
};

const parseFleetInput = (input: string): FleetInput => {
  const inputArr = input.split(' ');

  if (inputArr.length < 3) {
    throw new Error('Your fleet input is invalid');
  }

  return {
    vehicleQty: parseInt(inputArr[0]),
    maxSpeed: parseInt(inputArr[1]),
    maxLoad: parseInt(inputArr[2])
  };
};

const isDeliveryTimeSkipped = (input: string): boolean => input === 'n';

const main = async () => {
  let parcels: Parcel[] = [];

  // Ask for base delivery cost and number of parcels
  const rawCourierInput = (await new Promise((resolve) =>
    rl.question('[baseDeliveryCost] [no. of parcel]', resolve)
  )) as string;
  const parsedCourierInput = parseCourierInput(rawCourierInput);

  const parcelInputs = Array.from(
    Array(parsedCourierInput.noOfParcel).keys()
  ).map(() => '[pkg_id] [pkg_weight] [pkg_distance] [offer]');

  // Ask for each package info: id, weight, distance and offer
  for (const parcelInput of parcelInputs) {
    const rawParcelInput = (await new Promise((resolve) =>
      rl.question(parcelInput, resolve)
    )) as string;

    const parsedParcelInput = parseParcelInput(rawParcelInput);

    parcels.push(
      new Parcel({
        id: parsedParcelInput.id,
        baseDeliveryCost: parsedCourierInput.baseDeliveryCost,
        weight: parseInt(parsedParcelInput.weight),
        distance: parseInt(parsedParcelInput.distance),
        offer: parsedParcelInput.offer
      })
    );
  }

  const toCalculateCostInput = (await new Promise((resolve) =>
    rl.question('Do you want to calculate each delivery cost? (y/n)', resolve)
  )) as string;
  const deliveryTimeSkipped = isDeliveryTimeSkipped(toCalculateCostInput);

  // Terminate cmd if intend to skip delivery time calculation
  if (deliveryTimeSkipped) {
    rl.close();
  } else {
    // Ask for number of vehicles, max speed and max carriable weight
    const rawFleetInput = (await new Promise((resolve) =>
      rl.question(
        '[no_of_vehicles] [max_speed] [max_carriable_weight]',
        resolve
      )
    )) as string;
    const parsedFleetInput = parseFleetInput(rawFleetInput);

    // Close input
    rl.close();

    const fleet = new Fleet({
      parcels,
      maxSpeed: parsedFleetInput.maxSpeed,
      maxLoad: parsedFleetInput.maxLoad,
      vehicleQty: parsedFleetInput.vehicleQty
    });
    parcels = fleet.start();
  }

  console.log(
    'Result:\n',
    parcels
      .map((parcel) => {
        const cost = parcel.calculateDeliveryCost();

        return `${parcel.id} ${cost.discount} ${cost.total} ${parcel.deliveryTime}`;
      })
      .join('\n')
  );
};

// const testMain = async () => {
//   const parcel1 = new Parcel({
//     id: 'pkg1',
//     weight: 50,
//     distance: 30,
//     baseDeliveryCost: 100
//   });

//   const parcel2 = new Parcel({
//     id: 'pkg2',
//     weight: 75,
//     distance: 125,
//     baseDeliveryCost: 100
//   });

//   const parcel3 = new Parcel({
//     id: 'pkg3',
//     weight: 175,
//     distance: 100,
//     baseDeliveryCost: 100
//   });

//   const parcel4 = new Parcel({
//     id: 'pkg4',
//     weight: 110,
//     distance: 60,
//     baseDeliveryCost: 100
//   });

//   const parcel5 = new Parcel({
//     id: 'pkg5',
//     weight: 155,
//     distance: 95,
//     baseDeliveryCost: 100
//   });

//   const fleet = new Fleet({
//     parcels: [parcel1, parcel2, parcel3, parcel4, parcel5],
//     maxSpeed: 70,
//     maxLoad: 200,
//     vehicleQty: 2
//   });

//   fleet.start();
// };

// testMain();

main();
