package uk.ac.bbsrc.tgac.miso.webapp.controller.rest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import uk.ac.bbsrc.tgac.miso.core.data.workflow.WorkflowStepPrompt;

@Controller
@RequestMapping("/rest/workflow")
public class WorkflowRestController extends RestController {
  @RequestMapping(value = "/process", method = RequestMethod.POST)
  public @ResponseBody WorkflowStepPrompt process(@RequestParam("input") String input) {
    return new WorkflowStepPrompt(null, null);
  }
}
