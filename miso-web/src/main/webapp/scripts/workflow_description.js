WorkflowDescription = (function() {
  return {
    initDescription: function(id, message) {
      jQuery("#" + id).append("<p>" + message + "</p>").append("<input type='text'>");
    }
  }
})();