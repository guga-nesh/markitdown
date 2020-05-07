class Note {
    constructor(title, text) {
        this.title = title;
        this.text = text;
    }

    static getNewNote() {
        return new Note("", "");
    }

    static getPlaceHolderNote() {
        return new Note("Placeholder Title", "# Placeholder Text\n---\n## More Placeholder Text");
    }

    static getTextUpdatedNote(oldNote, text) {
        return new Note(oldNote.title, text);
    }
}

export default Note;