export default {
    setGenericPassword: jest.fn(),
    getGenericPassword: jest.fn(async() => { return false }),
};