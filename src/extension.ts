import * as vscode from 'vscode';
import { ETIMEDOUT } from 'constants';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.docs-no-localization', () => {

		const editor: vscode.TextEditor = vscode.window.activeTextEditor;

		if (editor !== undefined) {
			const lang = editor.document.languageId;
			const selection = editor.selection;
			const text = editor.document.getText(selection);
			let newText: string;
			switch (lang) {
				case "yaml":
					newText = 'noloc:\r\n- ' + (text.length <= 0 ? 'Word-To-Not-Localize' : text);
					break;
				case "markdown":
					newText = ':::noloc text="' + (text.length <= 0 ? 'Word-To-Not-Localize' : text) + '":::';
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
						switch (language.detail) {
							case "markdown":
								newText = ':::noloc text="' + (text.length <= 0 ? 'Word-To-Not-Localize' : text) + '":::';
								break;
							default:
								newText = 'noloc:\r\n- ' + (text.length <= 0 ? 'Word-To-Not-Localize' : text);
								break;
						}
						editor.edit(builder => builder.replace(selection, newText));
					});

					break;
			}
			if (newText.length > 0) {
				editor.edit(builder => builder.replace(selection, newText));
			}
		} else {
			vscode.window.showErrorMessage('You must have a file open to use the `Docs No Localization` extension');
		}
	});
	context.subscriptions.push(disposable);
}

export function deactivate() { }
