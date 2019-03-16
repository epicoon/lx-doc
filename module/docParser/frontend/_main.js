/**
 * @const lx.Module Module
 * */

 #lx:require Viewer;


const viewer = new doc.Viewer();
const classesTreeBox = Module->>classesTree;
const classBox = Module->>classBox->body;

let docData = {};
let selectedClass = null;


function applyI18n(data) {
	if (data) lx.data.i18n = data;
	for (var key in lx.data.i18n) {
		var el = Module.findOne(key);
		if (!el) continue;
		el.text(lx.data.i18n[key]);
	}
	Module->>classesTree.renew();
	reselectClass();
}
applyI18n();


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
		if (node.key in lx.data.i18n) leaf->label.text(lx.data.i18n[node.key]);
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


Module->>lang.on('change', function() {
	^Respondent.changeLang(this.selectedText()):(res)=>applyI18n(res);
});
