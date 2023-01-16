#lx:namespace lxdoc;
class Viewer {
	constructor(plugin, classBox) {
		this.plugin = plugin;
		this.classBox = classBox;
		this.docData = {};
	}

	makeMainTree(data) {
		var tree = new lx.Tree();
		var phpClassesNode = tree.add('i18n_php_classes');
		phpClassesNode.title = #lx:i18n(php_classes);

		for (var className in data.phpClasses) {
			var classData = data.phpClasses[className];

			if (classData.group) {
				if (!phpClassesNode.has(classData.group)) {
					var node = phpClassesNode.add(classData.group);

					//todo - сюда прокинуть перевод названия группы
					// node.title = 'eee';
				}
				phpClassesNode.get(classData.group).add(className);
			} else {
				phpClassesNode.add(className);
			}
		}

		this.plugin->>classesTree.setTree(tree);
	}

	showClass(className) {
		this.classBox.clear();
		var data = this.docData.phpClasses[className];

		this.createClassInfoBox(data);

		if (!data.interfaces.lxEmpty()) {
			this.createPartBox('interfaces', #lx:i18n(interfaces));
		}

		if (!data.traits.lxEmpty()) {
			this.createPartBox('traits', #lx:i18n(traits));
		}

		if (!data.constants.lxEmpty()) {
			this.createPartBox('constants', #lx:i18n(constants));
		}

		if (!data.properties.lxEmpty()) {
			this.createPartBox('properties', #lx:i18n(properties), function(){__propertiesToggle(this, data);});
		}

		if (!data.methods.lxEmpty()) {
			this.createPartBox('methods', #lx:i18n(methods), function(){__methodsToggle(this, data);});
		}
	}

	createClassInfoBox(data) {
		var e = new lx.Box({
			parent: this.classBox
		});
		e.border({color: 'gray'});

		var text = #lx:i18n(class) + ': ';
		if (data.isAbstract) text += 'abstract ';
		text += '<b>' + data.name + '</b>';
		if (data.parentClass) text += '<br>'
			+ #lx:i18n(parent_class) + ': '
			+ (new lx.TagRenderer({
				tag:'span',
				classList: ['parentClass'],
				content: data.parentClass
			})).toString();
		if (data.doc) {
			text += '<br><b>' + #lx:i18n(description) + ':</b>';
			text += '<br>' + __replaceRN(data.doc);
		}

		e.text(text);
		e->text.style('padding', '10px');
		e->text.style('line-height', 1.5);
		e.height( e->text.height('px') + 'px' );

		var parentClass = lx.app.domSelector.getWidgetsByClass('parentClass');
		if (!parentClass.isEmpty) parentClass.at(0).click(function() { selectClass(this.html()) });
	}

	/**
	 *
	 * */
	createPartBox(key, text, callback) {
		var box = new lx.Box({ parent:this.classBox, height: '40px' });
		box.border({color: 'gray'});

		var head = new lx.Box({
			parent: box,
			geom: true,
			height: '40px',
			style: {backgroundColor: 'lightgray'}
		});

		var but = new lx.Box({
			parent: head,
			key: 'but',
			text: '+',
			size: ['20px', '20px'],
			style: {cursor: 'pointer'},
			click: callback
		});
		but.align(lx.CENTER, lx.MIDDLE);
		but.fill('white');
		but.isClosed = true;

		new lx.TextBox({
			parent: head,
			key,
			text: text
		});

		head.align({
			indent: '10px',
			horizontal: lx.LEFT,
			vertical: lx.TOP
		});
	}
}

/******************************************************************************************************************************
 * PRIVATE
 *****************************************************************************************************************************/

function __propertiesToggle(but, data) {
	var box = but.parent.parent;
	if (but.isClosed) {
		var text = '';

		text += '<b>public:</b>';
		text += data.properties['public'].lxEmpty()
			? ' ' + #lx:i18n(none) + '<br>'
			: __renderProperties('public', data.properties['public']);
		text += '<br><b>protected:</b>';
		text += data.properties['protected'].lxEmpty()
			? ' ' + #lx:i18n(none) + '<br>'
			: __renderProperties('protected', data.properties['protected']);
		text += '<br><b>private:</b>';
		text += data.properties['private'].lxEmpty()
			? ' ' + #lx:i18n(none) + '<br>'
			: __renderProperties('private', data.properties['private']);

		var dataElem = new lx.Box({
			parent: box,
			key: 'data',
			coords: ['40px', '40px'],
			right: '40px'
		});

		dataElem.text(text);
		dataElem->text.style('padding', '10px');
		dataElem->text.style('line-height', 1.5);
		dataElem->text.style('width', '100%');
		function checkHeight() {
			dataElem.height( dataElem->text.height('px') + 'px' );
			box.height( 40 + dataElem.height('px') + 'px' );
		}
		checkHeight();

		lx.app.domSelector.getWidgetsByName('propBox').forEach(box=>box.click(function() {
			var el = lx.app.domSelector.getWidgetById('prop_doc_' + this.data.i);
			if (!el) return;
			el.style('display', this.data.isClosed ? 'block' : 'none');
			this.data.isClosed = !this.data.isClosed;
			checkHeight();
		}));

		but.text('-');
		but.isClosed = false;
	} else {
		box.del('data');
		box.height('40px');

		but.text('+');
		but.isClosed = true;
	}
}

function __renderProperties(type, list) {
	var text = '';

	var iterator = 0;
	for (var name in list) {
		var desc = list[name];
		var fullName = '';
		var doc = desc.doc ? desc.doc : null;

		if (desc.isStatic) fullName += (new lx.TagRenderer({
			tag: 'span',
			classList: ['keyWord'],
			content:'static '
		})).toString();
		//todo TYPE
		fullName += name;
		if (desc['default'] !== undefined) fullName += ' = ' + desc['default'];
		var css = iterator % 2 ? 'propName1' : 'propName0';
		text += (new lx.TagRenderer({
			name: 'propBox',
			classList: [css],
			data: {i: type + iterator, isClosed: true},
			content: fullName
		})).toString();
		if (doc) {
			var css = iterator % 2 ? 'propDoc1' : 'propDoc0';
			text += (new lx.TagRenderer({
				id: 'prop_doc_' + type + iterator,
				classList: [css],
				style: {display: 'none'},
				content: __replaceRN(doc)
			})).toString();
		}

		iterator++;
	}

	return text;
}

function __methodsToggle(but, data) {
	var box = but.parent.parent;
	if (but.isClosed) {
		var text = '';

		text += '<b>public:</b>';
		text += data.methods['public'].lxEmpty()
			? ' ' + #lx:i18n(none) + '<br>'
			: __renderMethods('public', data);
		text += '<br><b>protected:</b>';
		text += data.methods['protected'].lxEmpty()
			? ' ' + #lx:i18n(none) + '<br>'
			: __renderMethods('protected', data);
		text += '<br><b>private:</b>';
		text += data.methods['private'].lxEmpty()
			? ' ' + #lx:i18n(none) + '<br>'
			: __renderMethods('private', data);

		var dataElem = new lx.Box({
			parent: box,
			key: 'data',
			coords: ['40px', '40px'],
			right: '40px'
		});

		dataElem.text(text);
		dataElem->text.style('padding', '10px');
		dataElem->text.style('line-height', 1.5);
		dataElem->text.style('width', '100%');
		function checkHeight() {
			dataElem.height( dataElem->text.height('px') + 'px' );
			box.height( 40 + dataElem.height('px') + 'px' );
		}
		checkHeight();

		lx.app.domSelector.getWidgetsByName('methodBox').forEach(box=>box.click(function() {
			var el = lx.app.domSelector.getWidgetById('method_doc_' + this.data.i);
			if (!el) return;
			el.style('display', this.data.isClosed ? 'block' : 'none');
			this.data.isClosed = !this.data.isClosed;
			checkHeight();
		}));

		lx.app.domSelector.getWidgetsByClass('docBut').forEach(a=>{
			// a.click(function() { console.log(this); });
		});

		but.text('-');
		but.isClosed = false;
	} else {
		box.del('data');
		box.height('40px');

		but.text('+');
		but.isClosed = true;
	}
}

function __renderMethods(type, data) {
	var list = data.methods[type];
	var text = '';

	var iterator = 0;
	for (var name in list) {
		var desc = list[name];
		var fullName = '';
		var doc = desc.doc ? desc.doc : null;

		if (desc.isAbstract) fullName += 'abstract ';
		if (desc.isStatic) fullName += (new lx.TagRenderer({
			tag: 'span',
			classList: ['keyWord'],
			content: 'static '
		})).toString();
		fullName += name;
		if (desc.parameters) {
			var paramArr = [];
			for (var paramName in desc.parameters) {
				var paramData = desc.parameters[paramName];
				var paramText = '';
				if (paramData.type) paramText += paramData + ' ';
				if (paramData.isReference) paramText += '&';
				paramText += paramName;
				paramArr.push(paramText);
			}
			fullName += '('+ paramArr.join(', ') +')';
		} else fullName += '()';

		var css = iterator % 2 ? 'propName1' : 'propName0';
		if (doc) {
			text += lx.TagRenderer.renderHtml(()=>{
				#lx:tpl-begin;
					<div:[name:methodBox].pointed.{{css}} {i:type+iterator, isClosed:true}>
						<span>{{fullName}}
						<div:.docBut {class:data.name, method:name}>Doc
				#lx:tpl-end;
			});
		} else {
			text += lx.TagRenderer.renderHtml(()=>{
				#lx:tpl-begin;
					<div:[name:methodBox].{{css}} {i:type+iterator, isClosed:true}>
						<span>{{fullName}}
				#lx:tpl-end;
			});
		}

		if (doc) {
			var css = iterator % 2 ? 'propDoc1' : 'propDoc0';
			text += (new lx.TagRenderer({
				id: 'method_doc_' + type + iterator,
				classList: [css],
				style: {display: 'none'},
				content: __replaceRN(doc)
			})).toString();
		}

		iterator++;
	}

	return text;
}

function __replaceRN(text) {
	var reg = new RegExp(String.fromCharCode(13) + '|' + String.fromCharCode(10) + '|' + String.fromCharCode(13) + String.fromCharCode(10), 'g');
	return text.replace(reg, '<br>');
}
