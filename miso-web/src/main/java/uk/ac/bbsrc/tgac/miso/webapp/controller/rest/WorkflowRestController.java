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

    return toDto(workflow, stepNumber + 1);
  }

  /**
   * Represent workflow at the given stepNumber. If the workflow is complete and stepNumber does not point to a valid step, do not set the
   * message, inputTypes, or stepNumber fields of the WorkflowStateDto
   */
  private WorkflowStateDto toDto(Workflow workflow, int stepNumber) {
    WorkflowStateDto workflowStateDto = new WorkflowStateDto();
    workflowStateDto.setWorkflowId(workflow.getProgress().getId());
    workflowStateDto.setLog(workflow.getLog());
    workflowStateDto.setStepNumber(stepNumber);

    if (workflow.isComplete() && stepNumber >= workflow.getLog().size()) {
      workflowStateDto.setMessage(workflow.getConfirmMessage());
    } else {
      WorkflowStepPrompt prompt = workflow.getStep(stepNumber);
      workflowStateDto.setMessage(prompt.getMessage());
      workflowStateDto.setInputTypes(prompt.getInputTypes());
    }

    return workflowStateDto;
  }

  @RequestMapping(value = "/execute", method = RequestMethod.POST)
  public @ResponseBody void execute(@RequestParam("id") long id) throws IOException {
    workflowManager.execute(workflowManager.loadWorkflow(id));
  }

  @RequestMapping(value = "/getstep", method = RequestMethod.GET)
  public @ResponseBody WorkflowStateDto getStep(@RequestParam("id") long id, @RequestParam("stepNumber") int stepNumber)
      throws IOException {
    Workflow workflow = workflowManager.loadWorkflow(id);
    return toDto(workflow, stepNumber);
  }
}
