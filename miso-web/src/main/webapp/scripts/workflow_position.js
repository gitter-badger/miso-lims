WorkflowPosition = (function() {
  var processInput = function(input, workflowId, onSuccess) {
    var url = "/miso/rest/workflow/process";
    var queryUrl = encodeURI(url + "/?" + jQuery.param({input: input, id: workflowId}));

    jQuery.ajax({
      "dataType": "json",
      "type": "POST",
      "url": queryUrl,
      "contentType": "application/json; charset=utf8",
      "success": function(prompt) {
        onSuccess(prompt);
      },
      "error": function() {
        // todo
      }
    })
  };

  var makeMessageTag = function(message) {
    return jQuery("<p>" + message + "</p>");
  };

  var makeInputTag = function() {
    return jQuery("<input/>").attr({type: "text"});
  };

  var registerEnterHandler = function(input, workflowId, onSuccess) {
    input.keypress(function(e) {
      if (e.which === 13) {
        processInput(input.val(), workflowId, onSuccess);
      }
    })
  };

  var updatePosition = function(position, message, workflowId) {
    var messageTag = makeMessageTag(message);

    var inputTag = makeInputTag(position, workflowId);
    registerEnterHandler(inputTag, workflowId, function(prompt) {
      if (prompt == null) {
        position.empty().append(jQuery("<p>Workflow is complete!</p>"));
      } else {
        updatePosition(position, prompt["message"], workflowId);
      }
    });

    position.empty().append(messageTag).append(inputTag);
    inputTag.focus();
  };

  return {
    init: function(divId, workflowId, message) {
      updatePosition(jQuery("#" + divId), message, workflowId);
    }
  }
})();