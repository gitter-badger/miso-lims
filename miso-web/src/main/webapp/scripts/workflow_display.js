WorkflowDisplay = (function() {
  var display;
  var workflowId;
  var stepNumber;
  var loadingGif = jQuery("<img src='/styles/images/ajax-loader.gif'>");

  function ajax(method, url, onSuccess, onError) {
    showLoading();
    jQuery.ajax({
      "type": method,
      "url": url,
      "contentType": "application/json; charset=utf8",
      "dataType": "json",
      "success": onSuccess,
      "error": onError
    })
  }
  
  function showSuccess() {
    display.empty().append(jQuery("<p>Successfully completed workflow.</p>"));
  }

  function executeWorkflow() {
    ajax("POST", encodeURI("/miso/rest/workflow/execute/?" + jQuery.param({
      id: workflowId
    })), showSuccess, function() {
      // todo: error function
    });
  }

  function showError(text) {
    loadingGif.remove();
    display.children().show();
  }

  function processInput(input) {
    ajax("POST", encodeURI("/miso/rest/workflow/process/?" + jQuery.param({
      id: workflowId,
      stepNumber: stepNumber,
      input: input
    })), function(state) {
      workflowId = state["workflowId"];
      stepNumber = state["stepNumber"];

      if (!state["inputTypes"]) {
        showConfirm(state["message"], state["log"]);
      } else {
        showPrompt(state["message"], state["inputTypes"], state["log"]);
      }
    }, function(xhr) {
      showError(console.log(JSON.parse(xhr["responseText"])["data"]["GENERAL"]));
    });
  }

  function makeMessageTag(message) {
    return jQuery("<p>" + message + "</p>");
  }

  function showLoading() {
    // Hide children in case the request fails and we need to show them later
    display.children().hide();
    display.append(loadingGif);
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

  function updateStep(newStepNumber) {
    ajax("GET", encodeURI("/miso/rest/workflow/getstep/?" + jQuery.param({
      id: workflowId,
      stepNumber: newStepNumber
    })), function(state) {
      stepNumber = state["stepNumber"];
      workflowId = state["workflowId"];
      showPrompt(state["message"], state["inputTypes"], state["log"]);
    }, function() {
      // todo
    });
  }

  function makeLogEntry(text, entryStepNumber) {
    var row = jQuery("<tr>");
    if (entryStepNumber === stepNumber) {
      row.css("outline", "thin solid");
    }
    var redoButton = jQuery("<td><img src='/styles/images/redo.svg' class='redoStep'></td>").click(function() {
      updateStep(entryStepNumber);
    });

    return row.append(jQuery("<td>" + text + "</td>")).append(redoButton);
  }

  function makeLog(logEntries) {
    var table = jQuery("<table class='workflowLogTable'>");

    // Iterate backwards to display a reverse chronological log
    for (var i = logEntries.length - 1; i >= 0; i--) {
      table.append(makeLogEntry(logEntries[i], i));
    }

    return jQuery("<div>").append(table);
  }

  function makeExecuteButton() {
    return jQuery("<a class='ui-button ui-state-default'>").text("Confirm").click(function() {
      executeWorkflow();
    });
  }

  function showConfirm(message, log) {
    display.empty().append(makeMessageTag(message)).append(makeExecuteButton()).append(makeLog(log));
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