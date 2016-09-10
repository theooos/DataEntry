
var server = "http://54.171.145.89:3001/";

window.onload = function () {
    var topicSelector = document.getElementById('topicSelector');

    var newQuestion = document.getElementById('newQuestion');
    var newQuestionStarter = document.getElementById('newQuestionStarter');
    var newQuestionTags = document.getElementById('newQuestionTags');
    var questionSelector = document.getElementById('questionSelector');

    var newMessage = document.getElementById('newMessage');
    var newKeywords = document.getElementById('newKeywords');
    var newAcnol = document.getElementById('newAcnol');
    var newChangeTopic = document.getElementById('newChangeTopic');
    var newOurResponse = document.getElementById('newOurResponse');
};

// ############ TOPICS ############
// Clears topics dropdown, use addTopic to add one and topicChange is called when its changed
function clearTopics() {
    topicSelector.innerHTML = "<option value='' disabled selected>Select a topic</option>";
}

function addTopic(topicName) {
    var topicJSON = {
        "topic": topicName,
        "questions":[]
    };
    $.post(server+"questions", topicJSON, function () {
        alert("Successfully added "+topicName+".");
        var option = document.createElement("option");
        option.text = topicName;
        topicSelector.add(option);
    });
}

function loadTopics(){
    clearTopics();
    $.get(server+"topics", function(topics){
        topics.forEach(function (topic) {
            var option = document.createElement("option");
            option.text = topic;
            topicSelector.add(option);
        })
    });
}


// ############ QUESTIONS ###########
// Clears questions dropdown
function clearQuestions() {
    questionSelector.innerHTML = "<option value='' disabled selected>Select a question</option>";
}

// Resets the question area to it's normal state.
function resetQuestionArea(){
    newQuestion.value = "";
    newQuestionTags.value = "";
}

// When the question is added
function addQuestion(topic, questionName, questionStarter, questionTags) {
    resetQuestionArea();
    loadQuestions(topic);
}

// Populates questions dropdown with all questions for given topic.
function loadQuestions(topic) {
    console.log(server+"questions/"+topic);
    $.get(server+"questions/"+topic, function(questions){
        console.log("Questions: " + questions);
        questions.forEach(function (question) {
            var option = document.createElement("option");
            option.text = topic;
            questionSelector.add(option);
        })
    });
}

function questionChange(e) {
    var question = e.value;
    alert(question);
    // This is where your code goes for
}



// ########## RESPONSES ############

function responseAdded(message, keywords, acnol, changetopic, ourresponse) {
    alert("Added: " + message + ", " + keywords + ", " + acnol + ", " + changetopic + ", " + ourresponse);
    newMessage.value = "";
    newKeywords.value = "";
    newAcnol.value = "";
    newChangeTopic.value = "";
    newOurResponse.value = "";
}
