import { WorkflowProcess } from "../enums";

export interface TaskList {
  id?: number;
  description?: string;
  isCompleted?: boolean;
  processName?: WorkflowProcess;
}
