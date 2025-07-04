/*
 * @Description: chinese-to-pascal-pinyin
 * @Version: 1.0
 * @Author: WangBo
 * @Date: 2025-07-04 12:32:17
 * @LastEditors: WangBo
 * @LastEditTime: 2025-07-04 13:15:11
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
			return; // 没有打开的文本编辑器
		}

		const document = editor.document;
		// 获取所有的选择区域，注意这里是 editor.selections
		const selections = editor.selections;

		// 使用 editor.edit 方法进行批量修改
		editor
			.edit((editBuilder) => {
				// 遍历所有的选择区域
				for (const selection of selections) {
					// 获取当前选择区域的文本
					const selectedText = document.getText(selection);
					if (!selectedText) {
						// 如果某个选择是空的，跳过
						continue;
					}

					// 将中文转换为拼音
					// 注意：pinyin 库默认不会处理太长的文本或复杂的标点，这里只做基础转换
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

					// 替换当前选择区域的文本
					// editBuilder.replace(selection, newText) 是关键
					editBuilder.replace(selection, pascalPinyin);
				}
			})
			.then((success) => {
				if (success) {
					vscode.window.showInformationMessage("Converted all selected Chinese text to Pascal Pinyin.");
				} else {
					vscode.window.showErrorMessage("Failed to convert selected text.");
				}
			});
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
