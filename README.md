
# Backend

Bixie challenge. It took roughly 4 hours to be developed.

I prefered to use document based DB because of the advatnage of using flexible patterns such polymorphic pattern, hence I didn't use ODM. (for many reasons most of the time I prefer not using ORM, ODM, QueryBuilders. Of course it mainly depeneds to the project situation)

## Installation

first install npm modules
```bash
npm i
```

## Usage

First, fill **development.env** or any other environmentName.env and set environment variables and do one of these options 

```bash
npm run dev-debug
npm run dev
npm run start
```


## Project Structure
    .
    ├── ...
    ├── root                       
    │   ├── config                             # .env files for different environments
    │   ├── controllers                        # controllers
    │   ├── dao                                # data access layers
    │   ├── routes                             # express routers, swagger definitions
    │   ├── tests                              # tests
    │   ├── utils                              # utilities
    │   │   ├── mongodb.js                     # mongodb database module 
    │   │   └── periodicSnapshotDownloader.js  # background service that periodically fetches data from mentioned APIs
    │   └── validation                         # schemas and validator
    │       ├── schema.js                      # schemas to generate validator 
    │       └── validator.js                   # validator function
    └── app.js                                 # express app





## Test
you have two options

```bash
npm run test-debug
npm run test
```


## Main Routes
postman collection is located in below file

```bash
Server running at http://localhost:8000
Swagger doc running at http://localhost:8000/api-docs
Stats running at http://localhost:8000/swagger-stats (only available with NODE_ENV=production)
```
