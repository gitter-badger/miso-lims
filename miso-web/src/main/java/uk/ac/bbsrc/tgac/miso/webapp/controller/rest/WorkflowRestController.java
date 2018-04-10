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
import uk.ac.bbsrc.tgac.miso.dto.WorkflowPositionDto;
import uk.ac.bbsrc.tgac.miso.service.workflow.WorkflowManager;

@Controller
@RequestMapping("/rest/workflow")
public class WorkflowRestController extends RestController {
  @Autowired
  WorkflowManager workflowManager;

  @RequestMapping(value = "/process", method = RequestMethod.POST)
  public @ResponseBody WorkflowPositionDto process(@RequestParam("input") String input, @RequestParam("id") long id) throws IOException {
    Workflow workflow = workflowManager.loadWorkflow(id);
    workflowManager.processInput(workflow, input);
    if (workflow.isComplete()) {
      workflowManager.execute(workflow);
      return null;
    }

    WorkflowStepPrompt prompt = workflow.getNextStep();
    WorkflowPositionDto workflowPositionDto = new WorkflowPositionDto();
    workflowPositionDto.setMessage(prompt.getMessage());
    workflowPositionDto.setInputTypes(prompt.getDataTypes());

    return workflowPositionDto;
  }
}
