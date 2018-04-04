package uk.ac.bbsrc.tgac.miso.webapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class WorkflowController {
  @RequestMapping("/workflow")
  public ModelAndView editWorkflow(ModelMap model) {
    return new ModelAndView("/pages/workflow.jsp", model);
  }
}
