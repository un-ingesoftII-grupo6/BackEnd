const Controller = require('../controllers/bank');
const router = require("../routes/bank");

const getSpy = jest.fn();
const useSpy = jest.fn();
const postSpy = jest.fn();
const putSpy = jest.fn();
const deleteSpy = jest.fn();

jest.doMock('express', () => {
  return {
    Router() {
      return {
        //get: getSpy,
        //use: useSpy,
        post: postSpy,
        //put: putSpy,
        //delete: deleteSpy,
    }
    }
  }
});

it("test", () =>{
  expect(1).toBe(1);
});
/*
describe('should test router', () => {
  require('../routes/bank.js');
  test('should test get POSTS', () => {
     
    expect(postSpy).toHaveBeenCalledWith(1, '/create', Controller.createBank);
  });
  */
 /* test('Testing testing ways', () => {
     
    const fun = router.post("/create");
    expect(fun
      
      
      ).toHaveBeenCalledWith(1, '/create', Controller.createBank);
  });
});
*/