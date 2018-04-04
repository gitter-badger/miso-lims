package uk.ac.bbsrc.tgac.miso.webapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@RequestMapping("/workflow")
@Controller
public class WorkflowController {
  @RequestMapping("/new/{workflowName}")
  public ModelAndView createWorkflow(@PathVariable String workflowName, ModelMap model) {
    model.put("title", "Load Sequencer Workflow");
    model.put("message", "This is the user message describing what and how to input data into the input form.");
    return new ModelAndView("/pages/workflow.jsp", model);
  }

  @RequestMapping("/edit/{id}")
  public ModelAndView editWorkflow(@PathVariable long id, ModelMap model) {
    model.put("title", "Workflow title");
    model.put("message", "This is the user message describing what and how to input data into the input form.");
    return new ModelAndView("/pages/workflow.jsp", model);
  }
}
