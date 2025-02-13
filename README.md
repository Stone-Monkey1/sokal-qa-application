How to get the project on your computer:

1. Open the console in VSCode.
2. Run "git clone https://github.com/Stone-Monkey1/sokal-qa-application.git"
3. Go back into the terminal and navigate into the repository you just cloned by typing "cd sokal-qa-application"
4. Now, you need to download the package dependencies.
5. while still in your sokal-qa-application file, you'll need to "cd frontend" this navigates into the frontend file.
6. Once in the frontend file you'll need to run "npm install" this will install all the package dependencies to run the frontend portion of the application.
7. You'll now need to do the same thing for the backend file.
8. From the frontend file type "cd .." this will navigate you back to the sokal-qa-application file.
9. Now, you guessed it, you need to do the same thing in the backend file. From here "cd backend" once in the backend file, run "npm install" to install the backend dependencies.
10. At this point it's probably wise to open a second terminal, one to control the backend and the other to control the frontend.
11. Once you're in the correct file, you'll need to type "node server.js" to start the backend application. If done properly you should see "Server running on port 3000" in the terminal.
12. To begin the frontend application you'll need to run "npm run serve" in the frontend file to begin the frontend application you'll know it's working if you see "App running at: Local: http://localhost:8080/".
13. Now, just navigate to that url and you SHOULD see the application :D

Adding Tests:

1. Tests are found in backend > Tests (obviously?)
2. Feel free to check out the tests that are there to get an idea of how you might make yours.
3. Once you've added a new test file RESTART THE BACKEND. The node server is not dynamic. You'll need to restart it every time you change things in the backend file to ensure the updates you make actually do something.
4. Once you've added your test code to the new file you made, you'll need to ensure it's connected properly in the server.js file.
5. You'll first need to import the file you made so you can reference it, there is a section at the top where you can just copy the format.
6. Once you've imported your test to the server.js file you'll need to add it to the list of tests to run, which is also in the server.js file. Again, you should be able to just copy the format of the tests that are already present.
7. Lastly, you'll need to add the test you made to the frontend, so it can be activated. If you have been consistent with how you've been naming your test if should be pretty straightforward to add it to the frontend > src > components > QAForm.vue

How to add the tests you made to the github repository:

1. cd back into the main file. This is important because accidentally doing git stuff within the backend or frontend file can lead to having nested repositories and it's complicated, and I don't want to figure out how to fix it :D
2. Please make sure you're in the website-playwright-qa file in the terminal before continuing.
3. We first need to make sure you have the most updated version of the repository, in case someone made an update while you were working on yours. To do that run "git pull origin main"
4. If there are discrepancies github will ask if you want to merge them manually, you can probably do that since the changes SHOULDN'T me many. Since we'll only be in a few files :D :D :D
5. Run "git status" this will show you the current changes that exist in the local repository.
6. After you've taken a look at the differences, run "git add backend/tests/yourNewTestName.js etc." make sure you add just the files you made/altered. If you're adding a new test it will at least look like this: "git add backend/tests/newTest.js backend/server.js frontend/src/components/QAForm.vue"
7. Once you'd added the files you changed you're ready to commit "git commit -m "Added new test for XYZ and updated UI selection"
8. Hopefully it's that smooth
