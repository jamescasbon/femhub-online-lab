
FEMhub.CellEditor = Ext.extend(Ext.Window, {
    htmlEditor: null,

    constructor: function(config) {
        config = config || {};

        this.addEvents({
            'savecell': true,
        });

        this.htmlEditor = new Ext.form.HtmlEditor({
            enableSourceEdit: false,
            border: false,
        });

        this.htmlEditor.setValue(config.content || "");

        Ext.apply(config, {
            title: "Edit cell",
            layout: 'fit',
            width: 550,
            height: 300,
            maximizable: true,
            minimizable: true,
            closable: true,
            onEsc: Ext.emptyFn,
            items: this.htmlEditor,
            buttons: [{
                text: 'Save',
                handler: function() {
                    this.saveCell();
                },
                scope: this,
            }, {
                text: 'Cancel',
                handler: function() {
                    if (this.isModified()) {
                        Ext.MessageBox.show({
                            title: 'Cell editor',
                            msg: 'There are unsaved modifications. Do you want to save them before closing?',
                            buttons: Ext.MessageBox.YESNO,
                            icon: Ext.MessageBox.QUESTION,
                            fn: function(button) {
                                if (button === 'yes') {
                                    this.saveCell();
                                } else {
                                    this.close();
                                }
                            },
                            scope: this,
                        });
                    } else {
                        this.close();
                    }
                },
                scope: this,
            }],
        });

        FEMhub.CellEditor.superclass.constructor.call(this, config);
    },

    isModified: function() {
        return this.htmlEditor.isDirty();
    },

    saveCell: function() {
        this.fireEvent('savecell', this.htmlEditor.getValue());
        this.close();
    },
});
