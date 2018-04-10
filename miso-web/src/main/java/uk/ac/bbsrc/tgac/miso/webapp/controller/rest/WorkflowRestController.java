package uk.ac.bbsrc.tgac.miso.webapp.controller.rest;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import uk.ac.bbsrc.tgac.miso.core.data.workflow.Workflow;
import uk.ac.bbsrc.tgac.miso.core.data.workflow.WorkflowStepPrompt;
import uk.ac.bbsrc.tgac.miso.dto.WorkflowStateDto;
import uk.ac.bbsrc.tgac.miso.service.workflow.WorkflowManager;

@Controller
@RequestMapping("/rest/workflow")
public class WorkflowRestController extends RestController {
  @Autowired
  WorkflowManager workflowManager;

  @RequestMapping(value = "/process", method = RequestMethod.POST)
  public @ResponseBody WorkflowStateDto process(@RequestParam("input") String input, @RequestParam("id") long id) throws IOException {
    Workflow workflow = workflowManager.loadWorkflow(id);
    workflowManager.processInput(workflow, input);

    WorkflowStateDto workflowStateDto = new WorkflowStateDto();
    workflowStateDto.setWorkflowId(id);
    workflowStateDto.setLog(workflow.getLog());
    if (!workflow.isComplete()) {
      WorkflowStepPrompt prompt = workflow.getNextStep();
      workflowStateDto.setMessage(prompt.getMessage());
      workflowStateDto.setInputTypes(prompt.getInputTypes());
    }

    return workflowStateDto;
  }

  @RequestMapping(value = "/execute", method = RequestMethod.POST)
  public @ResponseBody WorkflowStateDto execute(@RequestParam("id") long id) throws IOException {
    workflowManager.execute(workflowManager.loadWorkflow(id));
    return new WorkflowStateDto();
  }
}
