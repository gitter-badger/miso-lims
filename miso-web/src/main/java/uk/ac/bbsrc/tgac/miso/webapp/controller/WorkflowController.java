package uk.ac.bbsrc.tgac.miso.webapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class WorkflowController {
  @RequestMapping("/workflow")
  public ModelAndView editWorkflow(ModelMap model) {
    model.put("title", "Workflow title");
    model.put("message", "This is the user message describing what and how to input data into the input form.");
    return new ModelAndView("/pages/workflow.jsp", model);
  }
}
