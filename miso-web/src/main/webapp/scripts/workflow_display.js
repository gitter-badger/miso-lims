WorkflowDisplay = (function() {
  var processInput = function(input, workflowId, onSuccess) {
    var url = "/miso/rest/workflow/process";
    var queryUrl = encodeURI(url + "/?" + jQuery.param({input: input, id: workflowId}));

    jQuery.ajax({
      "dataType": "json",
      "type": "POST",
      "url": queryUrl,
      "contentType": "application/json; charset=utf8",
      "success": function(result) {
        onSuccess(result);
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

  var registerEnterHandler = function(inputTag, workflowId, onLoad, onSuccess) {
    inputTag.keypress(function(e) {
      if (e.which === 13) {
        onLoad();
        processInput(inputTag.val(), workflowId, onSuccess);
      }
    })
  };

  var updateDisplay = function(display, state) {
    var inputTag = makeInputTag();

    registerEnterHandler(inputTag, state["workflowId"],
      function() {
        display.empty().append(jQuery("<img>").attr("src", "/styles/images/ajax-loader.gif"));
      },
      function(newState) {
        if (newState == null) {
          display.empty().append(jQuery("<p>Workflow is complete!</p>"));
        } else {
          updateDisplay(display, newState);
      }
    });

    var log = jQuery("<table>").addClass("workflowLogTable");
    var logEntries = state["log"];
    for (var i = 0; i < logEntries.length; ++i) {
      log.append(jQuery("<tr>").append(jQuery("<td>" + logEntries[i] + "</td>")).append(jQuery("<td>button</td>")));
    }

    display.empty().append(makeMessageTag(state["message"])).append(inputTag).append(log);
    inputTag.focus();
  };

  return {
    init: function(divId, workflowId, message) {
      var state = {
        workflowId: workflowId,
        message: message,
        log: []
      };
      updateDisplay(jQuery("#" + divId), state);
    }
  }
})();