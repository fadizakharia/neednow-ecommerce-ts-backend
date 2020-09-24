import { gCall } from "../../test-utils/gCall";
import { createStore, signup, signupRandom } from "../../test-utils/sharedTest";

const addToCartSchema = `mutation addToCart($args:AddToCartInput!){
  addToCart(args:$args){
    cart{
      id
      total
      item_product{
          id
          quantity
          price
          product{
            name
            description
          }
      }
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
beforeAll(async () => {
  await signup();
  await signupRandom();
  await createStore();
  await gCall({
    source: addProductSchema,
    variableValues: {
      args: {
        name: "the test item",
        description: "this is a test product",
        price: 4.99,
        stock: 100,
        storeId: 1,
      },
    },
    userId: 1,
  });
  await gCall({
    source: addProductSchema,
    variableValues: {
      args: {
        name: "the test item",
        description: "this is a test product",
        price: 9.99,
        stock: 100,
        storeId: 1,
      },
    },
    userId: 1,
  });
  await gCall({
    source: addProductSchema,
    variableValues: {
      args: {
        name: "the test item",
        description: "this is a test product",
        price: 9.99,
        stock: 100,
        storeId: 1,
      },
    },
    userId: 1,
  });
});

describe("adding items to cart", () => {
  it("should not add item to cart if arguements are invalid", async () => {
    const result = await gCall({
      source: addToCartSchema,
      variableValues: { args: { productId: 1, quantity: -1 } },
      userId: 2,
    });
    expect(result.data!.addToCart.errors[0].field).toBe("quantity");
  });
  it("should not add items to cart if user is unauthorized", async () => {
    const result = await gCall({
      source: addToCartSchema,
      variableValues: { args: { productId: 1, quantity: -1 } },
    });
    expect(result.errors![0].message).toBe(
      "Access denied! You need to be authorized to perform this action!"
    );
  });
  it("should not add items to cart if requested quantity is larger than stock", async () => {
    const result = await gCall({
      source: addToCartSchema,
      variableValues: { args: { productId: 3, quantity: 50 } },
      userId: 2,
    });

    expect(result.data!.addToCart.cart.item_product).toHaveLength(1);
    const result2 = await gCall({
      source: addToCartSchema,
      variableValues: { args: { productId: 3, quantity: 51 } },
      userId: 2,
    });
    expect(result2.data!.addToCart.errors[0].field).toBe("quantity");
  });
  it("should add items to cart", async () => {
    const result = await gCall({
      source: addToCartSchema,
      variableValues: { args: { productId: 1, quantity: 20 } },
      userId: 2,
    });

    expect(result.data!.addToCart.cart.item_product).toHaveLength(2);
    const result2 = await gCall({
      source: addToCartSchema,
      variableValues: { args: { productId: 1, quantity: 20 } },
      userId: 2,
    });

    expect(result2.data!.addToCart.cart.item_product).toHaveLength(2);

    const result3 = await gCall({
      source: addToCartSchema,
      variableValues: { args: { productId: 2, quantity: 20 } },
      userId: 2,
    });
    expect(result3.data!.addToCart.cart.item_product).toHaveLength(3);
  });
});

describe("getting user cart", () => {
  it("should not fetch user cart if user is unauthorized", () => {});
  it("should get the current user cart", () => {});
});
