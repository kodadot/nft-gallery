# E2E Tests

-

### How to Run

- Inside terminal  `cd tests`
- run `npx cypress open`
- Dialog with the open than click on the test to run.

## How to Run test Headlessly

- Inside terminal  `npx cypress run`

## Test Plan

 *Objective* - Create a suite of smoke and regression tests for the application. The tests should be written in a way that they can be run in any order. The tests imitates the user actions and verifies the results.

*Test Cases* - Test cases are written in the form of a test suite. Each test suite is a collection of test cases per page or feature.

- Create
  - Simple Mint - Create a simple mint transaction.
  - Classic Mint - Create a classic mint transaction.
- Explore
  - Collection => `tests/cypress/integration/e2e/collection.spec.js` 

            Feature: Collection Page should display the various collections and their details. Also it should display the collection's image and allow filtering, Search, Buy Now, Page Navigation and Random. 

            Scenario: Filter by New First. 
                Given a user is on the Collection page. 
                When the user clicks on the New First filter. 
                Then the user should see the collections in the New First order.
            Scenario: Filter by Old First.
                Given a user is on the Collection page. 
                When the user clicks on the Old First filter. 
                Then the user should see the collections in the Old First order.
            Scenario: Filter by Last Interacted
                Given a user is on the Collection page. 
                When the user clicks on the Last Interacted filter. 
                Then the user should see the collections in the Last Interacted order.
            Scenario: Filter by Long time no interaction
                Given a user is on the Collection page. 
                When the user clicks on the Long time no interaction filter. 
                Then the user should see the collections in the Long time no interaction order.
            Scenario: Filter by From most expensive 
                Given a user is on the Collection page. 
                When the user clicks on the From most expensive filter. 
                Then the user should see the collections in the From most expensive order.
            Scenario: Filter by From cheaper 
                Given a user is on the Collection page. 
                When the user clicks on the From cheaper filter. 
                Then the user should see the collections in the From cheaper order. 
            Scenario: Collection Search 
                Given a user is on the Collection page. 
                When the user enters a search term in the search box. 
                Then the user should see the collections that match the search term.
            Scenario: Collection Buy Now
                Given a user is on the Collection page. 
                When the user clicks on the Buy Now button. 
                Then the user should be redirected to the Buy Now page. 
            Scenario: Collection Page Navigation
                Given a user is on the Collection page. 
                When the user clicks on the Next button. 
                Then the user should be redirected to the next page.  
            Scenario: Collection Random
                Given a user is on the Collection page. 
                When the user clicks on the Random button. 
                Then the user should be redirected to a random page.
                
    [X] Completed - https://watch.screencastify.com/v/FlZzYMz7YpocLu9ZCSwg
  

  - Gallery
- Stats
  - Spotlight
  - Series
- RMRK
  - Statemine
  - Westmine
- Change Language
  - English
  - French
  - Spanish
- Login
- Search
- Mobile
