// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {previewDoc} from './preview';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('seotools.start', () => {
		const panel = vscode.window.createWebviewPanel(
			'seoTools',
			'SEO Tools',
			vscode.ViewColumn.Beside,
			{}
		);

		const updateView = () => {
			panel.webview.html = previewDoc(context);
		}

		updateView();

		setInterval(updateView, 1000);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
