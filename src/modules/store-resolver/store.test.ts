import { Store } from "../../Entity/Store";
import { getRepository } from "typeorm";
// import { testConn } from "../../test-utils/testconn";
import { gCall } from "../../test-utils/gCall";
// import { UnauthorizedError } from "type-graphql";
// import { Connection } from "typeorm";

const addStoreSchema = `mutation addStore($args: AddStoreInput!){
  addStore(args:$args){
    store{
    id
    storeName
    storeDescription
    user{
      id
      firstName
      lastName
      
    }
  }
  errors{
    field
    message
  }
  }
}`;
beforeEach(async () => {
  const store = getRepository(Store);
  const allStores = store.find();
  (await allStores).forEach(async (s) => {
    await store.remove(s);
  });
});
describe("store", () => {
  it("should add store if user is logged in", async () => {
    const result = await gCall({
      source: addStoreSchema,
      variableValues: {
        args: {
          storeName: "the testing store",
          storeDescription:
            "store made by john doe and jane doe sells tests to everyone",
        },
      },
      userId: 1,
    });
    const resData = result.data!.addStore.store;
    expect(resData.storeName).toEqual("the testing store");
    expect(resData.storeDescription).toEqual(
      "store made by john doe and jane doe sells tests to everyone"
    );
    expect(resData.user.id).toEqual("1");
  });
  it("should not add store if user is unauthorized", async () => {
    const result = await gCall({
      source: addStoreSchema,
      variableValues: {
        args: {
          storeName: "the testing store",
          storeDescription:
            "store made by john doe and jane doe sells tests to everyone",
        },
      },
    });
    const authorizationResult = result.errors!;
    expect(authorizationResult[0].message).toEqual(
      "Access denied! You need to be authorized to perform this action!"
    );
  });
  it("should not add store if arguements are invalid!", async () => {
    const result = await gCall({
      source: addStoreSchema,
      variableValues: {
        args: {
          storeName: "",
          storeDescription: "",
        },
      },
      userId: 1,
    });
    expect(result.data!.addStore.errors).toHaveLength(2);
    expect(result.data!.addStore.errors[0].field).toEqual("storeName");
    expect(result.data!.addStore.errors[1].field).toEqual("storeDescription");
  });
});
