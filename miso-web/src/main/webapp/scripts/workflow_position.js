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

  var registerEnterHandler = function(input, workflowId, onLoad, onSuccess) {
    input.keypress(function(e) {
      if (e.which === 13) {
        onLoad();
        processInput(input.val(), workflowId, onSuccess);
      }
    })
  };

  var updatePosition = function(positionDiv, position) {
    var inputTag = makeInputTag();

    registerEnterHandler(inputTag, position["workflowId"],
      function() {
        positionDiv.empty().append(jQuery("<img>").attr("src", "/styles/images/ajax-loader.gif"));
      },
      function(position) {
        if (position == null) {
          positionDiv.empty().append(jQuery("<p>Workflow is complete!</p>"));
        } else {
          updatePosition(positionDiv, position);
      }
    });

    positionDiv.empty().append(makeMessageTag(position["message"])).append(inputTag);
    inputTag.focus();
  };

  return {
    init: function(divId, workflowId, message) {
      var workflowPosition = {
        message: message,
        inputTypes: null,
        stepNumber: 0,
        log: [],
        workflowId: workflowId
      };
      updatePosition(jQuery("#" + divId), workflowPosition);
    }
  }
})();