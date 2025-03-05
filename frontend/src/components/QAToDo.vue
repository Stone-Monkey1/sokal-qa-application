<template>
  <div class="to-do">
    <div class="padding-5-percent">
      <div class="flex-row">
        <div class="flex-column">
          <h2>To-Do:</h2>
          <ul>
            <li class="big-deal">
              Attempted to add checkboxes for multiple browsers. The vue app was
              unable to receive the data for some reason. Spent like 5 hohurs
              debugging and made no progress. Will come back to this later, when
              I'm feeling particularly masochistic.
            </li>
            <li>
              Add a time estimating loading page after pressing "Run Tests"
            </li>
            <li>Make the UI not look terrible :D</li>
            <li>Need to start working on homepage components</li>
            <li>Bug: Homepage tests still run on every page</li>
          </ul>
        </div>
        <div class="flex-column">
          <h2>Completed:</h2>
          <ul>
            <li>
              Fixed Bug: Some tests don't trigger the frontend function that
              marks pages as free from error
            </li>
            <li>
              Made it so that server.js controlls list of executed and
              non-executed tests, rather than leaving that to the individual
              tests. Made the application run exponentially faster.
            </li>
            <li>
              Tests need to be sorted based on the pages with errors, not based
              on the test - Alec
            </li>
            <li>
              Test to check if each page in the navigation has a title
              containing the dealer name - Alec
            </li>
            <li>
              Created a test environment -
              <a href="https://stone-monkey1.github.io/sokal-qa-playground/"
                >Test Site</a
              >
              - Alec
            </li>
            <li>
              Test to check if each page in the navigation has a h1 - Alec
            </li>
            <li>
              Test to check if each page in the navigation has images with
              non-repeating alt tags - Alec
            </li>
            <li>Add a button to copy results - Alec</li>
            <li>Need to make some homepage components to test - Chris</li>
            <li>
              Test to see if an iframe url contains vimeo or youtube in order to
              test the video on the page. - Alec
            </li>
            <li>
              Created diffrent logic for homepage tests and navbar tests, since
              the homepage test doesn't need to run on multiple pages, only the
              one put in the url space - Alec
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.to-do .flex-column {
  flex: 1;
}
.big-deal {
  color: red;
  font-weight: bold;
}
</style>
