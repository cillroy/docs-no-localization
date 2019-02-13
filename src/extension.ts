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
				case "markdown2":
					newText = outputNoLoc(lang, text);
					break;
				case "yaml2":
					newText = outputNoLoc(lang, text);
					break;
				default:
					const items: vscode.QuickPickItem[] = [{
						'label': 'markdown',
						'description': 'add a placeholder to use within markdown (this applies only the identified strings)',
						'detail': 'markdown'
					},
					{
						'label': 'metadata',
						'description': 'add placeholder to use within the metada section of your page (this applies to all content within this document)',
						'detail': 'metadata'
					},
					{
						'label': 'yaml',
						'description': 'add placeholder to use within your yaml (this will only applies to the above node)',
						'detail': 'yaml'
					}];

					const options: vscode.QuickPickOptions = {
						placeHolder: 'Select which type (or area) of document you are working with'
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
	let outText: string = '';
	switch (language) {
		case "markdown":
			outText = ':::noloc text="' + (text.length <= 0 ? 'String-To-Not-Localize' : text) + '":::';
			break;
		case "metadata":
			// Can I tell if the current line is an empty string?
			outText = 'noloc: [' + (text.length <= 0 ? 'Words, to not, Localize' : text) + ']';
			break;
		case "yaml":
			// Can I tell if the current line is an empty string?
			outText = '\r\nnoloc:\r\n  - ' + (text.length <= 0 ? 'String-To-Not-Localize' : text);
			break;
	}

	return outText;
}
