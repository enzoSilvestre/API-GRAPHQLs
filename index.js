const express = require("express");
const app = express();
const PORT = 6969;
const userData = require("./MOCK_DATA.json")
const graphql = require("graphql");
const {GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList} = graphql
const {graphqlHTTP} = require("express-graphql");
const { resolve } = require("path");

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLInt },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },

  })
})

const RootQuery = new GraphQLObjectType({
 name: "RootQueryType",
 fields: {
  getAllUsers:{
    type: new GraphQLList(UserType),
    args: {id: {type: GraphQLInt}},
    resolve(parent, args){
      return userData
    }
  },
  getUserByName:{
    type: UserType,
    args: {name: {type: GraphQLString}},
    resolve(parent,args){
    const userByName =  userData.filter((user) => user.firstName === args.name )
    return userByName[0];
    }
  }
 }
})
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields:{
    createNewUser:{
      type: UserType,
      args:{
        firstName: {type: GraphQLString},
        lastName: {type: GraphQLString},
        email: {type: GraphQLString},
        password: {type: GraphQLString}
      },
      resolve(parent,args){
         userData.push({id: userData.length + 1, firstName: args.firstName, lastName: args.lastName, email: args.email, password: args.password})
         return args
      }
    },
   updateUser:{
    type: UserType,
    args:{
      id: {type: GraphQLInt},
      firstName: {type: GraphQLString},
      lastName: {type: GraphQLString},
      email: {type: GraphQLString},
      password: {type: GraphQLString}
    },
    resolve(parent,args){
      const UserFiltered = userData.filter((user) => user.id == args.id)
      UserFiltered[0].firstName = args.firstName,
      UserFiltered[0].lastName = args.lastName,
      UserFiltered[0].email = args.email
      UserFiltered[0].password = args.password
      console.log(UserFiltered);
      return UserFiltered[0]
    }
   } 
  }
})

const schema  = new GraphQLSchema({
  query: RootQuery  ,
  mutation: Mutation
})

app.use("/graphql", graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(PORT, ()=>{
  console.log("Server is running")
})

