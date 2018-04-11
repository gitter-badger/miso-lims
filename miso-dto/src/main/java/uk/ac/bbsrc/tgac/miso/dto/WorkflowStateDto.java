package uk.ac.bbsrc.tgac.miso.dto;

import static uk.ac.bbsrc.tgac.miso.core.data.workflow.ProgressStep.InputType;

import java.util.List;
import java.util.Set;

/**
 * Represents a user's position in a Workflow
 */
public class WorkflowStateDto {
  private int stepNumber;
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

  public int getStepNumber() {
    return stepNumber;
  }

  public void setStepNumber(int stepNumber) {
    this.stepNumber = stepNumber;
  }
}
