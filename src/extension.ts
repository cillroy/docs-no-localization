import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.docs-no-localization', () => {
		if (vscode.window.activeTextEditor !== undefined) {
			const editor: vscode.TextEditor = vscode.window.activeTextEditor;
			const lang = editor.document.languageId;
			const selectedText = editor.selection;
			const text = editor.document.getText(selectedText);
			let newText: string = '';
			switch (lang) {
				case "markdown":
					newText = outputNoLoc(lang, text);
					break;
				case "yaml":
					newText = outputNoLoc(lang, text);
					break;
				default:
					const items: vscode.QuickPickItem[] = [{
						'label': 'markdown',
						'description': 'add placeholder for markdown',
						'detail': 'markdown'
					},
					{
						'label': 'metadata',
						'description': 'add placeholder for metada',
						'detail': 'metadata'
					},
					{
						'label': 'yaml',
						'description': 'add placeholder for yaml',
						'detail': 'yaml'
					}];

					const options: vscode.QuickPickOptions = {
						placeHolder: 'Select which type of document you are working with'
					};
					vscode.window.showQuickPick(items, options).then(language => {
						if (!language) {
							return;
						}
						let langSelect = language.detail;
						if (langSelect !== undefined) {
							newText = outputNoLoc(langSelect, text);
						}
						editor.edit(builder => builder.replace(selectedText, newText));
					});

					break;
			}

			if (newText.length > 0) {
				editor.edit(builder => builder.replace(selectedText, newText));
			}
		} else {
			vscode.window.showErrorMessage('You must have a file open to use the `Docs No Localization` extension');
		}
	});
	context.subscriptions.push(disposable);
}

export function deactivate() { }

function outputNoLoc(language: string, text: String): string {

	let outText: string;
	switch (language) {
		case "markdown":
			outText = ':::noloc text="' + (text.length <= 0 ? 'Word-To-Not-Localize' : text) + '":::';
			break;
		default:
			outText = 'noloc:\r\n- ' + (text.length <= 0 ? 'Word-To-Not-Localize' : text);
			break;
	}

	return outText;
}
