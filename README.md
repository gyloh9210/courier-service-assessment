# courier-service-assessment
## How to run
1. run `npm run start:dev`
2. first, it will prompt `[baseDeliveryCost] [no. of parcel]`. Please enter them respectively with a space in between.
3. then, it will prompt `[pkg_id] [pkg_weight] [pkg_distance] [offer]` based on how many number of parcel you have entered in last question.
4. next, it will prompt `Do you want to calculate each delivery cost? (y/n)`, which ask you whether want to calculate the delivery cost. (y = yes, n = no)
5. lastly, it will prompt `[no_of_vehicles] [max_speed] [max_carriable_weight]`.
6. the result will show in this format: `[pkgId] [discount] [cost] [deliveryTime]`. Eg: `pkg1 20 90 1.5`
7. if any input is invalid, an error will be shown: `Oops! Something went wrong. Please retry.`
## How to test
1. run `npm run test`
2. you can find the test files under `test/`
## Code architecture
1. `/index.ts` is where it will prompt for input
2. `/entities` is where all of the classes live
3. `/entities/Offer.ts` is a class of Offer. It validates rules and calculates a discount
4. `/entities/Parcel.ts` is a class of Parcel. It contains necessary attributes and calculates a delivery cost
5. `/entities/Fleet.ts` is a class of Fleet. It calculates a possible combination of parcel sets and calculate a delivery time with priorities of distance and weight.