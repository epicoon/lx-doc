/**
 * @const lx.Application App
 * @const lx.Plugin Plugin
 * @const lx.Snippet Snippet
 * */

#lx:use lx.Input;
#lx:use lx.Dropbox;
#lx:use lx.ActiveBox;
#lx:use lx.TreeBox;

Snippet.onload(()=>{#lx:require onclient;});

var packagesName = Plugin.renderParams.packagesName;

var headerHeight = '50px';
var classesWidth = '320px';

var header = new lx.Box({
	height: headerHeight
});
header.fill('lightgray');
header.add(lx.TextBox, {
	key: 'packageDocumentation',
	text: #lx:i18n(package_documentation)
});
header.add(lx.Dropbox, {
	key: 'packagesName',
	size: ['30%', '60%'],
	options: packagesName
});
header.align({
	horizontal: lx.LEFT,
	vertical: lx.MIDDLE,
	paddingLeft: '20px'
});


var classes = new lx.ActiveBox({
	key: 'classesBox',
	top: headerHeight,
	width: classesWidth,
	resize: false,
	adhesive: true
});
classes.border({color: 'gray'});
classes.gridProportional({indent: '10px'});
classes.begin();
	(new lx.Box({size:[3, 1], key:'find', text:#lx:i18n(find)})).align(lx.CENTER, lx.MIDDLE);
	new lx.Input({size:[9, 1], key:'findClass'});
	new lx.TreeBox({size:[12, 18], key:'classesTree'});
classes.end();

var classBoxWrapper = new lx.ActiveBox({
	top: headerHeight,
	left: classesWidth,
	resize: false,
	adhesive: true
});
classBoxWrapper.border({color: 'gray'});
classBoxWrapper.overflow('auto');

classBoxWrapper.add(lx.Box, {key:'classBox'});
