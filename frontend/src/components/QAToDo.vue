<template>
  <div class="to-do">
    <div class="padding-5-percent">
      <div class="flex-row">
        <div class="flex-column">
          <h2>To-Do:</h2>
          <ul>
            <li class="big-deal">TESTS DON'T WORK ON TEST SITE??????????????</li>
            <li>Test to check if each page in the navigation has a h1</li>
            <li>
              Test to check if each page in the navigation has images with
              non-repeating alt tags
            </li>
            <li>
              Add a time estimating loading page after pressing "Run Tests"
            </li>
            <li>Make the UI not look terrible :D</li>
            <li>Make checkboxes for different browsers?</li>
          </ul>
        </div>
        <div class="flex-column">
          <h2>Completed:</h2>
          <ul>
            <li>
              Test to check if each page in the navigation has a title
              containing the dealer name - Alec
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
