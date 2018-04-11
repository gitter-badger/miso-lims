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
  public @ResponseBody WorkflowStateDto process(@RequestParam("id") long id, @RequestParam("stepNumber") int stepNumber,
      @RequestParam("input") String input) throws IOException {
    Workflow workflow = workflowManager.loadWorkflow(id);
    workflowManager.processInput(workflow, stepNumber, input);

    return toWorkflowStateDto(workflow, id, stepNumber);
  }

  private WorkflowStateDto toWorkflowStateDto(Workflow workflow, long id, int stepNumber) {
    WorkflowStateDto workflowStateDto = new WorkflowStateDto();
    workflowStateDto.setWorkflowId(id);
    workflowStateDto.setLog(workflow.getLog());

    if (!workflow.isComplete()) {
      int nextStepNumber = stepNumber + 1;
      WorkflowStepPrompt prompt = workflow.getStep(nextStepNumber);
      workflowStateDto.setMessage(prompt.getMessage());
      workflowStateDto.setInputTypes(prompt.getInputTypes());
      workflowStateDto.setStepNumber(nextStepNumber);
    }

    return workflowStateDto;
  }

  @RequestMapping(value = "/execute", method = RequestMethod.POST)
  public @ResponseBody void execute(@RequestParam("id") long id) throws IOException {
    workflowManager.execute(workflowManager.loadWorkflow(id));
  }

  @RequestMapping(value = "/setstep", method = RequestMethod.GET)
  public @ResponseBody WorkflowStateDto setStep(@RequestParam("id") long id, @RequestParam("stepNumber") int stepNumber)
      throws IOException {
    Workflow workflow = workflowManager.loadWorkflow(id);
    return toWorkflowStateDto(workflow, id, stepNumber);
  }
}
