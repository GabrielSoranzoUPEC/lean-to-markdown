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
	
		const tempFilePath = vscode.Uri.joinPath(workspaceFolders[0].uri, 'temp.md');
	
		// Écrire le contenu dans temp.md
		try {
			vscode.workspace.fs.writeFile(tempFilePath, Buffer.from(markdownContent, 'utf8'));
			vscode.window.showInformationMessage('Fichier temp.md mis à jour.');


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


function convertLeanToMarkdown(content) {
	// Exemple basique : séparez commentaires et code
	const lines = content.split('\n');
	let md = '';
	for (const line of lines) {
	  if (line.trim().startsWith('--')) {
		// Traiter le commentaire (peut contenir du Markdown)
		md += line.replace('--', '') + '\n\n';
	  } else {
		// Encapsuler le code dans un bloc
		md += '```lean\n' + line + '\n```\n\n';
	  }
	}
	return md;
  }

  function convertLeanToMarkdown2(content) {
    const lines = content.split('\n');
    let md = '';
    let commentBlock = '';
    let codeBlock = '';
    let inCodeBlock = false;

    for (const line of lines) {
        if (line.trim().startsWith('--')) {
			// Si un bloc de code était en cours, l'ajouter au Markdown
			if (inCodeBlock){
				md +=  '```lean\n' + codeBlock.trim() + '\n```\n\n';
				inCodeBlock=false;
			}
            // Ajouter au bloc de commentaires
            commentBlock += line.replace(/^--\s?/, '') + '\n';
        } else {
            // Si un bloc de commentaires était en cours, l'ajouter au Markdown
            if (commentBlock) {
                md += commentBlock.trim() + '\n\n';
                commentBlock = '';
            }
            
            // Ajouter au bloc de code
            if (line.trim()) { // Éviter les lignes vides dans le code
                codeBlock += line + '\n';
                inCodeBlock = true;
            }
        }
    }

    // Ajouter le dernier bloc de code s'il existe
    if (codeBlock) {
        md += '```lean\n' + codeBlock.trim() + '\n```';
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
