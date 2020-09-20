import { createStore, signup, signupRandom } from "../../test-utils/sharedTest";
import { gCall } from "../../test-utils/gCall";
import { getRepository } from "typeorm";
import { Product } from "../../Entity/Product";

beforeAll(async () => {
  await signup();
  await createStore();
});
afterAll(async () => {
  const productRepository = getRepository(Product);
  const result = await productRepository.find();
  result.forEach(async (prod) => {
    await productRepository.delete(prod);
  });
});
const addProductSchema = `mutation addProduct($args: AddProductInput!){
  addProduct(args:$args){
    product{
      id
      store{
        id
      }
    }
  errors{
    field
    message
  }
  }
}`;
describe("testing for adding product", () => {
  it("should add a product if the user is logged in and owns the store", async () => {
    const result = await gCall({
      source: addProductSchema,
      variableValues: {
        args: {
          name: "the test item",
          description: "this is a test product",
          price: 4.99,
          stock: 1,
          storeId: 1,
        },
      },
      userId: 1,
    });
    expect(result.data!.addProduct.product.id).toBe("1");
    expect(result.data!.addProduct.product.store.id).toBe("1");
  });
  it("should not be able to add product if different user is logged in", async () => {
    await signupRandom();
    const result = await gCall({
      source: addProductSchema,
      variableValues: {
        args: {
          name: "the test item",
          description: "this is a test product",
          price: 4.99,
          stock: 1,
          storeId: 1,
        },
      },
      userId: 2,
    });
    expect(result.data!.addProduct.errors[0].field).toBe("authorization");
  });
  it("should not be able to add product if no user is logged in", async () => {
    const result = await gCall({
      source: addProductSchema,
      variableValues: {
        args: {
          name: "the test item",
          description: "this is a test product",
          price: 4.99,
          stock: 1,
          storeId: 1,
        },
      },
    });
    expect(result.errors![0].message).toBe(
      "Access denied! You don't have permission for this action!"
    );
  });
});
