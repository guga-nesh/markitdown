class Note {
    constructor(title, text, id = Math.floor(Math.random() * 10000)) {
        this.title = title;
        this.text = text;
        this.id = id
    }

    static createNewNote() {
        return new Note("", "");
    }

    static createNewNoteWithTitle(title) {
        return new Note(title, "");
    }

    static getPlaceHolderNote() {
        return new Note("Placeholder Title", "# Placeholder Text\n---\n## More Placeholder Text");
    }

    static getTextUpdatedNote(oldNote, text) {
        return new Note(oldNote.title, text, oldNote.id);
    }

    static getPlaceHolderNotes() {
        return [
            Note.getPlaceHolderNote(),
            Note.getPlaceHolderNote(),
            Note.getPlaceHolderNote(),
            Note.getPlaceHolderNote(),
            Note.getPlaceHolderNote(),
            Note.getPlaceHolderNote(),
            Note.getPlaceHolderNote(),
            Note.getPlaceHolderNote(),
            Note.getPlaceHolderNote(),
            Note.getPlaceHolderNote(),
            Note.getPlaceHolderNote(),
            Note.getPlaceHolderNote()
        ];
    }
}

export default Note;