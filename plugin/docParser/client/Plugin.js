#lx:require Viewer;

class Plugin extends lx.Plugin {
    run() {
        const classesTreeBox = this->>classesTree;
        const classBox = this->>classBox;
        classBox.stream({indent: '10px'});


        let selectedClass = null;

        const viewer = new lxdoc.Viewer(this, classBox);


        function selectClass(className) {
            if (selectedClass == className) return;
            selectedClass = className;
            viewer.showClass(className);
            classesTreeBox.renew();
        }
        function reselectClass() {
            if (selectedClass === null) return;
            viewer.showClass(selectedClass);
            classesTreeBox.renew();
        }


        classesTreeBox.setLeafRenderer(function(leaf) {
            leaf.style('cursor', 'pointer');

            var node = leaf.node;
            if (node.isEmpty()) {
                leaf->label.text(node.key);
                if (node.key == selectedClass) leaf->label.fill('lightgreen');
                leaf->label.click(()=>selectClass(node.key));
            } else {
                if (node.title) leaf->label.text(node.title);
                else leaf->label.text(node.key);

                leaf->label.click(function() { this~>open.trigger('click'); });
            }
        });

        this->>servicesName.options(this.attributes.servicesName);

        this->>servicesName.on('change', function() {
            var packageName = this.selectedText();
            ^Respondent.getPackageInfo(packageName).then((res)=>{
                let data = res.data;
                viewer.docData = data;
                viewer.makeMainTree(data);
            });
        });
    }
}
