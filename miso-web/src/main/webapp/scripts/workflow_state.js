WorfklowState = (function() {
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

  var makeInput = function(stateDiv, workflowId) {
    var input = jQuery("<input/>").attr({type: "text"});
    input.keypress(function(e) {
      if (e.which === 13) {
        processInput(input.val(), workflowId, function(prompt) {
          stateDiv.empty().append("<p>" + prompt["message"] + "</p>").append(makeInput(stateDiv));
        });
      }
    });
    return input;
  };

  return {
    init: function(divId, workflowId, message) {
      var stateDiv = jQuery("#" + divId);
      stateDiv.append("<p>" + message + "</p>").append(makeInput(stateDiv, workflowId));
    }
  }
})();