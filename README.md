# spreddit

> The purpose of this project is for learning purposes only! 

In this back-end project, I attempted to replicate 'The front page of the Internet', Reddit. Users can sign up/log in, post content, and post comments on the content. Although I didn't hit all the requirements, I feel like I have a better understanding of how the back-end works. 

## Built With

* [PostgresQL](https://www.postgresql.org/) - Database used
* [Sequelize](http://docs.sequelizejs.com/) - Abstraction layer used to swap between database types
* [Handlebars](https://handlebarsjs.com/) - Used for the HTML templating
* [Bulma](https://bulma.io) - Used for the CSS framework
* [Passport.js](http://www.passportjs.org/) - Middleware for user authentication
* [Express](https://expressjs.com/) - Web framework used for routing
* [Express-session](https://www.npmjs.com/package/express-session) - Middleware for creating sessions

## Technical Requirements

Your application **must**:

- ~~You must use some form of HTML templating~~
  - ~~[handlebars](https://handlebarsjs.com/)~~
  
- ~~Your project must be able to swap between database types by using a config file.~~
 - ~~[Sequelize](http://docs.sequelizejs.com/)~~

- ~~Your project must support database [schema migrations](https://en.wikipedia.org/wiki/Schema_migration).~~

- ~~User actions should trigger [CR~~UD ~~operations](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) against the database.~~
  - ~~You must have at least **two** `<form>` submissions that insert or edit data in a database.~~

- Have at least one AJAX-based GET endpoint that powers a dynamic dropdown or type-ahead component
  - This part will require some client-side JavaScript
  - Example components:
    - http://autocompletejs.com/examples#2000
    - https://jqueryui.com/autocomplete/#remote

- ~~Have user authentication using [passport.js](http://www.passportjs.org/)~~
  - ~~must support at least one OAuth provider (Twitter, Facebook, GitHub, etc)~~
  - ~~must support passport.js "local strategy" backed with a database~~

- Your project must be hosted somewhere publicly reachable via `https`

- ~~Client-side JavaScript should be less than 200 lines of code.~~

- ~~Your project must have a `README.md` file written using [Markdown] with at least the following:~~
  - ~~Explanation of what the project is / what it does.~~
  - ~~What technologies you used.~~
  - ~~List of team members.~~

- Your repo must be connected to [Travis CI](https://travis-ci.org/):
  - You must have at least one test of an API endpoint that touches the database
  - This tutorial might be helpful: [Test Driven Development with Node](https://mherman.org/blog/test-driven-development-with-node/)
  - Put a build status badge in your `README.md` that links to your latest build
  - Hint: don't forget to test for [StandardJS]!

- ~~Code must follow some organization scheme.~~
  - ~~Break different parts of the code into different files / modules.~~
 
## Authors

* [**Audy Arandela**](https://github.com/aarandela)

## Acknowledgments

* Working alone has its pros and cons. Here are some:

  * Pros
    - Work on my own pace
    - No need to rely on others to finish to continue next steps and vice-versa
    - Know the code inside and out
  * Cons
    - Working alone.
    - Help is limited (even though I can ask others, its not the same as if it was a group)
    - Have to do all of the app myself, no distributing to others
