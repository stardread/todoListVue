const mockRepository = {
    find: jest.fn(),
    insertOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  };
  
  export const createDataSource = jest.fn(() => ({
    initialize: jest.fn().mockResolvedValue(undefined),
    destroy: jest.fn().mockResolvedValue(undefined),
    getMongoRepository: jest.fn().mockReturnValue(mockRepository),
  }));
  
  export { mockRepository };
  