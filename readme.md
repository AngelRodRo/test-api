# Test MetroDigi API REST

## Installation

### Initialize project

After creation, your project should look like this:

```
npm install
npm start 
```

### Run seeders

```
npm run seed
```

## Tests

Describe and show how to run the tests with code examples.

### Run tests

```
npm run test
```
## API Reference

### Resources

#### User


            Route       |       Description       |    Method    |       Obs.                   |
    --------------------------------------------------------------------------------------------
    /api/users          |     Create a new user   |     POST     |  Return a "token" for auth   |
    --------------------------------------------------------------------------------------------
    /api/users/login    |     Login a user        |      POS     |  Return a "token" for auth   |
    ---------------------------------------------------------------------------------------------

#### Messages

    Authenticated routes need the following header :  { Authorization : token }

            Route               |         Description               |  Method  |  Auth? | 
    -------------------------------------------------------------------------------------
        /api/messages           |       Return all messages         |   GET    |   No   | 
    -------------------------------------------------------------------------------------
        /api/messages/:id       |  Get a message from authenticated |   GET    |   Yes  |
                                |   user                            |          |        |
    -------------------------------------------------------------------------------------
        /api/messages           |       Create a new message        |   POST   |  Yes   |
    -------------------------------------------------------------------------------------
        /api/messages/sent      |   Return sent messages of         |   GET    |  Yes   |  
                                |   authenticated user              |          |        |
    -------------------------------------------------------------------------------------
     /api/messages/receive      |   Return receive messages of      |   GET    |  Yes   |  
                                |   authenticated user              |          |        |
    -------------------------------------------------------------------------------------
     /api/messages/:id          |   Update a message from           |   PUT    |  Yes   |  
                                |   authenticated user              |          |        |
    -----------------------------------------------------------------------------------
     /api/messages/:id          |   Delete a message from           |  DELETE  |  Yes   |  
                                |   authenticated user              |          |        |
    -------------------------------------------------------------------------------------
     /api/messages/:id/         |  Translate a message from origin  |   GET    |  No    |
        translate/:lang         |  lang to another lang             |          |        |
    -------------------------------------------------------------------------------------
      /api/messages/:lang       | List and count messages of a      |   GET    |  No    |
                                | language such of user             |          |        |


## References

More details about it, check this: https://angelrodro.github.io./
Test my api : https://test-metro.herokuapp.com/api/
Check my github : 

Thanks you! =)


