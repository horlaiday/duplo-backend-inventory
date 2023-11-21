# duplo-backend-inventory

Non Technical requirement.

i , I assumed to be well briefed by the product owner,

ii, Clarify all the necessary questions and thoughts.

iii, Account user tables that link the Business and platform users.

iv, Assuming that when a users(departmental heads) login into the portal, the page has the Business details (like bussinesId etc)

v, This aforementioned businessID is expected to be sent along with orders when the user creates login to create the other details.



Technical details
-------------------

External api :  

/submit-order
/credit-score/{businessId}
/order-details/{businessId}

Internal api : 

/log-tax-details
/list-bussuness-details
/bussiness-orders-detail/{businessId}


Database:

bussiness_table
Order_table (businessID as fk)


Action Points
----------------

Below is a simplified outline of what will structure my application and define the required endpoints.

Creates orders from each business’s department lead:
Create a service that receives the incoming order request{body} (businessID, amount, date, and status) data and store it on MongoDB database
Parse the incoming order request (businessID, amount, date, and status) data and store it in the database.
Define an endpoint to receive orders from department leads.



credit score:
Provide an API endpoint for a business to get their credit score based on their specific businessID as path variable.
Create a service that query the required data (totalAmount & numberOfTransactions) from the database.
Implement logic to calculate credit scores based on the provided formulae : (creditScore = totalAmount / (numberOfTransactions * 100)).



orders details:
Provide an API endpoint to retrieve order details for a specific business taking businessID as path variable.
Create a service that query the MongoDB databases for the required information(Numbers of Transaction/order amount and Transactions count).
Implement logic to calculate the total number of orders, total amount of orders, total number of orders today, and total amount of orders today.




TODO
--------

Unit Test.



HOW TO RUN THE BACKEND APPLICATION
-------------------------------------

Kindly follow below steps TO START/RUN THE APP LOCALLY

Install docker on your machine

Go to app directory

RUN "docker-compose up". 

This will start the app on port 5050

BaseUrl = http://localhost:5050


POSTMAN COLLECTION 
-------------------------


postman endpoint : https://documenter.getpostman.com/view/3701162/2s9YeA8tLt
