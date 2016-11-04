/*
 * Survey Editor Javascript
 * By Lexie Lynn 11/2016
 *
 */
// CONSTANT
// Gives each new question an integer id number
// Could potentially cause problems if value exceeds MAX_SAFE_INTEGER
// Unlikely a user will create that many questions
var idCount = 0;



// switch display between question creation form and question list display
function switchDisplay() {
    $('.question-form').toggle();
    $('.question-display').toggle();
    $("#newQuestion").toggle();
}

// clears question creation form
function clearFields() {
    $("#question").val("");
    $("td input[type!=button]").val('');
    // Does not reset settings checkboxes - leaves previous configuration 
    // In case the user wants them to be all the same
}


// Add another row to the answers input in question creation form
function addField() {
    var prevRow = $('tr:last');
    var row = $(prevRow).clone();

    $(prevRow).find('.add-field').hide();
    $(prevRow).find('.remove-field').show();

    $(row).find('#respondentOpts').prop('selectedIndex', 0);
    $(row).find('input[type!=button]').val('');

    $('#ans-table tbody').append(row);
}

// Remove a row from the answers input
function removeField() {
    var target = $(event.target)[0];
    var row = target.closest("tr", ".ans-table");
    $(row).remove();

}

// Get the answers from form's text field and return in array
function getAnswers() {
    var rows = $('tr input:text');
    var answers = [rows.length];

    for (var i = 0; i < rows.length; i++) {
        answers[i] = $(rows[i]).val();
    }
    return answers;
}

// Get the answers from form's text field and return in array
function getAnswersSettings() {
    var selRows = $('tr .select');
    var ansSettings = [selRows.length];

    for (var i = 0; i < selRows.length; i++) {
        ansSettings[i] = $(selRows[i]).prop('selectedIndex');
    }
    return ansSettings;
}




/// --------- DOCUMENT READY -------------///


$(document).ready(function() {

    // Initiating sortable javascript UI 
    // Allows user to drag and drop question to change order
    $(function() {
        $(".sortable").sortable();
    });


    // Create listeners for the answer table on question form
    $('#ans-table').on('click', '.add-field', addField);
    $('#ans-table').on('click', '.remove-field', removeField);



    // Show add question form when new question button is clicked
    $("#newQuestion").click(function() {
        // Remove editing class, so submit creates a new question when clicked
        // instead of over-writing a previously created question
        $(".submit").removeClass('editing');

        switchDisplay();
    });



    // Saves question information when user submits
    // Creates and displays li listQ element 
    $(".submit").on('click', function() {

        var question;

        // If we are editing a question, submit updates old question
        if ($(this).hasClass('editing')) {

            // Find current question
            var id = $(this).data('current');
            question = $('#' + id)[0];

            // Update question text from the text area box
            $(question).find('span').text($("#question").val());

        } else {
            // If we are creating a new question, submit creates new li listQ element
            var list = $('.question-list');
            var elements = $('<li class="listQ list-group-item" id="' + idCount + '""></li>');
            question = elements.appendTo(list);
            question.append('<span>' + $("#question").val() + '</span>');
            question.append('<button class="delete btn btn-danger">Delete</button><button class="edit btn btn-info">Edit</button>');
            question.addClass("ui-state-default");

            // increment count so each question has a unique id
            idCount++;
        }

        // Save answers to question data
        var ans = getAnswers();
        $(question).data('answers', ans);

        // Save answer respondent options to question data
        var settings = getAnswersSettings();
        $(question).data('settings', settings);

        // Save checkbox values to quesiton data
        $(question).data('none', $('.none').is(':checked'));
        $(question).data('shuffle', $('.shuffle').is(':checked'));


        clearFields();
        switchDisplay();
    });


    // Clears fields and hides form when cancelled
    $(".cancel").on('click', function() {
        clearFields();
        switchDisplay();
    });



    // Edit a previously created question
    $(".question-list").on('click', ".edit", function() {

        // Load previously saved question information into form
        var target = $(event.target)[0];
        var q = target.closest(".listQ", ".question-list");
        var id = $(q).attr('id');

        // Get only the text of the question (do not include text from edit/delete buttons)
        $("#question").val($(q).find('span:first').text());

        // Load answers in
        var a = $(q).data('answers');
        var s = $(q).data('settings');
        var textFields = $('tr input:text');

        // Make sure there are enough textfields for the number of answers
        while (a.length > textFields.length) {
            addField;
        }

        textFields = $('tr input:text');
        selectSettings = $('tr select');

        // Fill text fields with answers
        for (var i = 0; i < a.length; i++) {
            $(textFields[i]).val(a[i]);
            $(selectSettings[i]).prop('selectedIndex', s[i]);
        }



        // Set checkboxes to saved values
        $('.none').prop('checked', $(q).data('none'));
        $('.shuffle').prop('checked', $(q).data('shuffle'));


        // Switch views to show form transfering necessary information
        // such as editing state and id for when we save our edits
        var form = $('.question-form');
        form.find('.submit').addClass('editing');
        form.find('.submit').data('current', id);

        switchDisplay();
    });


    // Delete a question from the question list
    $(".question-list").on('click', ".delete", function() {
        var target = $(event.target)[0];
        var q = target.closest(".listQ", ".question-list");
        $(q).remove();

    });


});