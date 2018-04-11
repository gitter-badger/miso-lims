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

  function processInput(workflowId, stepNumber, input, onSuccess, onError) {
    var url = "/miso/rest/workflow/process";
    var queryUrl = encodeURI(url + "/?" + jQuery.param({
      id: workflowId,
      stepNumber: stepNumber,
      input: input
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

  function makeInputTag(workflowId, stepNumber) {
    var inputTag = jQuery("<input type='text'>");

    registerEnterHandler(inputTag, workflowId, stepNumber, makeOnLoad(), function(newState) {
      if (!newState["inputTypes"]) {
        confirmExecution(newState["workflowId"], newState["log"]);
      } else {
        promptUser(newState["workflowId"], newState["stepNumber"], newState["message"], newState["inputTypes"], newState["log"]);
      }
    }, function(errorText) {
      // todo
      alert(errorText);
    });

    return inputTag;
  }

  function registerEnterHandler(tag, workflowId, stepNumber, onLoad, onSuccess, onError) {
    tag.keypress(function(e) {
      if (e.which === 13) {
        onLoad();
        processInput(workflowId, stepNumber, tag.val(), onSuccess, onError);
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

  function confirmExecution(workflowId, log) {
    display.empty().append(makeMessageTag("Do you want to execute this workflow?")).append(makeExecuteButton(workflowId)).append(
        makeLog(log));
  }

  function promptUser(workflowId, stepNumber, message, inputTypes, log) {
    display.empty().append(makeMessageTag(message)).append(makeInputTag(workflowId, stepNumber)).append(makeLog(log)).children("input").focus();
  }

  return {
    init: function(divId, workflowId, message, inputTypes) {
      display = jQuery("#" + divId);
      promptUser(workflowId, 0, message, inputTypes, []);
    }
  }
})();