import * as vscode from 'vscode';

const sampleString: string = 'String-To-Not-Localize';
const sampleArray: string = 'Words, to not, Localize';
const sampleYaml: string = 'Strings\r\n    - to not\r\n    - Localize';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.docs-no-localization', () => {
		if (vscode.window.activeTextEditor !== undefined) {
			const editor: vscode.TextEditor = vscode.window.activeTextEditor;
			const lang = editor.document.languageId;
			const selectedText = editor.selection;
			const text = editor.document.getText(selectedText);
			const textEmpty = selectedText.isEmpty;
			let newText: string = '';
			let langSelect = '';
			switch (lang) {
				case "markdown2":
					newText = outputNoLoc(lang, text, textEmpty);
					break;
				case "yaml2":
					newText = outputNoLoc(lang, text, textEmpty);
					break;
				default:
					const items: vscode.QuickPickItem[] = [{
						'label': 'markdown',
						'description': 'add a placeholder to use within markdown (this applies only the identified strings)',
						'detail': 'markdown'
					},
					{
						'label': 'metadata (yaml or markdown)',
						'description': 'add placeholder to use within the metadata section of your page (this applies to all content within this document)',
						'detail': 'metadata'
					},
					{
						'label': 'toc-global',
						'description': 'add placeholder to use for at the top of the toc yaml file (this applies to all the content with this documents)',
						'detail': 'toc-global'
					},
					{
						'label': 'toc-individual',
						'description': 'add placeholder to use within your toc yaml (this will only applies to the above node)',
						'detail': 'toc-individual'
					},
					{
						'label': 'yaml-individual',
						'description': 'add placeholder to use within your yaml (this will only applies to the above node)',
						'detail': 'yaml-individual'
					}];

					const options: vscode.QuickPickOptions = {
						placeHolder: 'Select which type (or area) of document you are working with'
					};
					vscode.window.showQuickPick(items, options).then(language => {
						if (!language) {
							return;
						}
						if (language.detail !== undefined) {
							langSelect = language.detail;
							newText = outputNoLoc(langSelect, text, textEmpty);
						}
						editor.edit(builder => builder.replace(selectedText, newText));
					});

					break;
			}

			if (newText.length > 0) {
				editor.edit(builder => builder.replace(selectedText, newText));
				selectNewText(langSelect, editor);
			}
		} else {
			vscode.window.showErrorMessage('You must have a file open to use the `Docs No Localization` extension');
		}
	});
	context.subscriptions.push(disposable);
}

export function deactivate() { }

function outputNoLoc(language: string, text: String, emptyText: boolean): string {
	let outText: string = '';
	switch (language) {
		case "markdown":
			outText = ':::no-loc text="' + (emptyText ? sampleString : text) + '":::';
			break;
		case "metadata":
			outText = '\r\nno-loc: [' + (emptyText ? sampleArray : text) + ']';
			break;
		case "toc-global":
			outText = '\r\n\\\\this is required at the top level of the file\r\nmetadata:\r\n  no-loc:\r\n    - ' + (emptyText ? sampleYaml : text);
			break;
		case "toc-individual":
			outText = '\r\nno-loc:\r\n  - ' + (emptyText ? sampleString : text);
			break;
		case "yaml-individual":
			outText = '\r\nno-loc:\r\n  - ' + (emptyText ? sampleString : text);
			break;
	}

	return outText;
}

function selectNewText(language: string, editor: vscode.TextEditor) {
	const range: vscode.Position = new vscode.Position(1, 5);
	let samples: string = '';
	editor.document.getWordRangeAtPosition(range);
	console.log(editor.document.getText(editor.selection));
	switch (language) {
		case "markdown":
			samples = sampleString;
			break;
		case "metadata":
			samples = sampleArray;
			break;
		case "toc-global":
			samples = sampleArray;
			break;
		case "toc-individual":
			samples = sampleYaml;
			break;
		case "yaml-individual":
			samples = sampleYaml;
			break;
	}
	
}