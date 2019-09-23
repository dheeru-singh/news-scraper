$('.scrape-article').on("click", () => { // Scrap Articles Request
  // console.log("searchArticle Button clicked");
  fetch("/scrape", {method: "GET"}).then(() => window.location.replace("/scrape.html"));
 
});

// $(document).on("click", ".scrape-article", function() {
//   $.ajax({
//     method: "GET",
//     url: "/scrape" 
//   })
//     // With that done, add the note information to the page
//   .then(function(data) {
//     window.location.replace("/");
//     alert("DAta is scraped");
//   })
// })
// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  //console.log(data);
  for (var i = 0; i < data.length; i++) {
    
    // Display the apropos information on the page
    $("#articles").append(
      "<li> <img src='"+ data[i].imgsource +
      "'/><h4>" + data[i].title + 
        "</h4><p>"+ data[i].description +
        "</p><a class='btn btn-info' target='_blank' href='" + data[i].link + 
        "'> More Detail</a><button class='btn btn-info comment' data-id='"
         + data[i]._id + "'data-toggle='modal' data-target='#notes-modal' >Add Comment</button><button class='btn btn-info view-comment' data-id='"
         + data[i]._id + "'data-toggle='modal' data-target='#view-comment-modal' >View Comment</button></li>");
    if (data[i].note) {
      console.log(data[i].note)
    //   $("#articles li").append("<ul><li><h4>"+data[i].note.title+"</h4><p>" +data[i].note.body + "</p></li><ul>");
    // console.log('note exist');
  }
  }
});


// Whenever someone clicks a p tag
$(document).on("click", ".comment", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h5 class='text-center'>" + data.title + "</h5>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' class='form-control' name='title' placeholder='Add title'>");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' class='form-control' name='body' placeholder='Add comment '></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button class='btn btn-info' data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

$(document).on("click", ".view-comment", function() {
  // Empty the notes from the note section
  $("#comments-list").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      //console.log(data);
      // console.log(data.note);
      // The title of the article
      
      // If there's a note in the article
      if (data.note) {
        $("#comments-list").append("<h5 class='text-center'>" + data.note.title + "</h5>");
        $("#comments-list").append("<p class='text-center'>" + data.note.body + "</p>");
      }else{
        $("#comments-list").append("<h5 class='text-center'> No comment exist </h5>");
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
