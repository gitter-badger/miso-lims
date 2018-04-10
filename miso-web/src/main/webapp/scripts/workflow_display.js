WorkflowDisplay = (function() {
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

  var makeInputTag = function(display, workflowId) {
    var inputTag = jQuery("<input/>").attr({
      type: "text"
    });

    registerEnterHandler(inputTag, workflowId, function() {
      display.empty().append(jQuery("<img src='/styles/images/ajax-loader.gif'>"));
    }, function(newState) {
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

  var updateDisplay = function(display, state) {
    display.empty().append(makeMessageTag(state["message"])).append(makeInputTag(display, state["workflowId"])).append(
        makeLog(state["log"])).children("input").focus();
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