package uk.ac.bbsrc.tgac.miso.core.data.workflow;

import java.io.IOException;
import java.util.List;

import uk.ac.bbsrc.tgac.miso.core.data.workflow.impl.LoadSequencerWorkflow;
import uk.ac.bbsrc.tgac.miso.core.data.workflow.impl.TestWorkflow;

public interface Workflow {
  Progress getProgress();

  void setProgress(Progress progress);

  WorkflowStepPrompt getNextStep();

  /**
   * @param stepNumber step index
   */
  WorkflowStepPrompt getStep(int stepNumber);

  /**
   * @return whether input has been received for all steps
   */
  boolean isComplete();

  /**
   * @return list of log messages for each step
   */
  List<String> getLog();

  /**
   * Validate and store input for the current step, which corresponds to the result of getNextStep.
   */
  void processInput(ProgressStep step);

  /**
   * Validate and store input for a step identified by the 0-indexed stepNumber.
   * If stepNumber refers to a previous step, an implementation may or may not choose to invalidate future steps.
   */
  void processInput(int stepNumber, ProgressStep step);

  /**
   * Removes the latest step and any effects it caused.
   * Has no effect if no input has been processed.
   */
  void cancelInput();

  void execute(WorkflowExecutor workflowExecutor) throws IOException;

  /**
   * @return proper name of workflow, for display purposes
   */
  String getName();

  /**
   * Represents a type of Workflow.  Should have a one-to-one correspondence with every implementation of Workflow
   */
  enum WorkflowName {
    LOAD_SEQUENCER {
      @Override
      public Workflow createWorkflow() {
        return new LoadSequencerWorkflow();
      }
    }, TEST_WORKFLOW {
      @Override
      protected Workflow createWorkflow() {
        return new TestWorkflow();
      }
    };

    public Workflow createWorkflow(Progress progress) {
      Workflow workflow = createWorkflow();
      workflow.setProgress(progress);
      return workflow;
    }

    protected abstract Workflow createWorkflow();
  }
}
