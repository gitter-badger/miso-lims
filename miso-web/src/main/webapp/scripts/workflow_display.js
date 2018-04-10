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

  var registerEnterHandler = function(tag, workflowId, onLoad, onSuccess) {
    tag.keypress(function(e) {
      if (e.which === 13) {
        onLoad();
        processInput(tag.val(), workflowId, onSuccess);
      }
    })
  };

  var makeLog = function(logEntries) {
    var table = jQuery("<table>").addClass("workflowLogTable");
    table.append(jQuery("<tr>").append(jQuery("<th>Workflow Log</th>")));

    for (var i = 0; i < logEntries.length; ++i) {
      table.append(jQuery("<tr>").append(jQuery("<td>" + logEntries[i] + "</td>")).append(jQuery("<td>button</td>")));
    }

    return jQuery("<div>").append(table);
  };

  var updateDisplay = function(display, state) {
    var inputTag = makeInputTag();

    registerEnterHandler(inputTag, state["workflowId"],
      function() {
        display.empty().append(jQuery("<img src='/styles/images/ajax-loader.gif'>"));
      },
      function(newState) {
        if (newState == null) {
          display.empty().append(jQuery("<p>Workflow is complete!</p>"));
        } else {
          updateDisplay(display, newState);
      }
    });

    display.empty().append(makeMessageTag(state["message"])).append(inputTag).append(makeLog(state["log"]));
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