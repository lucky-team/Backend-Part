
# Hibernia-Sino API Documentation
**CONTENTS**

[TOC]

## Introduction

This document aims to provide a full-fledged documentation of Application Programming Interface (API) waiting for requests sent from front ends to the back end server.

## Application Programming Interface

### User module

#### Signup

**POST:**

```
/users/signup
```

**DESCRIPTION**

Sign up an user with username and password.

**BODY**

|  FIELD   |  Type  |   description   |
| :------: | :----: | :-------------: |
| username | String | user's username |
| password | String | user's password |

**PARAMETER**

|  FIELD  |  Type   |    description     |
| :-----: | :-----: | :----------------: |
| success | Boolean | Success or failure |
|   msg   | String  |  Detailed message  |

**SUCCESS**

```json
HTTP/1.1 200 OK
{
    "succuss": true,
    "msg": "Registration Successful!"
}
```

**FAILURE**

```json
HTTP/1.1 500 Internal Server Error
{
    "err": {
        "name": "UserExistsError",
        "message": "A user with the given username is already registered"
    }
}
```

#### Register Employee

**POST:**

```
/users/registerEmployee
```

**DESCRIPTION**

Sign up an employee with username and password.

**BODY**

|  FIELD   |  Type  |   description   |
| :------: | :----: | :-------------: |
| username | String | user's username |
| password | String | user's password |

**PARAMETER**

|  FIELD  |  Type   |    description     |
| :-----: | :-----: | :----------------: |
| success | Boolean | Success or failure |
|   msg   | String  |  Detailed message  |

**SUCCESS**

```json
HTTP/1.1 200 OK
{
    "succuss": true,
    "msg": "Registration Successful!"
}
```

**FAILURE**

```json
HTTP/1.1 500 Internal Server Error
{
    "err": {
        "name": "UserExistsError",
        "message": "A user with the given username is already registered"
    }
}
```

#### Login

**POST:**

```
/users/login
```

**DESCRIPTION**

Sign in an user with username and password. Server will send back a token for other operations that need authorization.

**BODY**

|  FIELD   |  Type  |   description   |
| :------: | :----: | :-------------: |
| username | String | user's username |
| password | String | user's password |

**PARAMETER**

|  FIELD  |  Type   |    description     |
| :-----: | :-----: | :----------------: |
| success | Boolean | Success or failure |
|   msg   | String  |  Detailed message  |
|  token  | String  |   json web token   |

**SUCCESS**

```json
HTTP/1.1 200 OK
{ 
    "success": true,
    "msg": "Login Successfully!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzlkOGQyM2UzZDE4MjZjOTE1YzJkOGIiLCJpYXQiOjE1NTM4MzA2MDcsImV4cCI6MTU1MzkxNzAwN30.M_BkuiEyEW8FpP4a7ghXHssIVdPTPvZYGEW2qLX745E"
}
```

**FAILURE**

```json
HTTP/1.1 401 Unauthorized
{
    "success": false,
    "msg": "Login Unsuccessfully!",
    "err": {
        "name": "IncorrectUsernameError",
        "message": "Password or username is incorrect"
    }
}
```

```json
HTTP/1.1 401 Unauthorized
{
    "success": false,
    "msg": "Login Unsuccessfully!",
    "err": {
        "name": "IncorrectPasswordError",
        "message": "Password or username is incorrect"
    }
}
```

```json
HTTP/1.1 500 Internal Server Error
{
    "success": false,
    "err": "Internal Server Error"
}
```


### Profile module


#### Get Users' Profiles

**GET:**

``` 
 /profiles[?[query string, such as 'lastname=Yao&city=Beijing']]
```

**DESCRIPTION**

Get a list of profiles of all users matched with the query string from database. Only employees are able to do this operation.

**SUCCESS**

|   Field   |  Type  |             Description             |
| :-------: | :----: | :---------------------------------: |
|    _id    | String |      object id of the profile       |
|  userId   | String |        object id of an user         |
| lastname  | String |           user's lastname           |
| firstname | String |          user's firstname           |
| socialId  | String |     identification card number      |
|  gender   | String |               gender                |
| age | Number | age |
|  country  | String |            country name             |
| province  | String |            province name            |
|   city    | String |              city name              |
|   phone   | String | format: [+area code] [phone number] |
|   email   | String |            email address            |
| createdAt |  Date  |              ISO Date               |
| updatedAt |  Date  |              ISO Date               |

```json
HTTP/1.1 200 OK
{
    "success": true,
    "profiles": [{
        "_id": "5c7e0af6a60cd62550b700a6",
        "userId": "5c7e0afaa60cd62550b700a7",
        "lastname": "Yao",
        "firstname": "Captain",
        "socialId": "123456197007011234",
        "gender": "male",
        "age": 20,
        "country": "China",
        "province": "Beijing",
        "city": "Beijing",
        "phone": "+86 18812345678",
        "email": "xxxx.xxxx@gmail.com",
        "createdAt": "2019-03-15T05:36:59.149Z",
        "updatedAt": "2019-03-15T08:24:53.215Z"
    }]
}
```

**FAILURE**

```json
HTTP/1.1 401 Unauthorized
{
    "success": false,
    "err": "Unauthorized User"
}
```

```json
HTTP/1.1 403 Forbidden
{
    "success": false,
    "err": "Forbidden Operation"
}
```

```json
HTTP/1.1 500 Internal Server Error
{
    "success": false,
    "err": "Internal Server Error"
}
```

#### Create A Profile

**POST:**

```
/profiles
```

**DESCRIPTION**

Create a profile from the body of requests. Provided to customers.

**PARAMETER**

| Field | Type | Description |
| :-----: | :----: | :-----------: |
| _id | String | object id of the profile |
| userId | String | object id of an user |
| lastname | String | user's lastname |
| firstname | String | user's firstname |
| socialId | String | identification card number |
| gender | String | gender |
| age | Number | age |
| country | String | country name |
| province | String | province name |
| city | String | city name |
| phone | String | format: +[area code] [phone number] |
| email | String | email address |
| createdAt | Date |              ISO Date               |
| updatedAt | Date |              ISO Date               |

**SUCCESS**

```json
HTTP/1.1 200 OK
{
    "success": true
}
```

**FAILURE**

```json
HTTP/1.1 401 Unauthorized
{
    "success": false,
    "err": "Unauthorized User"
}
```

```json
HTTP/1.1 403 Forbidden
{
    "success": false,
    "err": "Forbidden Operation"
}
```

```json
HTTP/1.1 409 Conflict
{
    "success": false,
    "err": "Conflict Information"
}
```

```json
HTTP/1.1 500 Internal Server Error
{
    "success": false,
    "err": "Internal Server Error"
}
```

#### Delete Profiles

**DELETE:**

```
/profiles[?[query string, such as 'lastname=Yao&city=Beijing']]
```

**DESCRIPTION**

Delete profiles of users matched with query string. Only employees are able to do this operation.

**SUCCESS**

```json
HTTP/1.1 200 OK
{
    "success": true,
    "counts": 5
}
```

**FAILURE**

```json
HTTP/1.1 401 Unauthorized
{
    "success": false,
    "err": "Unauthorized User"
}
```

```json
HTTP/1.1 403 Forbidden
{
    "success": false,
    "err": "Forbidden Operation"
}
```

```json
HTTP/1.1 500 Internal Server Error
{
    "success": false,
    "err": "Internal Server Error"
}
```

#### Get A Profile of A User

**GET:**

```
/profiles/:username
```

**DESCRIPTION**

Get a profile of a user matched with the username in params of the request.  Users only get their own profiles.

**SUCCESS**

| Field | Type | Description |
| :-----: | :----: | :-----------: |
| _id | String | object id of the profile |
| userId | String | object id of an user |
| lastname | String | user's lastname |
| firstname | String | user's firstname |
| socialId | String | identification card number |
| gender | String | gender |
| age | Number | age |
| country | String | country name |
| province | String | province name |
| city | String | city name |
| phone | String | format: +[area code] [phone number] |
| email | String | email address |
| createdAt | Date |              ISO Date               |
| updatedAt | Date |              ISO Date               |

```json
HTTP/1.1 200 OK
{
    "success": true,
    "profile": {
        "_id": "5c7e0af6a60cd62550b700a6",
        "userId": "5c7e0afaa60cd62550b700a7",
        "lastname": "Yao",
        "firstname": "Captain",
        "socialId": "123456197007011234",
        "gender": "male",
        "age": 20,
        "country": "China",
        "province": "Beijing",
        "city": "Beijing",
        "phone": "+86 18812345678",
        "email": "xxxx.xxxx@gmail.com",
        "createdAt": "2019-03-15T05:36:59.149Z",
        "updatedAt": "2019-03-15T08:24:53.215Z"
    }
}
```

**FAILURE**

```json
HTTP/1.1 401 Unauthorized
{
    "success": false,
    "err": "Unauthorized User"
}
```

```json
HTTP/1.1 403 Forbidden
{
    "success": false,
    "err": "Forbidden Operation"
}
```

```json
HTTP/1.1 500 Internal Server Error
{
    "success": false,
    "err": "Internal Server Error"
}
```

#### Update A Profile of A User

**PUT:**

```
/profiles/:username
```

**DESCRIPTION**

Update a profile of a user matched with the username in params of the request.  Users only get their own profiles.

**PARAMETER**

| Field | Type | Description |
| :-----: | :----: | :-----------: |
| _id | String | object id of the profile |
| userId | String | object id of an user |
| lastname | String | user's lastname |
| firstname | String | user's firstname |
| socialId | String | identification card number |
| gender | String | gender |
| age | Number | age |
| country | String | country name |
| province | String | province name |
| city | String | city name |
| phone | String | format: +[area code] [phone number] |
| email | String | email address |
| createdAt | Date |              ISO Date               |
| updatedAt | Date |              ISO Date               |

**SUCCESS**

```json
HTTP/1.1 200 OK
{
    "success": true
}
```

**FAILURE**

```json
HTTP/1.1 401 Unauthorized
{
    "success": false,
    "err": "Unauthorized User"
}
```

```json
HTTP/1.1 403 Forbidden
{
    "success": false,
    "err": "Forbidden Operation"
}
```

```json
HTTP/1.1 500 Internal Server Error
{
    "success": false,
    "err": "Internal Server Error"
}
```

### Insurances Module

#### Get Insurances of A User

**GET:**

```
/purchased_insurances
```

**DESCRIPTION**

Authorized user can request a list of insurance policies they purchased.

**SUCCESS**

| Field |  Type  |            Description            |
| :---: | :----: | :-------------------------------: |
|  _id  | String | object id of the insurance policy |
| plan  | Number |           type of plan            |
| level | Number |   level of the insurance policy   |
| startDate | String | ISO Date |
| duration | Number | how many days this policy is active |
| expireDate | Date | ISO Date |
| createdAt | Date |              ISO Date               |
| updatedAt | Date |              ISO Date               |
| insuredId | String | object id of the insured person |
| insuredName | String | insured name |
| socialId | String | identification card number |
| gender | String | gender |
| age | Number | age |
| phone | String | format: [+area code] [phone number] |
| email | String | email address |
| bankUserName | String | user's name in the bank |
| bankAccount | String | account |
| bankName | String | name of bank |

```json
HTTP/1.1 200 OK
{
    "success": true,
    "insurances": [{
        "_id": "5c7e0aefa60cd62550b700a5",
        "plan": 1,
        "level": 2,
        "startDate": "2019-03-015T05:36:54.810Z",
        "duration": 60,
        "expireDate": "2019-05-014T05:36:54.810Z",
        "createdAt": "2019-03-015T05:36:54.810Z",
        "updatedAt": "2019-03-015T05:36:54.810Z",
        "insuredId": "5c7e0aefa60cd62550b700a6",
        "insuredName": "Steve Jobs",
        "socialId": "123456197007011234",
        "gender": "male",
        "age": 20,
        "phone": "+86 18812345678",
        "email": "xxxx.xxxx@gmail.com",
        "backUserName": "Steve Jobs",
        "bankAccount": "xxxxxxxxxxxxxxxxx",
        "bankName": "Bank of China"
    }]
}
```

**FAILURE**

```json
HTTP/1.1 401 Unauthorized
{
    "success": false,
    "err": "Unauthorized User"
}
```

```json
HTTP/1.1 403 Forbidden
{
    "success": false,
    "err": "Forbidden Operation"
}
```

```json
HTTP/1.1 500 Internal Server Error
{
    "success": false,
    "err": "Internal Server Error"
}
```

### Claim Module

#### Get Claims

**GET:**

```
/claims
```

**DESCRIPTION**

Employees can get a list of claims.

**PARAMETER**

|    Field    |      Type      |           Description            |
| :---------: | :------------: | :------------------------------: |
|     _id     |     String     |      object id of the claim      |
| insuranceId | String | object id of the insurance claimed |
| accLocation |     String     |    accident happened location    |
|   accDate   |      Date      | ISO Date, accident happened date |
| claimAmount |    Currency    |           claim amount           |
| claimReason |     String     |           claim reason           |
| claimFiles  | List of String |  a list of path of claim files   |
|   status    |     String     |          accept, notAccept, processing, pending          |
| createdAt | Date |              ISO Date               |
| updatedAt | Date |              ISO Date               |

**SUCCESS**

```json
HTTP/1.1 200 OK
{
    "success": true,
    "claims": [{
        "_id": "5c7e0af6a60cd62550b700a6",
        "insuranceId": "5c7e0af6a60cd62550b700a6",
        "accLocation": "Dublin, Ireland",
        "accDate": "2019-03-12T05:36:59.149Z",
        "claimAmount": 23333,
        "claimReason": "I bought insurance. So you should pay the bill.",
        "claimFiles": ["/claims/creds.doc", "/claims/loo.png"],
        "status": "processing",
        "rejectReason": "(response if it is rejected)"
        "createdAt": "2019-02-12T05:36:59.149Z",
        "updatedAt": "2019-03-12T05:36:59.149Z"
    }]
}
```
**FAILURE**

```json
HTTP/1.1 401 Unauthorized
{
    "success": false,
    "err": "Unauthorized User"
}
```

```json
HTTP/1.1 403 Forbidden
{
    "success": false,
    "err": "Forbidden Operation"
}
```

```json
HTTP/1.1 500 Internal Server Error
{
    "success": false,
    "err": "Internal Server Error"
}
```

#### Create A Claim

**POST:**

```
/claims
```

**DESCRIPTION**

Authorized users are able to new a claim.

**PARAMETER**

|    Field    |      Type      |           Description            |
| :---------: | :------------: | :------------------------------: |
|     _id     |     String     |      object id of the claim      |
| insuranceId | String | object id of the insurance claimed |
| accLocation |     String     |    accident happened location    |
|   accDate   |      Date      | ISO Date, accident happened date |
| claimAmount |    Currency    |           claim amount           |
| claimReason |     String     |           claim reason           |
| claimFiles  | List of Files |  a list of claim files  |
| createdAt | Date |              ISO Date               |
| updatedAt | Date |              ISO Date               |

**SUCCESS**

```json
HTTP/1.1 200 OK
{
    "success": true,
    "claims": [{
        "_id": "5c7e0af6a60cd62550b700a6",
        "insuranceId": "5c7e0af6a60cd62550b700a6",
        "accLocation": "Dublin, Ireland",
        "accDate": "2019-03-12T05:36:59.149Z",
        "claimAmount": 23333,
        "claimReason": "I bought insurance. So you should pay the bill.",
        "claimFiles": ["/claims/creds.doc", "/claims/loo.png"]
        "createdAt": "2019-02-12T05:36:59.149Z",
        "updatedAt": "2019-03-12T05:36:59.149Z"
    }]
}
```
**FAILURE**

```json
HTTP/1.1 401 Unauthorized
{
    "success": false,
    "err": "Unauthorized User"
}
```

```json
HTTP/1.1 403 Forbidden
{
    "success": false,
    "err": "Forbidden Operation"
}
```

```json
HTTP/1.1 500 Internal Server Error
{
    "success": false,
    "err": "Internal Server Error"
}
```

