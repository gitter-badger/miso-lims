WorkflowDisplay = (function() {
  var display;
  var workflowId;
  var stepNumber;

  function showSuccess() {
    display.empty().append(jQuery("<p>Workflow has been executed.</p>"));
  }

  function executeWorkflow() {
    showLoading();

    jQuery.ajax({
      "dataType": "json",
      "type": "POST",
      "url": encodeURI("/miso/rest/workflow/execute/?" + jQuery.param({
        id: workflowId
      })),
      "contentType": "application/json; charset=utf8",
      "success": showSuccess,
      "error": function() {
        // todo
      }
    });
  }

  function processInput(input) {
    showLoading();

    jQuery.ajax({
      "dataType": "json",
      "type": "POST",
      "url": encodeURI("/miso/rest/workflow/process/?" + jQuery.param({
        id: workflowId,
        stepNumber: stepNumber,
        input: input
      })),
      "contentType": "application/json; charset=utf8",
      "success": function(state) {
        if (!state["inputTypes"]) {
          showConfirmExecution(state["log"]);
        } else {
          stepNumber = state["stepNumber"];
          showPrompt(state["message"], state["inputTypes"], state["log"]);
        }
      },
      "error": function(xhr) {
        // todo
        console.log(JSON.parse(xhr["responseText"])["data"]["GENERAL"]);
      }
    })
  }

  function makeMessageTag(message) {
    return jQuery("<p>" + message + "</p>");
  }

  function showLoading() {
    display.empty().append(jQuery("<img src='/styles/images/ajax-loader.gif'>"));
  }

  function makeInputTag() {
    var inputTag = jQuery("<input type='text'>");

    registerEnterHandler(inputTag, function() {
      processInput(inputTag.val());
    });

    return inputTag;
  }

  function registerEnterHandler(tag, onEnter) {
    tag.keypress(function(e) {
      if (e.which === 13) {
        onEnter();
      }
    })
  }

  function updateStep() {
    jQuery.ajax({
      "dataType": "json",
      "type": "GET",
      "url": encodeURI("/miso/rest/workflow/setstep/?" + jQuery.param({
        id: id,
        // todo: send correct step number
        // stepNumber: stepNumber
      })),
      "contentType": "application/json; charset=utf8",
      "success": function(state) {
        stepNumber = state["stepNumber"]
        // todo
      },
      "error": function() {
        // todo
      }
    })
  }

  function makeLogEntry(text) {
    var redoButton = jQuery("<td><img src='/styles/images/redo.svg' class='redoStep'").click(function() {
      updateStep(function(result) {
        console.log(result);
      });
    });

    return jQuery("<tr>").append(jQuery("<td>" + text + "</td>")).append(redoButton);
  }

  function makeLog(logEntries) {
    var table = jQuery("<table class='workflowLogTable'><tr><th>Completed Steps:</th></tr>");

    // Iterate backwards to display a reverse chronological log
    for (var i = logEntries.length - 1; i >= 0; i--) {
      table.append(makeLogEntry(logEntries[i]));
    }

    return jQuery("<div>").append(table);
  }

  function makeExecuteButton() {
    return jQuery("<a class='ui-button ui-state-default'>").text("Execute").click(function() {
      executeWorkflow();
    });
  }

  function showConfirmExecution(log) {
    display.empty().append(makeMessageTag("Do you want to execute this workflow?")).append(makeExecuteButton()).append(makeLog(log));
  }

  function showPrompt(message, inputTypes, log) {
    display.empty().append(makeMessageTag(message)).append(makeInputTag()).append(makeLog(log)).children("input").focus();
  }

  function initDisplay(newDisplay, newWorkflowId, newStepNumber) {
    display = newDisplay;
    workflowId = newWorkflowId;
    stepNumber = newStepNumber;
  }

  return {
    init: function(divId, workflowId, message, inputTypes) {
      initDisplay(jQuery("#" + divId), workflowId, 0);
      showPrompt(message, inputTypes, []);
    }
  }
})();