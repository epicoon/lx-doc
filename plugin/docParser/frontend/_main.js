/**
 * @const {lx.Plugin} Plugin
 * @const {lx.Snippet} Snippet
 */

#lx:require Viewer;


const classesTreeBox = Plugin->>classesTree;
const classBox = Plugin->>classBox;
classBox.stream({indent: '10px'});


let selectedClass = null;

const viewer = new doc.Viewer(classBox);


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


classesTreeBox.setLeaf(function(leaf) {
	leaf.style('cursor', 'pointer');

	var node = leaf.node;
	if (node.empty()) {
		leaf->label.text(node.key);
		if (node.key == selectedClass) leaf->label.fill('lightgreen');
		leaf->label.click(()=>selectClass(node.key));
	} else {
		if (node.title) leaf->label.text(node.title);
		else leaf->label.text(node.key);

		leaf->label.click(function() { this~>open.trigger('click'); });
	}
});

Plugin->>packagesName.options(Plugin.attributes.packagesName);

Plugin->>packagesName.on('change', function() {
	var packageName = this.selectedText();
	^Respondent.getPackageInfo(packageName).then((res)=>{
		viewer.docData = res;
		viewer.makeMainTree(res);
	});
});

