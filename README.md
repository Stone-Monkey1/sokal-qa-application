How to get the code on your computer:

1. Open the console in VSCode.
2. Run "git clone https://github.com/Stone-Monkey1/sokal-qa-application.git"
3. Go back into the terminal and navigate into the repository you just cloned by typing "cd sokal-qa-application"
4. Now, you need to download the package dependencies.
5. Open the terminal by pressing "ctrl & ~"
6. Run this in the terminal of the root directory, which should be sokal-qa-application: "chmod +x setup.sh && ./setup.sh"
7. This SHOULD download all dependencies required for the frontend and backend.
8. At this point you should open a second terminal, one to control the backend and the other to control the frontend.
9. In one terminal cd into the backend by typing "cd backend".
10. Once you're in the correct file, you'll need to type "node server.js" to start the backend application. If done properly you should see "Server running on port 3000" in the terminal.
11. You'll also need to open the second terminal you made earlier. cd into the frontend by typing "cd frontend".
12. To begin the frontend application you'll need to run "npm run serve" in the frontend file to begin the frontend application you'll know it's working if you see "App running at: Local: http://localhost:8080/".
13. Now, just navigate to that url and you SHOULD see the application :D
14. You can stop a terminal running a script by pressing ctrl & c at the same time.

Adding Tests:

1. Tests are found in backend > Tests (obviously?)
2. Feel free to check out the tests that are there to get an idea of how you might make yours.
3. Once you've added a new test file or altered the backend at all RESTART THE BACKEND. The node server is not dynamic. You'll need to restart it every time you change things in the backend file to ensure the updates you make actually do something.
4. Once you've added your test code to the new file you made, you'll need to ensure it's connected properly in the server.js file.
5. You'll first need to import the file you made so you can reference it in server.js, there is a section at the top where you can just copy the format.
6. Once you've imported your test to the server.js file you'll need to add it to the list of tests to run, which is also in the server.js file. Tests are stored in a const called "testModules"
7. Lastly, you'll need to add the test you made to the frontend, so it can be called. If you have been consistent with how you've been naming your test if should be pretty straightforward to add it to the frontend > src > components > QAForm.vue

How to add the tests you made to the github repository:

1. cd back into the main file. This is important because accidentally doing git stuff within the backend or frontend file can lead to having nested repositories and it's complicated, and I don't want to figure out how to fix it :D
2. Please make sure you're in the website-playwright-qa file in the terminal before continuing.
3. If you're adding a new test you will need to add the files you changed which should look something like this: "git add backend/tests/newTest.js backend/server.js frontend/src/components/QAForm.vue"
4. Once you've added the files you changed you're ready to commit "git commit -m "Added new test for XYZ and updated UI selection".
5. Before we push we first need to make sure you have the most updated version of the repository, in case someone made an update while you were working on yours. To do that run "git pull origin main --rebase". If no one else has pushed changes, Git will say "Already up to date". If someone has pushed changes, Git will reapply their work on top of the latest commit.
6. If there are discrepancies github will ask if you want to merge them manually, you can probably do that since the changes SHOULDN'T me many. Since we'll only be in a few files :D :D :D
7. Once you've made the manual changes you'll need to mark the changes resolved by running "git add backend/server.js" or whichever file it was that had discrepancies. Then, move on with the rebase "git rebase --continue". Then you'll do the same process for the next file.
8. Run "git push origin main"
9. Hopefully it's that smooth

Adding words to aspell
1. nano ~/.aspell.en.pws
2. ensure that the number: "personal_ws-1.1 en 8" the "8" in this case, is updated as you add words
3. Once you're done: ctrl + x, y, ENTER

New flow
1. In root: npm run make

New Setup
1. bash setup-node-bin.sh

Getting the app on your computer:
1. Don't click to unzip the app. Explanation: I'm not an apple approved devloper, so I wasn't able to notarize this application. To keep you safe Apple will quarantine the app.
2. Instead go into your terminal and type "cd ~/Downloads"
3. Then "~/Downloads unzip qaApp-x.x.xx-arm64-mac.zip" REPLACE THE X's WITH THE VERSION YOU DOWNLOADED!!!!!
4. Then, while still in Downloads, run "xattr -rd com.apple.quarantine ~/Downloads/qaApp.app"
5. You my also need to go to System Settings -> Privacy & Security
6. Scroll to Security and look for "sokal-qa-application" was blocked from use because it is not from an identified developer.
7. Click "Allow Anyway"
8. Try opening again

IGNORE ALL FILES NOT REFERENCED IN THIS README UNLESS YOU TALK TO ALEC FIRST
