export interface View {
  displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
}

export class Presenter<V extends View> {
  private _view: V;

  protected constructor(view: V) {
    this._view = view;
  }

  protected get view(): V {
    return this._view;
  }

  public async doFailureReportingOperation(
    operation: () => Promise<void>,
    operationDescription: string,
    finallyOperation?: () => void
  ) {
    try {
      console.log("Doing the operation");
      await operation();
      console.log("Operation completed successfully");
    } catch (error) {
      console.log("Made it to catch block");
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${(error as Error).message}`
      );
    } finally {
      if (finallyOperation) {
        finallyOperation();
      }
    }
  }
}
