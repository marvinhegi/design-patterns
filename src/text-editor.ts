interface EditorState {
  onInput(): void;
  onSave(): void;
  onSaveAs(): void;
  onNew(): void;
  getLabel(): string;
  getFileName(): string | undefined;
}



class TextEditor {
  private textArea: HTMLTextAreaElement;
  private stateLabel: HTMLElement;
  private filesList: HTMLElement;
  private state: EditorState;

  constructor() {
    this.textArea = document.getElementById("text") as HTMLTextAreaElement;
    this.stateLabel = document.getElementById("state-label");
    this.filesList = document.getElementById("files-list");
    this.state = new CleanUnsavedState(this);
    this.init();
  }

  setState(state: EditorState) {
    this.state = state;
    this.updateLabel();
  }

  getContent(): string {
    return this.textArea.value;
  }

   setContent(content: string) {
    this.textArea.value = content;
  }

  updateLabel() {
    this.stateLabel.innerText = this.state.getLabel();
  }

  listFiles(): string[] {
    const files: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      files.push(localStorage.key(i));
    }
    return files;

  }

  showFiles() {
    while (this.filesList.firstChild) {
      this.filesList.removeChild(this.filesList.firstChild);
    }

    for (const file of this.listFiles()) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.innerHTML = file;
      item.appendChild(link);
      this.filesList.append(item);
      link.addEventListener("click", () => {
        const content = localStorage.getItem(file);
        this.setContent(content);
        this.setState(new CleanSavedState(this, file));
      });
    }

  }

  private init() {
    document.addEventListener("DOMContentLoaded", () => {

      this.showFiles();

      this.textArea.addEventListener("input", () => {
        this.state.onInput();
      });

      document.getElementById("save-button").addEventListener("click", () => {
        this.state.onSave();
        this.showFiles();
      });

      document.getElementById("save-as-button").addEventListener("click", () => {
        this.state.onSaveAs();
        this.showFiles();
      });

      document.getElementById("new-button").addEventListener("click", () => {
        this.state.onNew();
      });


      document.addEventListener("contextmenu", (event) => {
        alert("Wanna steal my source code, huh!?");
        event.preventDefault();
      });

    });
  }
}

 



class CleanUnsavedState implements EditorState {
  constructor(protected editor: TextEditor) {}


  onInput(): void {
    this.editor.setState(new DirtyUnsavedState(this.editor));
  }

  onSave(): void {
    this.onSaveAs();
  }

  onSaveAs(): void {
    const filename = prompt("Enter a file name", "");
    if (filename?.trim()) {
      const finalName = filename.endsWith(".txt") ? filename : filename + ".txt";
      localStorage.setItem(finalName, this.editor.getContent());
      this.editor.setState(new CleanSavedState(this.editor, finalName));
    }

  }

  onNew(): void {
    this.editor.setContent("");
    this.editor.setState(new CleanUnsavedState(this.editor));
  }

  getLabel(): string {
    return "*";
   }

  getFileName(): string | undefined {
    return undefined;
  }
}

class DirtyUnsavedState extends CleanUnsavedState {
  getLabel(): string {
     return "*";
   }

}

class CleanSavedState implements EditorState {


  constructor(protected editor: TextEditor, protected fileName: string) {}

  onInput(): void {
    this.editor.setState(new DirtySavedState(this.editor, this.fileName));
  }


  onSave(): void {
    localStorage.setItem(this.fileName, this.editor.getContent());
    this.editor.setState(new CleanSavedState(this.editor, this.fileName));
  }

  onSaveAs(): void {

    const filename = prompt("Enter a file name", "");
    if (filename?.trim()) {
      const finalName = filename.endsWith(".txt") ? filename : filename + ".txt";
      localStorage.setItem(finalName, this.editor.getContent());
      this.editor.setState(new CleanSavedState(this.editor, finalName));
    }
  }

  onNew(): void {
    this.editor.setContent("");
    this.editor.setState(new CleanUnsavedState(this.editor));
  }

  getLabel(): string {
    return this.fileName;
  }

   getFileName(): string | undefined {
    return this.fileName;
  }
}
 

class DirtySavedState extends CleanSavedState {
  getLabel(): string {
    return `${this.fileName} *`;
  }
}


new TextEditor();
