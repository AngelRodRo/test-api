# Test API REST

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
npm test
```
## API Reference

### Resources

#### User

    ----------------------------------------------------------------------------------------------
    |        Route       |       Description       |    Method    |       Observations           |
    ----------------------------------------------------------------------------------------------
    |   /api/users/       |     Create a new user   |     POST     |  Return a "token" for auth   |
    ----------------------------------------------------------------------------------------------
    |  /api/users/login  |     Login a user        |      POS     |  Return a "token" for auth   |
    ----------------------------------------------------------------------------------------------

#### Messages

    Authenticated routes need the following header :  { Authorization : token }
    ----------------------------------------------------------------------------------
    |        Route           |            Description            |  Method  |  Auth? | 
    ---------------------------------------------------------------------------------
    | /api/messages/         |  Return all messages              |   GET    |   No   | 
    ---------------------------------------------------------------------------------
    | /api/messages/:id/one  |  Get a message from authenticated |   GET    |   Yes  |
    |                        |   user                            |          |        |
    ---------------------------------------------------------------------------------
    | /api/messages/         |  Create a new message             |   POST   |  Yes   |
    ---------------------------------------------------------------------------------
    | /api/messages/sent     |  Return sent messages of          |   GET    |  Yes   |  
    |                        |  authenticated user               |          |        |
    ---------------------------------------------------------------------------------
    | /api/messages/receive  |  Return receive messages of       |   GET    |  Yes   |  
    |                        |  authenticated user               |          |        |
    ---------------------------------------------------------------------------------
    | /api/messages/:id      |  Update a message from            |   PUT    |  Yes   |  
    |                        |  authenticated user               |          |        |
    ---------------------------------------------------------------------------------
    | /api/messages/:id      |  Delete a message from            |  DELETE  |  Yes   |  
    |                        |  authenticated user               |          |        |
    ---------------------------------------------------------------------------------
    | /api/messages/:id/     |  Translate a message from origin  |   GET    |  No    |
    |    translate/:lang     |  lang to another lang             |          |        |
    ---------------------------------------------------------------------------------
    | /api/messages/:lang    |  List and count messages of a     |   GET    |  No    |
    |                        |  language such of user            |          |        |
    ---------------------------------------------------------------------------------

## Examples

- /api/messages/1/translate/es

    * lang : It's the code of language. 
        
        For example: 
            
            [en - English, es - Spanish]

        For more details visited: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes

## Considerations
- Do not forget to place the paths correctly, for example "/api/messages/" is not the same as "/api/messages". For reasons of time, it was not valid.
- For change the limit of messages for hour per user you must put in the console before execution:
    * export limit=< amount_hours > 
 
  For default is 5 messages for hour per user.
- Was extended data model of User for authentication. Added email and password.

## References

- More details about the API in the online documentation: https://angelrodro.github.io./. Please notice that here, there more details about headers, samples and another params. 
Credits to: http://apidocjs.com/
- Test the api: https://test-metro.herokuapp.com/api/
- Check the repo in github: https://github.com/AngelRodRo/test-api

Thank you! =)


