// Mock

const mockRedisGet = jest.fn(); // getのmock
const mockRedisScanStream = jest.fn(); // scanStreamのmock

jest.mock('../lib/redis', () => {
    return {
        getClient: jest.fn().mockImplementation(() => {
            return {
                get: mockRedisGet,
                scanStream: mockRedisScanStream
            };
        })
    };
});

