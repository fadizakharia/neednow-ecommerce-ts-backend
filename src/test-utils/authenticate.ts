import { gCall } from "./gCall";

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
