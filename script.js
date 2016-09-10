
var server = "http://138.68.139.139/";

window.onload = function () {
    var topicSelector = document.getElementById('topicSelector');

    var newQuestion = document.getElementById('newQuestion');
    var newQuestionStarter = document.getElementById('newQuestionStarter');
    var newQuestionTags = document.getElementById('newQuestionTags');
    var questionSelector = document.getElementById('questionSelector');

    var newMessage = document.getElementById('newMessage');
    var newKeywords = document.getElementById('newKeywords');
    var newReply = document.getElementById('newReply');
    var newChangeTopic = document.getElementById('newChangeTopic');
    var newOurResponse = document.getElementById('newOurResponse');


    $("#newOurResponse").change(function(){
        if($(this).val() == "t") {
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
};

// ############ TOPICS ############
// Clears topics dropdown.
function clearTopics() {
    topicSelector.innerHTML = "<option value='' disabled selected>Select a topic</option>";
}

function addTopic(topicName) {
    var topicJSON = {
        "topic": topicName,
        "questions":[]
    };
    console.log(JSON.stringify(topicJSON));
    send(topicJSON);
    loadTopics();
}

// Populates topics dropdown.
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
// Resets the question area to it's normal state.
function resetQuestionArea(){
    questionSelector.innerHTML = "<option value='' disabled selected>Select a question</option>";
    newQuestion.value = "";
    newQuestionTags.value = "";
}

// When the question is added
function addQuestion(topic, question, starter, tags) {
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
    console.log(JSON.stringify(questionJSON));
    send(questionJSON);
    loadQuestions(topic);
}

// Populates questions dropdown with all questions for given topic.
function loadQuestions(topic) {
    resetQuestionArea();
    $.get(server+"questions/"+topic, function(fullTopic){
        var topicJSON = JSON.parse(JSON.stringify(fullTopic));
        var questions = topicJSON["questions"];
        questions.forEach(function(question){
            var option = document.createElement("option");
            option.text = question["message"];
            questionSelector.add(option);
        })
    });
}


// ########## RESPONSES ############
function addResponse(topic, question, response, keywords, reply, changeTopic, ourResponse){
    var responseJSON = {
        "topic": topic,
        "questions": [
            {
                "message": question,
                "children":[
                    {
                        "message":response,
                        "presentKeywords":keywords,
                        "response":reply,
                        "followUp":[],
                        "switchTopic":changeTopic,
                        "usedByAI":ourResponse
                    }
                ]
            }
        ]
    }
    send(responseJSON);
    resetResponseArea();
}

function resetResponseArea() {
    newMessage.value = "";
    newKeywords.value = "";
    newReply.value = "";
    newChangeTopic.value = "";
    newOurResponse.value = "";
}


// ######### OTHER ###########
function uuid(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

function send(data){
    sendWithFunction(data, function (reply) {
        console.log("[SENT LINE BELOW]");
        console.log(data);
        console.log("[SERVER] "+reply);
    })
}

function sendWithFunction(data,func){
    $.ajax({
        type: "POST",
        url: server+"questions",
        data: JSON.stringify(data),
        success: func,
        contentType: 'application/json'
    });
}