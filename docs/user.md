# Create new user

```
mutation {
  upsertUserProfile (fields: {
    firstName: "test",
    lastName: "1",
    role: "realtor",
    phone: 3131321,
    brokerageName: "aaaaaaaaa"
  }){
    id
    email
    firstName
    lastName
    phone
    brokerageName
  }
}
```

# Search User with keyword

```
query {
  users(
    limit: 2, 
    offset: 0,
    sortBy: "firstName",
    searchText: "d") {
    items {
      fullName
      email
      phone
    }
    total
    hasMore
  }
}
```

# Remove user

```
mutation {
   removeUser(fields: {
    id: "1234",
  })
}
```

# Recover user
```
mutation {
   recoverUser(fields: {
    id: "123",
  })
}
```


# Check user disabled
```
query {
  checkDisabled(
  	email: "inactive@domain.com"
  )
}

or 

mutation {
  checkInactive(
  	email: "inactive@domain.com"
  )
}
```