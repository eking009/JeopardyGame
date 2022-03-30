
//Requirements
//You can see a working version of this at https://jeopardy-example.surge.sh/.

//The game board should be 6 categories across, 5 question down, displayed in a table. Above this should be a header row with the name of each category.
//At the start of the game, you should randomly pick 6 categories from the jService API. For each category, you should randomly select 5 questions for that category.
//Initially, the board should show with ? on each spot on the board (on the real TV show, it shows dollar amount, but we won’t implement this).
//When the user clicks on a clue ?, it should replace that with the question text.
//When the user clicks on a visible question on the board, it should change to the answer (if they click on a visible answer, nothing should happen)
//When the user clicks the “Restart” button at the bottom of the page, it should load new categories and questions.
//We’ve provided an HTML file and CSS for the application (you shouldn’t change the HTML file; if you want to tweak any CSS things, feel free to).

//We’ve also provided a starter JS file with function definitions. Implement these functions to meet the required functionality.


// adding variable 
let BASE_API_URL = "https://jservice.io/api/"; // jservice API URL
let NUM_CATEGORIES = 6; // 6 categories as per instructions
let NUM_CLUES_PER_CAT = 5; // 5 questions down as per instructions 



// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",h
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = []; // empty array


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() { // async added to starter code 
  // ask for 100 categories [most we can ask for], so we can pick random
  let response = await axios.get(`${BASE_API_URL}categories?count=100`); // get axios await
  let catIds = response.data.map(c => c.id); // mapping catId with arrow funcs
  return _.sampleSize(catIds, NUM_CATEGORIES);
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
  let response = await axios.get(`${BASE_API_URL}category?id=${catId}`); // get axios await
  let cat = response.data; // category data
  let allClues = cat.clues;
  let randomClues = _.sampleSize(allClues, NUM_CLUES_PER_CAT); // 5 questions 
  let clues = randomClues.map(c => ({ // mapping random clues
    question: c.question,
    answer: c.answer,
    showing: null,
  }));

  return { title: cat.title, clues };
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() { // starter code came with async
  // Add row with headers for categories
  $("#jeopardy thead").empty();
  let $tr = $("<tr>"); // css tr
  for (let catIdx = 0; catIdx < NUM_CATEGORIES; catIdx++) { // loop index 6 times to add category
    $tr.append($("<th>").text(categories[catIdx].title)); // appending th "header"
  }
  $("#jeopardy thead").append($tr); // $ jQuery

  // Add rows with questions for each category
  $("#jeopardy tbody").empty();
  for (let clueIdx = 0; clueIdx < NUM_CLUES_PER_CAT; clueIdx++) { // loop index 5 questions/clues 
    let $tr = $("<tr>"); 
    for (let catIdx = 0; catIdx < NUM_CATEGORIES; catIdx++) { // nested for loop
      $tr.append($("<td>").attr("id", `${catIdx}-${clueIdx}`).text("?")); // "?" instead of a number
    }
    $("#jeopardy tbody").append($tr);
  }
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
  let id = evt.target.id;
  let [catId, clueId] = id.split("-");
  let clue = categories[catId].clues[clueId];
  let msg;

  if (!clue.showing) { // if clue not showing 
    msg = clue.question;
    clue.showing = "question"; // add question
  } else if (clue.showing === "question") { // if question showing add answer
    msg = clue.answer;
    clue.showing = "answer";
  } else {
    // already showing answer; ignore
    return
  }

  // Update text of cell
  $(`#${catId}-${clueId}`).html(msg);
}
/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

// function showLoadingView() {

//}

/** Remove the loading spinner and update the button used to fetch data. */

// function hideLoadingView() {
//}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
  let catIds = await getCategoryIds();

  categories = []; // empty array

  for (let catId of catIds) {
    categories.push(await getCategory(catId)); // push the category
  }

  fillTable();
}

/** On click of restart button, restart game. */

$("#restart").on("click", setupAndStart); // restart Id in html

/** On page load, setup and start & add event handler for clicking clues */

$(async function () {
    setupAndStart();
    $("#jeopardy").on("click", "td", handleClick);
  }
);

// Reference 
// Springboard, jQuery, Axios unit 13, 14
//youtube video showed me some guidance with "fetch" instead of axios. 
// "Inspect" development tools of online Jeopardy games 
// Springboard assignment 2 instructions to fill in starter code 
// Rithm school re-enforcement 