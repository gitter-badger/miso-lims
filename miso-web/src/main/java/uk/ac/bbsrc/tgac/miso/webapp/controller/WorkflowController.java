package uk.ac.bbsrc.tgac.miso.webapp.controller;

import java.io.IOException;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import uk.ac.bbsrc.tgac.miso.core.data.workflow.Workflow;
import uk.ac.bbsrc.tgac.miso.core.data.workflow.WorkflowStepPrompt;
import uk.ac.bbsrc.tgac.miso.service.workflow.WorkflowManager;

@RequestMapping("/workflow")
@Controller
public class WorkflowController {
  @Autowired
  WorkflowManager workflowManager;

  @RequestMapping("/new/{workflowName}")
  public ModelAndView createWorkflow(@PathVariable String workflowName, ModelMap model) throws IOException {
    Workflow workflow = workflowManager.beginWorkflow(workflowName);

    model.put("title", workflow.getName());

    model.put("workflowId", workflow.getProgress().getId());
    WorkflowStepPrompt prompt = workflow.getNextStep();
    model.put("message", prompt.getMessage());

    return new ModelAndView("/pages/workflow.jsp", model);
  }

  @RequestMapping("/edit/{id}")
  public ModelAndView editWorkflow(@PathVariable long id, ModelMap model) throws IOException {
    Workflow workflow = workflowManager.loadWorkflow(id);
    model.put("title", workflow.getName());
    model.put("message", workflow.getNextStep().getMessage());
    return new ModelAndView("/pages/workflow.jsp", model);
  }
}
