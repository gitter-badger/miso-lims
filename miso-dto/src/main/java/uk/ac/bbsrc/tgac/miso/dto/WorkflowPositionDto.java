package uk.ac.bbsrc.tgac.miso.dto;

import static uk.ac.bbsrc.tgac.miso.core.data.workflow.ProgressStep.InputType;

import java.util.List;
import java.util.Set;

public class WorkflowPositionDto {
  private String message;
  private Set<InputType> inputTypes;
  private List<String> log;
  private int currentStep;
  private long workflowId;

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

  public int getCurrentStep() {
    return currentStep;
  }

  public void setCurrentStep(int currentStep) {
    this.currentStep = currentStep;
  }

  public long getId() {
    return workflowId;
  }

  public void setId(long workflowId) {
    this.workflowId = workflowId;
  }
}
