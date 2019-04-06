/**
 * @const lx.Module Module
 * */

 #lx:require Viewer;


const viewer = new doc.Viewer();
const classesTreeBox = Module->>classesTree;
const classBox = Module->>classBox->body;

let docData = {};
let selectedClass = null;


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


classBox.stream({indent: '10px'});

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



Module->>packageNames.on('change', function() {
	var packageName = this.selectedText();
	^Respondent.getPackageInfo(packageName):(res)=>{
		docData = res;
		viewer.makeMainTree(res);
	};
});

