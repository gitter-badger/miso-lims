package uk.ac.bbsrc.tgac.miso.dto;

import static uk.ac.bbsrc.tgac.miso.core.data.workflow.ProgressStep.InputType;

import java.util.List;
import java.util.Set;

/**
 * Represents a user's position in a Workflow
 */
public class WorkflowStateDto {
  private long workflowId;
  private String message;
  private Set<InputType> inputTypes;
  private List<String> log;

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public Set<InputType> getInputTypes() {
    return inputTypes;
  }

  public void setInputTypes(Set<InputType> inputTypes) {
    this.inputTypes = inputTypes;
  }

  public List<String> getLog() {
    return log;
  }

  public void setLog(List<String> log) {
    this.log = log;
  }

  public long getWorkflowId() {
    return workflowId;
  }

  public void setWorkflowId(long workflowId) {
    this.workflowId = workflowId;
  }
}
