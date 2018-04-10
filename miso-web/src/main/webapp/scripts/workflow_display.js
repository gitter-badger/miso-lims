WorkflowDisplay = (function() {
  var executeWorkflow = function(workflowId, onLoad, onSuccess) {
    onLoad();

    jQuery.ajax({
      "dateType": "json",
      "type": "POST",
      "url": encodeURI("miso/rest/workflow/execute/?" + jQuery.param({
        id: workflowId
      })),
      "contentType": "application/json; charset=utf8",
      "success": onSuccess,
      "error": function() {
        // todo
      }
    });
  };

  var processInput = function(input, workflowId, onSuccess, onError) {
    var url = "/miso/rest/workflow/process";
    var queryUrl = encodeURI(url + "/?" + jQuery.param({
      input: input,
      id: workflowId
    }));

    jQuery.ajax({
      "dataType": "json",
      "type": "POST",
      "url": queryUrl,
      "contentType": "application/json; charset=utf8",
      "success": function(result) {
        onSuccess(result);
      },
      "error": function(xhr) {
        onError(JSON.parse(xhr["responseText"])["data"]["GENERAL"]);
      }
    })
  };

  var makeMessageTag = function(message) {
    return jQuery("<p>" + message + "</p>");
  };

  var makeOnLoad = function(display) {
    return function() {
      display.empty().append(jQuery("<img src='/styles/images/ajax-loader.gif'>"));
    }
  };
  
  var makeInputTag = function(display, workflowId) {
    var inputTag = jQuery("<input/>").attr({
      type: "text"
    });

    registerEnterHandler(inputTag, workflowId, makeOnLoad(display), function(newState) {
      if (newState["inputTypes"] == null) {
        display.empty().append(jQuery("<p>Would you like to execute this workflow?</p>"));
      } else {
        updateDisplay(display, newState);
      }
    }, function(errorText) {
      // todo
      alert(errorText);
    });

    return inputTag;
  };

  var registerEnterHandler = function(tag, workflowId, onLoad, onSuccess, onError) {
    tag.keypress(function(e) {
      if (e.which === 13) {
        onLoad();
        processInput(tag.val(), workflowId, onSuccess, onError);
      }
    })
  };

  var makeLogEntry = function(text) {
    return jQuery("<tr>").append(jQuery("<td>" + text + "</td>")).append(jQuery("<td><img src='/styles/images/redo.svg' class='redoStep'></td>"));
  };

  var makeLog = function(logEntries) {
    var table = jQuery("<table>").addClass("workflowLogTable");
    table.append(jQuery("<tr>").append(jQuery("<th>Completed Steps:</th>")));

    for (var i = logEntries.length - 1; i >= 0; i--) {
      table.append(makeLogEntry(logEntries[i]));
    }

    return jQuery("<div>").append(table);
  };

  var makeExecuteButton = function(display, workflowId) {
    return jQuery("<a class='ui-button ui-state-default'>").click(function() {
      executeWorkflow(workflowId, makeOnLoad(display), function() {
        display.empty().append(jQuery("<p>Workflow has been executed.</p>"));
      });
    })
  };

  var updateDisplay = function(display, workflowId, log, message, inputTypes) {
    display.empty().append(makeMessageTag(message));
    if (inputTypes == null) {
      display.append(makeExecuteButton(display, workflowId));
    } else {
      display.append(makeInputTag(display, workflowId));
    }
    display.append(makeLog(log)).children("input").focus();
  };

  return {
    init: function(divId, workflowId, message, inputTypes) {
      updateDisplay(jQuery("#" + divId), workflowId, [], message, inputTypes);
    }
  }
})();