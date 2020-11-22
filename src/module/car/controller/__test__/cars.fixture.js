const Car = require('../../entity/Car');

module.exports = function createTestCar(id, includeReservations = true) {
  return new Car(
    id,
    'Ford',
    'Fiesta',
    '2017',
    '50000',
    'Blue',
    'No',
    '5',
    'Manual',
    '3000',
    '/img/no-image-available.jpg',
    undefined,
    undefined,
    undefined,
    includeReservations ? Array.from({ length: 3 }, (reservationId) => {
      return {
        id: reservationId,
        carId: '1',
      };
    }) : undefined,
  );
};
