/*
 * @Description: chinese-to-pascal-pinyin
 * @Version: 1.0
 * @Author: WangBo
 * @Date: 2025-07-04 12:32:17
 * @LastEditors: WangBo
 * @LastEditTime: 2025-07-04 12:57:44
 */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import pinyin from "pinyin";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	/*
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "chinese-to-pascal-pinyin" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand("chinese-to-pascal-pinyin.helloWorld", () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage("Hello World from chinese-to-pascal-pinyin!");
	});

	context.subscriptions.push(disposable);
	*/
	let disposable = vscode.commands.registerCommand("chinese-to-pascal-pinyin.convert", () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return; // No open text editor
		}

		const document = editor.document;
		const selection = editor.selection;

		// 获取选中的文本
		const selectedText = document.getText(selection);
		if (!selectedText) {
			vscode.window.showInformationMessage("Please select some Chinese text to convert.");
			return;
		}

		// 将中文转换为拼音
		const pinyinArray = pinyin(selectedText, {
			heteronym: false, // 不处理多音字
			segment: true, // 分词
			style: pinyin.STYLE_NORMAL, // 普通拼音，例如 "ni hao"
		});

		// 将二维数组的拼音合并成一个字符串，并处理为大驼峰
		let pascalPinyin = "";
		for (const words of pinyinArray) {
			for (const word of words) {
				if (word) {
					// 确保不是空字符串
					pascalPinyin += word.charAt(0).toUpperCase() + word.slice(1);
				}
			}
		}

		// 替换选中的文本
		editor.edit((editBuilder) => {
			editBuilder.replace(selection, pascalPinyin);
		});

		vscode.window.showInformationMessage(`Converted to Pascal Pinyin: ${pascalPinyin}`);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
