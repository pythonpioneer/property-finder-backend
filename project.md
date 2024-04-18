# Property Finder backend

## Database Structure

### User Database Structure and Required Storage Type

| USER |||| DATA TYPE |
|---|---|---|---|---|
_id |||| _id
name |||| String
email |||| String
password |||| String
userType |||| "owner/tenant"
likedProperties |||| [ _id, ... ]
contactNumber |||| String


### Property Database Structure and Required Storage Type

| USER |||| DATA TYPE |
|---|---|---|---|---|
_id |||| _id
user |||| { _id, name: String }
image |||| [ String, ... ]
desc |||| String
price |||| { monthlyRent, maintainanceCost, security, brokerage }
propertyType |||| "1/2/3/4/5 bhk"
furnishing |||| "full/semi/un"
preferredTenant |||| [ String, ... ] (bachelors, married, girls, boys, family, studio, couples)
area |||| Number
flooring |||| String
propertyAge |||| Number
location |||| String


## Requirements

### User

- Register User
- Login User
- Logout User
- Update User, include name, email and mobile
- Update User type
- Update Properties liked by user
  

### Property
- Add property
  - Required: image, desc, price, propertyType, furnishing, tenant, area, location
  - Optional: flooring, propertyAge
- Update property all fields
- Update other informatioin, includes flooring and propertyAge
- Add Image
- Delete Image
- Update Price


## REST API Design

### USER

| METHOD | ENDPOINT | DESCRIPTION |
|---|---|---|
| post | /user/register | To register user |
| post | /user/login | To login user |
| get | /user/ | To get the particular user |
| delete | /user/logout | To logout the user |
| patch | /user/contact | To update the user, includes name, email and mobile |
| patch | /user/type | To update the user type |
| patch | /user/:propertyId/like | To like property |
| get | /user/properties | To get the all properties liked by logged in user |


### PROPERTY

| METHOD | ENDPOINT | DESCRIPTION |
|---|---|---|
| post | /property/ | To add new property |
| get | /property/:propertyId | To get the particular property |
| put | /property/:propertyId | To update property |
| patch | /property/:propertyId/other | To update the flooring and age |
| patch | /property/:propertyId/price | To update the price |
| patch | /property/:propertyId/images | To add more images |
| delete | /property/:propertyId/ | To delete the property |
| get | /property/properties | To get all properties, listed by any user |
| get | /property/properties?owner=me | To fetch the all properties listed by logged in user |

