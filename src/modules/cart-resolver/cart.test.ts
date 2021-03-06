import { gCall } from "../../test-utils/gCall";
import { createStore, signup, signupRandom } from "../../test-utils/sharedTest";
const getCartSchema = `query getCart{
  getCart{
    cart{
      id
      total
      item_product{
        id
        price
        quantity
        product{
          name
          description
        }
      }
    }
  }
}`;
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
const updateFromCartSchema = `mutation updateItemProduct($args:updateItemProductInput!){
  updateItemProduct(args:$args){
  cart{
    id
    total
    item_product{
      id
      quantity
      price
      product{
        id
        name
        price
      }
    }
   
  } 
  errors{
      field
      message
    }
}
}`;
const removeFromCartSchema = `mutation deleteFromCart($args:DeleteFromCartInput!){
  deleteFromCart(args:$args){
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
describe("deleting items from cart", () => {
  it("should not allow user to delete if user is not logged in", async () => {
    const result = await gCall({
      source: removeFromCartSchema,
      variableValues: { args: { itemProductId: 2 } },
    });
    expect(result.errors![0].message).toBe(
      "Access denied! You need to be authorized to perform this action!"
    );
  });
  it("should not be able to delete cart item if it is not in the current user's cart", async () => {
    const result = await gCall({
      source: removeFromCartSchema,
      variableValues: { args: { itemProductId: 2 } },
      userId: 1,
    });
    expect(result.data!.deleteFromCart.errors[0].field).toBe("authorization");
  });
  it("should delete item from cart", async () => {
    const result = await gCall({
      source: removeFromCartSchema,
      variableValues: { args: { itemProductId: 2 } },
      userId: 2,
    });

    expect(
      result.data!.deleteFromCart.cart.item_product.filter(
        (ip: any) => ip.id === 2
      )
    ).toHaveLength(0);
  });
});
describe("updating cart", () => {
  it("should not be able to update user cart item if user is unauthorized", async () => {
    const result = await gCall({
      source: updateFromCartSchema,
      variableValues: { args: { itemProductId: 3, quantity: 2 } },
    });
    expect(result.errors![0].message).toBe(
      "Access denied! You need to be authorized to perform this action!"
    );
  });
  it("should not be able to update user cart if arguements are invalid", async () => {
    const result = await gCall({
      source: updateFromCartSchema,
      variableValues: { args: { itemProductId: -1, quantity: -1 } },
      userId: 2,
    });

    expect(result.data!.updateItemProduct.errors[0].field).toBe(
      "itemProductId"
    );
    expect(result.data!.updateItemProduct.errors[1].field).toBe("quantity");
  });
  it("should not be able to update user cart item if it belongs to different user", async () => {
    const result = await gCall({
      source: updateFromCartSchema,
      variableValues: { args: { itemProductId: 3, quantity: 40 } },
      userId: 1,
    });
    expect(result.data!.updateItemProduct.errors[0].field).toBe(
      "authorization"
    );
  });
  it("should update user cart item", async () => {
    const result = await gCall({
      source: updateFromCartSchema,
      variableValues: { args: { itemProductId: 3, quantity: 10 } },
      userId: 2,
    });
    expect(result.data!.updateItemProduct.cart.item_product[1].quantity).toBe(
      10
    );

    expect(result.data!.updateItemProduct.errors).toBeNull();
  });
});
describe("getting user cart", () => {
  it("should not fetch user cart if user is unauthorized", async () => {
    const result = await gCall({ source: getCartSchema });
    expect(result.errors![0].message).toBe(
      "Access denied! You need to be authorized to perform this action!"
    );
  });
  it("should get the current user cart", async () => {
    const result = await gCall({ source: getCartSchema, userId: 2 });
    expect(result.data!.getCart.cart).not.toBeNull();
    expect(result.data!.getCart.cart.item_product).toHaveLength(2);
  });
});
