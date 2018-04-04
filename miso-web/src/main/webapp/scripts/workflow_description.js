WorkflowDescription = (function() {
  return {
    initDescription: function(id, message, inputTypes) {
      jQuery("#" + id).append("<p>" + message + "</p>").append("<input type='text'>");
      console.log(inputTypes)
    }
  }
})();