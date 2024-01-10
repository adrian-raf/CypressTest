Feature: End to end saucedemo web 

    Scenario: Checkout item 
        Given I open sauce demo page
        When I success Login with validate username & password
        Then Add 6 item to cart
        Then Check total price and complete the transaction