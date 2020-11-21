const CarController = require('../carController');
const createTestCar = require('./cars.fixture');
const CarIdNotDefinedError = require('../../error/CarIdNotDefinedError');

const serviceMock = {
  save: jest.fn(),
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestCar(id + 1))),
  getById: jest.fn(id => createTestCar(id)),
  getCarsLength: jest.fn(() => 3),
  getLastCar: jest.fn(() => createTestCar(3)),
  delete: jest.fn(),
};

const uploadMock = {
  single: jest.fn(),
};

const reqMock = {
  params: { carId: 1 },
};
const resMock = {
  render: jest.fn(),
  redirect: jest.fn(),
};

const mockController = new CarController(serviceMock, uploadMock);

describe('CarController methods', () => {
  afterEach(() => {
    Object.values(serviceMock).forEach((mockFn) => mockFn.mockClear());
    Object.values(resMock).forEach((mockFn) => mockFn.mockClear());
  });

  test('configures routes for every method', () => {
    const app = {
      get: jest.fn(),
      post: jest.fn(),
    };
    mockController.configureRoutes(app);

    expect(app.get).toHaveBeenCalled();
    expect(app.post).toHaveBeenCalled();
    expect(uploadMock.single).toHaveBeenCalled();
  });

  test('index renders index.njk with overall data and last added car', async () => {
    const carsLength = serviceMock.getCarsLength();
    const lastAddedCar = serviceMock.getLastCar();
    await mockController.index(reqMock, resMock);

    expect(serviceMock.getCarsLength).toHaveBeenCalledTimes(2);
    expect(serviceMock.getLastCar).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('car/views/index.njk', {
      title: 'Rent a Car',
      carsLength,
      lastAddedCar,
    });
  });

  test('manage renders manage.njk with a list of cars', async () => {
    const cars = serviceMock.getAll();
    await mockController.manage(reqMock, resMock);

    expect(serviceMock.getAll).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('car/views/manage.njk', {
      title: 'Car List',
      cars,
    });
  });

  test('view renders view.njk with a single car and its reservations', async () => {
    const car = serviceMock.getById(1);
    await mockController.view(reqMock, resMock);

    expect(serviceMock.getById).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('car/views/view.njk', {
      title: 'Viewing Ford Fiesta 2017',
      car,
      reservations: car.reservations,
    });
  });

  test('view throws an error on undefined carId as argument', async () => {
    const reqMockWithoutCarId = {
      params: {},
    };

    await expect(mockController.view(reqMockWithoutCarId, resMock)).rejects.toThrowError(
      CarIdNotDefinedError
    );
  });

  test('edit renders a form to edit a car', async () => {
    const car = serviceMock.getById(1);
    await mockController.edit(reqMock, resMock);

    expect(serviceMock.getById).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('car/views/edit.njk', {
      title: 'Editing Ford Fiesta #1',
      car,
    });
  });

  test('edit throws an error on undefined carId as argument', async () => {
    const reqMockWithoutCarId = {
      params: {},
    };

    await expect(mockController.edit(reqMockWithoutCarId, resMock)).rejects.toThrowError(
      CarIdNotDefinedError
    );
  });

  test('add renders a form to add a new car', () => {
    mockController.add(reqMock, resMock);

    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('car/views/add.njk', {
      title: 'Add New Car',
    });
  });

  test('saves a car with a photo', async () => {
    const reqSaveMock = {
      body: {
        id: 1,
        brand: 'Ford',
        model: 'Fiesta',
        year: '2017',
        kms: '50000',
        color: 'Blue',
        ac: 'No',
        passengers: '5',
        transmission: 'Manual',
        price: '3000',
      },
      file: { path: '/public/img/no-image-available.jpg' },
    };

    await mockController.save(reqSaveMock, resMock);
    expect(serviceMock.save).toHaveBeenCalledTimes(1);
    expect(serviceMock.save).toHaveBeenCalledWith(createTestCar(1, false));
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  });

  test('saves a car without a photo', async () => {
    const reqSaveMock = {
      body: {
        id: 1,
        brand: 'Ford',
        model: 'Fiesta',
        year: '2017',
        kms: '50000',
        color: 'Blue',
        ac: 'No',
        passengers: '5',
        transmission: 'Manual',
        price: '3000',
      },
    };
    const carWithoutPhoto = createTestCar(1, false);
    carWithoutPhoto.img = undefined;

    await mockController.save(reqSaveMock, resMock);
    expect(serviceMock.save).toHaveBeenCalledTimes(1);
    expect(serviceMock.save).toHaveBeenCalledWith(carWithoutPhoto);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  });

  test('deletes an existing car', async () => {
    await mockController.delete(reqMock, resMock);

    expect(serviceMock.delete).toHaveBeenCalledTimes(1);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  });
});
