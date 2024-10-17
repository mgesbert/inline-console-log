import * as vscode from "vscode";

function inlineConsoleLog() {
  const editor = vscode.window.activeTextEditor;
  if (editor === undefined) {
    return;
  }
  editor.edit((editBuilder) => {
    editor.selections.forEach((selection) => {
      const selectedValue = editor.document.getText(selection);
      if (selectedValue.length > 0) {
        const value = `(console.log(${selectedValue}) ?? ${selectedValue})`;
        editBuilder.replace(selection, value);
      } else {
        const currentLineRange = editor.document.lineAt(
          selection.active.line
        ).range;
        const lineText = editor.document.getText(currentLineRange);
        const trimmedText = lineText.trim();
        const startCharacter = lineText.indexOf(trimmedText);
        const endCharacter = startCharacter + trimmedText.length;
        const trimmedRange = new vscode.Range(
          new vscode.Position(currentLineRange.start.line, startCharacter),
          new vscode.Position(currentLineRange.start.line, endCharacter)
        );
        const value = `(console.log(${trimmedText}) ?? ${trimmedText})`;
        editBuilder.replace(trimmedRange, value);
      }
    });
  });
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "inline-console-log.exec",
    () => {
      vscode.window.showInformationMessage(
        "Hello World from Inline Console Log!"
      );

      inlineConsoleLog();
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
