WorkflowDisplay = (function() {
  var display;

  function executeWorkflow(workflowId, onLoad, onSuccess) {
    onLoad();

    jQuery.ajax({
      "dateType": "json",
      "type": "POST",
      "url": encodeURI("/miso/rest/workflow/execute/?" + jQuery.param({
        id: workflowId
      })),
      "contentType": "application/json; charset=utf8",
      "success": onSuccess,
      "error": function() {
        // todo
      }
    });
  }

  function processInput(input, workflowId, onSuccess, onError) {
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
  }

  function makeMessageTag(message) {
    return jQuery("<p>" + message + "</p>");
  }

  function makeOnLoad() {
    return function() {
      display.empty().append(jQuery("<img src='/styles/images/ajax-loader.gif'>"));
    };
  }

  function makeInputTag(workflowId) {
    var inputTag = jQuery("<input/>").attr({
      type: "text"
    });

    registerEnterHandler(inputTag, workflowId, makeOnLoad(), function(newState) {
      if (!newState["inputTypes"]) {
        updateDisplay(newState["workflowId"], newState["log"], "Do you want to execute this workflow?");
      } else {
        updateDisplay(newState["workflowId"], newState["log"], newState["message"], newState["inputTypes"]);
      }
    }, function(errorText) {
      // todo
      alert(errorText);
    });

    return inputTag;
  }

  function registerEnterHandler(tag, workflowId, onLoad, onSuccess, onError) {
    tag.keypress(function(e) {
      if (e.which === 13) {
        onLoad();
        processInput(tag.val(), workflowId, onSuccess, onError);
      }
    })
  }

  function makeLogEntry(text) {
    return jQuery("<tr>").append(jQuery("<td>" + text + "</td>")).append(
        jQuery("<td><img src='/styles/images/redo.svg' class='redoStep'></td>"));
  }

  function makeLog(logEntries) {
    var table = jQuery("<table>").addClass("workflowLogTable");
    table.append(jQuery("<tr>").append(jQuery("<th>Completed Steps:</th>")));

    // Iterate backwards to display a reverse chronological log
    for (var i = logEntries.length - 1; i >= 0; i--) {
      table.append(makeLogEntry(logEntries[i]));
    }

    return jQuery("<div>").append(table);
  }

  function makeExecuteButton(workflowId) {
    return jQuery("<a class='ui-button ui-state-default'>").text("Execute").click(function() {
      executeWorkflow(workflowId, makeOnLoad(), function() {
        display.empty().append(jQuery("<p>Workflow has been executed.</p>"));
      });
    })
  }

  function updateDisplay(workflowId, log, message, inputTypes) {
    display.empty().append(makeMessageTag(message));
    if (!inputTypes) {
      display.append(makeExecuteButton(workflowId));
    } else {
      display.append(makeInputTag(workflowId));
    }
    display.append(makeLog(log)).children("input").focus();
  }

  return {
    init: function(divId, workflowId, message, inputTypes) {
      display = jQuery("#" + divId);
      updateDisplay(workflowId, [], message, inputTypes);
    }
  }
})();