WorkflowView = (function() {
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

  var updateView = function(view, message, workflowId) {
    var messageTag = makeMessageTag(message);

    var inputTag = makeInputTag(view, workflowId);
    registerEnterHandler(inputTag, workflowId, function(prompt) {
      if (prompt == null) {
        view.empty().append(jQuery("<p>Workflow is complete!</p>"));
      } else {
        updateView(view, prompt["message"], workflowId);
      }
    });

    view.empty().append(messageTag).append(inputTag);
    inputTag.focus();
  };

  return {
    init: function(divId, workflowId, message) {
      updateView(jQuery("#" + divId), message, workflowId);
    }
  }
})();