REST API

Code here makes up the backend part of the project I reference in my personal statement. This program will simply request and respond JSON data, to view the front-end part of this project refer to my other repository. 

----------------------------------------------------------------------------------------------------------------------------------------

This API can be split into eight sections:

1) User 
2) Genre
3) Playlist
4) Post
5) Comment
6) SubComment
7) Post Vote
8) Comment Vote

Refer to routes.js to see the URIs that can interact with each section.

-/ EXAMPLE INTERACTION WITH A URI ENDPOINT /-

body data containing a valid: 

username
password
email
password 
firstname

sent to localhost:8080/u/CreateUser, will create a user in the database and you should get a response back welcoming you to Fuzzel (the name of the project). 

----------------------------------------------------------------------------------------------------------------------------------------

Note: you will need an API testing program such as Postman to send data to the URI endpoints.
Note: To examine what data needs to be sent to each URI endpoint refer to the folder called controllers then select the file with the section you wish to look at. 

~//- BE AWARE -//~ 
This repository is currently missing certain pieces of information that will stop the project from running 
like database access keys for security reasons. If you want to run this project for yourself you will need to set up your 
own session of MONGODB either locally or in the cloud as well as your own cloudinary account (this is where the non-text data is stored 
like pictures and songs). Then, once you've set these up, you should save the access keys as environment variables labelled as the following:

- CLOUDNAME 
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- MONGODB_PASSWORD

Please also examine *line 14* in app.js as you will additionally need to make sure that you are connecting to your own MONGODB session and not mine. 

If you have any issues please do not hesitate to message me and I will respond as quickly as I can!
