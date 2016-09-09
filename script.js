
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

// ############ TOPICS ############
// Clears topics dropdown, use addTopic to add one and topicChange is called when its changed
function clearTopics() {
    topicSelector.innerHTML = "";
}

function clearQuestions() {
    questionSelector.innerHTML = "";
}

function addTopic(topicName) {
    var option = document.createElement("option");
    option.text = topicName;
    topicSelector.add(option);
}

function loadTopics(){
    $.get("http://54.171.145.89:80/topics", function(data){
        alert("Data: " + data);
    });
}



// ############ QUESTIONS ###########

// When the question is added
function questionAdded(questionName, questionStarter, questionTags) {
    alert("Added: " + questionName + ", " + questionStarter + ", " + questionTags);
    addQuestion(questionName);
    newQuestion.value = "";
}

// Adds thing to list
function addQuestion(questionName) {
    var option = document.createElement("option");
    option.text = questionName;
    questionSelector.add(option);
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

function topicChange(e) {
    var topic = e.value;
    alert(topic);
    // This is where your code goes for
}

function questionChange(e) {
    var question = e.value;
    alert(question);
    // This is where your code goes for
}
