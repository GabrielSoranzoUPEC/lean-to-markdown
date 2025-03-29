// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "lean-to-markdown" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('lean-to-markdown.show_markdown', () => {
		// Create and show panel
		const panel = vscode.window.createWebviewPanel(
		  'LeanInMarkdown',
		  'Lean in Markdown',
		  vscode.ViewColumn.Beside,
		  { enableScripts: true }
		);
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('Aucun fichier Lean ouvert.');
			return;
		  }
		const leanContent = editor.document.getText();
		const markdownContent = convertLeanToMarkdown2(leanContent);
		//const markdownContent='Coucou **2**';
		// And set its HTML content
		panel.webview.html = getWebviewContent(markdownContent);
	  });

	  const disposable2 = vscode.commands.registerCommand('lean-to-markdown.show_markdown2', () => {
		// Create and show panel
		const editor = vscode.window.activeTextEditor;


		if (!editor) {
			vscode.window.showErrorMessage('Aucun fichier Lean ouvert.');
			return;
		  }
		const leanContent = editor.document.getText();
		const markdownContent = convertLeanToMarkdown2(leanContent);

		// Ecrire mardownContent dans le fichier temp.md
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders) {
			vscode.window.showErrorMessage("Aucun dossier ouvert dans l'espace de travail.");
			return;
		}
	
		const path = require('path');
		const filePath = editor.document.fileName;
		// Récupère le nom du fichier sans extension
		const fileNameWithoutExt = path.basename(filePath, path.extname(filePath)); // "monfichier"
		// Concatène le nouveau suffixe
		const newFileName = fileNameWithoutExt + '.md'; // "monfichier.md"
		const tempFilePath = vscode.Uri.joinPath(workspaceFolders[0].uri, 'md_temp', newFileName);
	
		// Écrire le contenu dans le fichier.md
		try {
			vscode.workspace.fs.writeFile(tempFilePath, Buffer.from(markdownContent, 'utf8'));
			vscode.window.showInformationMessage('Fichier '+newFileName+' mis à jour.');


			// Ouvrir le fichier dans l'éditeur
			//const document = vscode.workspace.openTextDocument(tempFilePath);
			//vscode.window.showTextDocument(document, vscode.ViewColumn.Beside);

			// Ouvrir le previewer Markdown
			vscode.commands.executeCommand("markdown.showPreview", tempFilePath);
		} catch (error) {
			vscode.window.showErrorMessage(`Erreur lors de l'écriture du fichier : ${error}`);
		}
	  });



	context.subscriptions.push(disposable, disposable2);
}


function convertLeanToMarkdown2(content) {
	const lines = content.split('\n');
	let md = '';
	let commentBlock = '';
	let codeBlock = '';
	let state= '';

	for (const line of lines) {
		if (line.trim().startsWith('--')) {
			if (state=='codeBlock'){
				md += '```lean\n' + codeBlock.trim() + '\n```\n';
				codeBlock='';
				state='';
			}
			md += line.replace(/^--\s?/, '') + '\n\n';
		}
		else if(line.trim()=='/-'){
			if(state=='codeBlock'){
				md += '```lean\n' + codeBlock.trim() + '\n```\n';
				codeBlock='';
				state='';				
			}
			state='commentBlock';
		} 
		else if(line.trim().startsWith('/-')){
			if(state=='codeBlock'){
				md += '```lean\n' + codeBlock.trim() + '\n```\n';
				codeBlock='';
				state='';				
			}
			state='commentBlock';
			commentBlock += line.trim().slice(2).replace(/^--\s?/, '') + '\n';		
		}
		else if(line.trim()=='-/'){
			md += commentBlock+'\n';
			state='';
			commentBlock='';			
		}
		else if(line.trim().slice(-2)=='-/'){
			commentBlock += line.trim().slice(0,-2).replace(/^--\s?/, '') + '\n';
			md += commentBlock+'\n';
			state='';
			commentBlock='';
		}
		else if(state=='codeBlock'){
			codeBlock += line + '\n';
		}
		else if(state=='commentBlock'){
			commentBlock += line.replace(/^--\s?/, '') + '\n';
		}
		else{
			if(line.trim()!=''){
				state='codeBlock';
				codeBlock += line + '\n';
			}
		}
	}
	// Ajouter le dernier bloc de code s'il existe
	if (state=='codeBlock') {
		md += '```lean\n' + codeBlock.trim() + '\n```\n';
	}
	else if(state=='commentBlock'){
		md += commentBlock+'\n';
	}

	return md.trim();
}
  
  function getWebviewContent(mdContent) {
	return `<!DOCTYPE html>
  <html lang="en">
  <head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>Cat Coding</title>
  </head>
  <body>
	  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
	  <div id="content"></div>
	  <script>
	  	const md = \`${mdContent.replace(/`/g, '\\`')}\`;
    	document.getElementById('content').innerHTML = marked.parse(md);
  	  </script>
  </body>
  </html>`;
  }

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
