
var server = "http://138.68.139.139/";

var newTopic;
var topicSelector;

var newQuestion;
var newQuestionStarter;
var newQuestionTags;
var questionSelector;

var newMessage;
var newKeywords;
var newReply;
var newChangeTopic;
var newOurResponse;
var multiSelect;

window.onload = function () {
    newTopic = document.getElementById('newTopic');
    topicSelector = document.getElementById('topicSelector');

    newQuestion = document.getElementById('newQuestion');
    newQuestionStarter = document.getElementById('newQuestionStarter');
    newQuestionTags = document.getElementById('newQuestionTags');
    questionSelector = document.getElementById('questionSelector');

    newMessage = document.getElementById('newMessage');
    newKeywords = document.getElementById('newKeywords');
    newReply = document.getElementById('newReply');
    newChangeTopic = document.getElementById('newChangeTopic');
    newOurResponse = document.getElementById('newOurResponse');
    multiSelect = document.getElementById('multiSelect');


    $("#newOurResponse").change(function(){
        if($(this).is(':checked')) {
            newKeywords.value = "";
            newKeywords.disabled = true;
            newReply.value = "";
            newReply.disabled = true;
            newChangeTopic.value = "False";
            newChangeTopic.disabled = true;

        } else {
            newKeywords.disabled = false;
            newReply.disabled = false;
            newChangeTopic.disabled = false;
        }
    });

    $("#multiSelect").multiselect();
};


// ####################################################### TOPICS ######################################################

// Adds a topic to the server.
function addTopic(topicName) {
    if(topicName == ""){
        alert("You are missing a field.");
        return;
    }
    var topicJSON = {
        "topic": topicName,
        "questions":[]
    };
    sendWithFunction(topicJSON, function(reply){
        alert("[SERVER] " + reply);
        loadTopics();
    });
}

// Populates topics dropdown.
function loadTopics(){
    clearTopics();
    topicSelector.innerHTML = "<option value='' disabled selected>Select a topic</option>";
    $.get(server+"topics", function(topics){
        topics.forEach(function (topic) {
            var option = document.createElement("option");
            option.text = topic;
            topicSelector.add(option);
        })
    });
}

// Clears topics dropdown.
function clearTopics() {
    newTopic.value = "";
}


// ####################################################### QUESTIONS ###################################################

// When the question is added
function addQuestion(topic, question, starter, tags) {
    if(topic == "" || question == "" || starter == "" || tags == ""){
        alert("You are missing a field.");
        return;
    }
    if(starter == "True"){
        starter = true;
    }
    else{
        starter= false;
    }
    var questionJSON = {
        "topic":topic,
        "questions":[
            {
                "message": question,
                "id":uuid(),
                "isOpener":starter,
                "presentKeywords":tags,
                "children":[]
            }

        ]
    }
    sendWithFunction(questionJSON, function(reply){
        alert("[SERVER] "+reply);
        loadQuestions(topic);
    });
}

// Populates questions dropdown with all questions for given topic.
function loadQuestions(topic) {
    if(topic == ""){
        alert("Please select a topic first.");
        return;
    }
    resetQuestionArea();

    $.get(server+"questions/"+topic, function(fullTopic){
        // console.log("[SERVER] " + JSON.stringify(fullTopic));
        var topicJSON = JSON.parse(JSON.stringify(fullTopic));
        var questions = topicJSON["questions"];

        questions.forEach(addToQuestionLists);
    });
}

// Add's a given question to each question list.
function addToQuestionLists(question){
    var option = document.createElement("option");
    option.text = question["message"] + questionDetails(question["children"]);
    option.value = question["id"];

    var option2 = option.cloneNode(true);

    questionSelector.add(option);
    multiSelect.add(option2);

    $('#multiSelect').multiselect('refresh');
}

// Gets how many children the question has, and also whether it has an AI response, and returns apporpriate label.
function questionDetails(children){
    var total = children.length;
    var string = " "+total;
    for(var i = 0; i < total; i++){
        if(children[i]["usedByAI"]){
            string += " *";
        }
    }
    return string;
}

// Resets the question area to it's normal state.
function resetQuestionArea(){
    questionSelector.innerHTML = "<option value='' disabled selected>Select a question</option>";
    newQuestion.value = "";
    newQuestionTags.value = "";
    newQuestionStarter.value="default";
    multiSelect.innerHTML = "";
    $('#multiSelect').multiselect('refresh');
}


// ########################################## RESPONSES ################################################################

// Sends a response to the server.
function addResponse(topic, question, response, keywords, reply, changeTopic, ourResponse){
    if(ourResponse){
        if(topic == "" || question == "" || response == ""){
            alert("You are missing a field."+
                    "\ntopic: " + topic +
                    "\nquestion: " + question +
                    "\nresponse: " + response);
            return;
        }
    }
    else{
        if(topic == "" || question == "" || response == "" || keywords == "" || reply == "" || changeTopic == ""){
            alert("You are missing a field."+
                "\ntopic: " + topic +
                "\nquestion: " + question +
                "\nresponse: " + response +
                "\nkeywords: " + keywords +
                "\nreply: " + reply +
                "\nchangeTopic: " + changeTopic);
            return;
        }
    }
    if(changeTopic == "True"){
        changeTopic = true;
    }
    else{
        changeTopic = false;
    }
    var responseJSON = {
        "topic": topic,
        "questions": [
            {
                "id": question,
                "children":[
                    {
                        "message":response,
                        "presentKeywords":keywords,
                        "response":reply,
                        "followUp":getSelected(),
                        "switchTopic":changeTopic,
                        "usedByAI":ourResponse
                    }
                ]
            }
        ]
    }
    sendWithFunction(responseJSON, function (reply) {
        alert("[SERVER] " + reply);
        resetResponseArea();
    });
}

// Retrieves all selected questions from multiselect widget.
function getSelected(){
    var selected = $('#multiSelect').multiselect('getChecked');
    var ids = [];
    for(var i = 0; i < selected.length; i++){
        ids.push(selected[i].value);
    }
    return ids;
}

// Resets the response area so a new response can be added.
function resetResponseArea() {
    newKeywords.disabled = false;
    newReply.disabled = false;
    newChangeTopic.disabled = false;

    newOurResponse.checked = false;
    newMessage.value = "";
    newKeywords.value = "";
    newReply.value = "";
    newChangeTopic.value = "default";
    $('#multiSelect').multiselect('uncheckAll');
}


// ########################################### OTHER ###################################################################

// Creates a UUID for a question.
function uuid(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

// Sends provided data to server with provided callback.
function sendWithFunction(data,func){
    $.ajax({
        type: "POST",
        url: server+"questions",
        data: JSON.stringify(data),
        success: func,
        contentType: 'application/json'
    });
}