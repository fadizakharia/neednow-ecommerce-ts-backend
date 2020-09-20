import { User } from "../Entity/User";
import { getRepository } from "typeorm";
import { gCall } from "./gCall";
import * as faker from "faker";
const loginMutation = `mutation Login($data: SigninInput!){
  signin(data:$data){
    user{
    id
    firstName
    lastName
    email
  }
  errors{
    field
    message
  }
  }
  }`;
const registerMutation = `mutation Register($data: RegInput!){
    signup(data:$data){
        user{
        id
        firstName
        lastName
        email
      }
      errors
      {
        field
        message
      }
    }
    }`;
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
export const signup = async () => {
  return await gCall({
    source: registerMutation,
    variableValues: {
      data: {
        firstName: "test",
        lastName: "tester",
        email: "test@test.com",
        password: "testenvironment",
        age: 19,
      },
    },
  });
};
export const signupRandom = async () => {
  return await gCall({
    source: registerMutation,
    variableValues: {
      data: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        age: 19,
      },
    },
  });
};
export const clearUsers = async () => {
  const user = getRepository(User);
  const currentTestUser = await user.findOne({ where: { id: 1 } });
  if (currentTestUser) {
    await user.remove(currentTestUser);
  }
};
export const createStore = async () => {
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
  return result;
};
export const createSecondStore = async () => {
  const result = await gCall({
    source: addStoreSchema,
    variableValues: {
      args: {
        storeName: "the testing store",
        storeDescription:
          "store made by john doe and jane doe sells tests to everyone",
      },
    },
    userId: 2,
  });
  return result;
};
export const signin = async () => {
  return await gCall({
    source: loginMutation,
    variableValues: {
      data: {
        email: "test@test.com",
        password: "testenvironment",
      },
    },
  });
};
