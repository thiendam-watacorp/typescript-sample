### Create or update Connection realtor/buyer

```graphql
mutation {
  upsertConnection (fields: {
    userIdConnect: "Nvik9eIE3pZ2cWFP0ltmCXvVjnc2",
    status: "accepted"
  }){
    realtorId
    buyerID
    status
  }
}
```

### if buyer already have 1 connection need force to update

```graphql
mutation {
  upsertConnection (fields: {
    userIdConnect: "Nvik9eIE3pZ2cWFP0ltmCXvVjnc2",
    status: "accepted"
    force: true
  }){
    realtorId
    buyerID
    status
  }
}
```
### Mark/un-mark favorite connection buyerID/realtorID

```graphql
mutation {
  upsertConnection (fields: {
    userIdConnect: "Nvik9eIE3pZ2cWFP0ltmCXvVjnc2",
    favorite: "add" | "remove"
  }){
    realtorId
    buyerID
    favorited
    status
  }
}
```

### Delete a connection  buyerID/realtorID

```graphql
mutation {
  deleteConnection (realtorId: "Nvik9eIE3pZ2cWFP0ltmCXvVjnc2",
    buyerID: "mYPhtzpsoPdeMvg3moox16pHSli2")
}
```
