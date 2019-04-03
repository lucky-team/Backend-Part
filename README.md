
# Hibernia-Sino API Documentation
**CONTENTS**

[TOC]

## Introduction

This document aims to provide a full-fledged documentation of Application Programming Interface (API) waiting for requests sent from front ends to the back end server.

## Models

### 1. Claim

```js
{
    type: {
        type: Number,
        validate: {
            validator: (val) => {
                return /^[1-3]$/.test(val)
            },
            message: 'level can only be 1, 2, or 3.'
        },
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Currency,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    files: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['accepted', 'rejected', 'processing', 'pending'],
        default: 'pending',
        required: true
    },
    insurance: {
        type: 'ObjectId',
        ref: 'Insurance',
        required: true
    },
    user: {
        type: 'ObjectId',
        ref: 'User',
        require: true
    },
    employee: {
        type: 'ObjectId',
        ref: 'User'
    }
}
```

### 2. User

```js
{
    employee: {
        type: Boolean,
        default: false
    },
    username: {
		tpye: String,
        required: true
    },
    password: {
        tpye: String,
        required: true
    }
}
```

### 3. Insured

```js
{
    lastname: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    socialId: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    bankAccount: {
        type: String,
        required: true
    },
    bankUsername: {
        type: String,
        required: true
    }
}
```

### 4. Insurance

```js
{
    plan: {
        type: Number,
        validate: {
            validator: (val) => {
                return /^[1-3]$/.test(val)
            },
            message: 'plan can only be 1, 2, or 3.'
        },
        required: true
    },
    level: {
        type: Number,
        validate: {
            validator: (val) => {
                return /^[1-3]$/.test(val)
            },
            message: 'level can only be 1, 2, or 3.'
        },
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        validate: {
            validator: (val) => {
                if (val % 30 == 0 && val != 0) {
                    return true;
                } else {
                    return false;
                }
            },
            message: 'duration can only be multiples of 30.'
        },
        required: true
    },
    expireDate: {
        type: Date,
        required: true
    },
    user: {
        type: 'ObjectId',
        ref: 'User'
    },
    insured: insured
}
```



## Application Programming Interface

### 1. User module

#### 1. Signup

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

```json
{
    "username": "user",
    "password": "pwd"
}
```

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

#### 2. Register Employee

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

```json
{
    "username": "user",
    "password": "pwd"
}
```

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

#### 3. Login

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

```json
{
    "username": "user",
    "password": "pwd"
}
```

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

### 2. Profile module


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

### 3. Insurances Module

#### 1. Get Insurances

**GET:**

```
/insurances[?<query string>]
```

**DESCRIPTION**

Authorized users are able to request a list of insurance policies **only they purchased**.

Employees are able to query any insurances.

**PARAMETER**

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
| insured._id | String | object id of the insured person |
| lastname | String | insured lastname |
| firstname | String | insured lastname |
| socialId | String | identification card number |
| gender | String | gender |
| age | Number | age |
| phone | String | format: [+area code] [phone number] |
| email | String | email address |
| bankUserName | String | user's name in the bank |
| bankAccount | String | account |
| bankName | String | name of bank |

**SUCCESS**

```json
HTTP/1.1 200 OK
[{
    "success": true,
    "insurances": [{
        "_id": "5c9a5f3223caa630803248c1",
        "plan": 2,
        "level": 3,
        "startDate": "2019-03-26T12:41:45.977Z",
        "duration": 30,
        "expireDate": "2019-04-05T12:41:45.977Z",
        "insured": {
            "_id": "5c9a5f3223caa630803248c2",
            "lastname": "Smith",
            "firstname": "Jobs",
            "socialId": "100101x12aw3f21waf",
            "gender": "male",
            "age": 21,
            "phone": "+86 12345678901",
            "email": "qwe.eqw@qw.asd",
            "bankName": "Bank of China",
            "bankAccount": "1435fw1a3f1wa",
            "bankUsername": "Smith Jobs",
            "createdAt": "2019-03-26T17:19:46.886Z",
            "updatedAt": "2019-03-26T17:19:46.886Z"
        },
        "createdAt": "2019-03-26T17:19:46.886Z",
        "updatedAt": "2019-03-26T17:19:46.886Z"
    }]
}]
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

#### 2. Create Insurances

**POST:**

```
/insurances
```

**DESCRIPTION**

Authorized users are able to create insurances.

Employees **cannot** do this method.

**BODY**

| Field |  Type  |            Description            |
| :---: | :----: | :-------------------------------: |
| plan  | Number |           type of plan            |
| level | Number |   level of the insurance policy   |
| startDate | String | ISO Date |
| duration | Number | how many days this policy is active |
| expireDate | Date | ISO Date |
| lastname | String | insured lastname |
| firstname | String | insured lastname |
| socialId | String | identification card number |
| gender | String | gender |
| age | Number | age |
| phone | String | format: [+area code] [phone number] |
| email | String | email address |
| bankUserName | String | user's name in the bank |
| bankAccount | String | account |
| bankName | String | name of bank |

```json
{
	"plan": 1,
	"level": 1,
	"startDate": "2019-03-26T12:41:45.977Z",
	"duration": 60,
	"expireDate": "2019-05-25T12:41:45.977Z",
	"insured": {
		"lastname": "Smith",
		"firstname": "Jobs",
		"socialId": "100101x12aw3f21waf",
		"gender": "male",
		"age": 21,
		"phone": "+86 12345678901",
		"email": "qwe.eqw@qw.asd",
		"bankName": "Bank of China",
		"bankAccount": "1435fw1a3f1wa",
		"bankUsername": "Smith Jobs"
	}
}
```

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
    "msg": "Insurance Creation Successful!"
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

#### 3. Delete Insurances

**Delete:**

```
/insurances[?<query string>]
```

**DESCRIPTION**

Employees are able to delete insurances.

**PARAMETER**

|    FIELD     |  Type  |    description     |
| :----------: | :----: | :----------------: |
|      n       | Number | match items count  |
|      ok      | Number | Success or Failure |
| deletedCount | Number |   deleted count    |

**SUCCESS**

```json
HTTP/1.1 200 OK
{
    "n": 1,
    "ok": 1,
    "deletedCount": 1
}
```

**FAILURE**

```json
HTTP/1.1 500 Internal Server Error
{
    "success": false,
    "err": "Internal Server Error"
}
```


### 4. Claim Module

#### 1. Get Claims

**GET:**

```
/claims[?<query string>]
```

**DESCRIPTION**

Authorized users are able to request a list of **claims of them**.

Employees are able to query any insurances.

**PARAMETER**

|    Field    |      Type      |           Description            |
| :---------: | :------------: | :------------------------------: |
|    _id    |     Number     |               object id of a claim                |
|  status   |     String     | ['accepted', 'rejected', 'processing', 'pending'] |
| type | String | [1, 2, 3] |
|   files   | List of String |                   path of files                   |
| location  |     String     |                 accident location                 |
|   date    |      Date      |                   accident date                   |
|  amount   |     Number     |                   claim amount                    |
|  reason   |     String     |                   claim reason                    |
|   user    |     String     |             object id of the claimer              |
| insurance |     String     |            object id of the insurance             |
| createdAt |      Date      |                     ISO date                      |
| updatedAt |      Date      |                     ISO date                      |

**SUCCESS**

```json
[{
    "files": ["1554290755783_100.jpg"],
    "status": "processing",
    "_id": "5c9f8b8f1caf490c40aa456f",
    "location": "Beijing",
    "date": "2019-03-26T15:32:02.230Z",
    "amount": 3000,
    "reason": "I want money",
    "insurance": "5c9a5f3223caa630803248c1",
    "user": "5c9a1e099d919727e86fd916",
    "employee": "5c9a45f189c84c2afc86114d",
    "createdAt": "2019-03-30T15:30:23.419Z",
    "updatedAt": "2019-03-30T15:30:23.419Z"
}]
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

#### 2. Create Claims

**POST:**

```
/claims
```

**DESCRIPTION**

Authorized users are able to request a list of **claims of them**.

Employees are able to query any insurances.

**BODY**

|    Field    |      Type      |           Description            |
| :---------: | :------------: | :------------------------------: |
| type | Number | [1, 2, 3] |
|    location    |     String     |             accident location |
|   date    |      Date      |                   accident date                   |
| amount | Number | claim amount |
| reason | String | claim reason |
| files | File | claim files |
| insurance |     String     |                 object id of the insurance                 |

```json
// form data
// key of files can be anything
{
	"type": 1,
    "location": "Beijing",
	"date": "2019-03-26T15:32:02.230Z",
	"amount": 3000,
	"reason": "I want money",
    "file_a": "file_a",
    "file_b": "file_a",
	"insurance": "5c9a5f3223caa630803248c1"
}
```

**SUCCESS**

```json
HTTP/1.1 200 OK
{
    "succuss": true,
    "msg": "Claim Creation Successful!"
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

#### 3. Delete Claims

**DELETE:**

```
/claims[?<query string>]
```

**DESCRIPTION**

Authorized users are able to delete **claims of them**.

Employees are able to delete any insurances.

**PARAMETER**

| Field |  Type  |    Description     |
| :---: | :----: | :----------------: |
|   n   | Number |   deleted amount   |
|  ok   | Number | Success or Failure |

**SUCCESS**

```json
HTTP/1.1 200 OK
{
    "n": 2,
    "ok": 1
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

#### 4. Assign a Claim

**GET:**

```
/claims/assign/:claimId
```

**DESCRIPTION**

Employees are able to assign a claim to himself.

**PARAMETER**

|  Field  |  Type   |    Description     |
| :-----: | :-----: | :----------------: |
| success | Boolean | Success or Failure |
|   msg   | String  |      message       |

**SUCCESS**

```json
HTTP/1.1 200 OK
{
    "success": true,
    "msg": "Claim Assignment Successful!"
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
HTTP/1.1 401 Unauthorized
{
    "err": {
        "name": "UnauthorizedError",
        "message": "Claim has been assigned to another employee"
    }
}
```

```json
HTTP/1.1 500 Internal Server Error
{
    "err": {
        "name": "ClaimNotPendingError",
        "message": "A claim cannot be assigned again"
    }
}
```

#### 5. Accept a Claim

**GET:**

```
/claims/accept/:claimId
```

**DESCRIPTION**

Employees are able to accept a claim which has been assigned to him.

**PARAMETER**

|  Field  |  Type   |    Description     |
| :-----: | :-----: | :----------------: |
| success | Boolean | Success or Failure |
|   msg   | String  |      message       |

**SUCCESS**

```json
HTTP/1.1 200 OK
{
    "success": true,
    "msg": "Claim Acception Successful!"
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
HTTP/1.1 401 Unauthorized
{
    "err": {
        "name": "UnauthorizedError",
        "message": "Claim has been assigned to another employee"
    }
}
```

```json
HTTP/1.1 500 Internal Server Error
{
    "err": {
        "name": "ClaimNotPendingError",
        "message": "A claim cannot be assigned again"
    }
}
```

#### 6. Reject a Claim

**GET:**

```
/claims/reject/:claimId
```

**DESCRIPTION**

Employees are able to reject a claim which has been assigned to him.

**PARAMETER**

|  Field  |  Type   |    Description     |
| :-----: | :-----: | :----------------: |
| success | Boolean | Success or Failure |
|   msg   | String  |      message       |

**SUCCESS**

```json
HTTP/1.1 200 OK
{
    "success": true,
    "msg": "Claim Rejection Successful!"
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
HTTP/1.1 401 Unauthorized
{
    "err": {
        "name": "UnauthorizedError",
        "message": "Claim has been assigned to another employee"
    }
}
```

```json
HTTP/1.1 500 Internal Server Error
{
    "err": {
        "name": "ClaimNotPendingError",
        "message": "A claim cannot be assigned again"
    }
}
```



