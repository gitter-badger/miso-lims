WorkflowDescription = (function() {
  var processInput = function(input) {
    var url = "/miso/rest/workflow/process";
    var queryUrl = encodeURI(url + "/?" + jQuery.param({input: input}));

    jQuery.ajax({
      "dataType": "json",
      "type": "POST",
      "url": queryUrl,
      "contentType": "application/json; charset=utf8",
      "success": function(result) {
        // todo
        console.log(result);
      },
      "error": function() {
        // todo: take parameters?
      }
    })
  };

  return {
    initDescription: function(id, message) {
      var input = jQuery("<input/>").attr({type: "text"});
      jQuery("#" + id).append("<p>" + message + "</p>").append(input);
      input.keypress(function(e) {
        if (e.which === 13) {
          processInput(input.val());
        }
      })
    }
  }
})();