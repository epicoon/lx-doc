class Viewer #lx:namespace doc {
	constructor(classBox) {
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

		Plugin->>classesTree.setData(tree);
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

		// console.log(data);

		/*
		var text = #lx:render<<<
			<{lx.data.i18n.i18n_class}>: <<on data.isAbstract:(abstract )>><b={data.name}>
			<<on data.parentClass:(
			  \r{lx.data.i18n.i18n_parent_class}: <span.parentClass=({data.parentClass})>
			)>>
			<<on data.doc:(
			  \r<b=({lx.data.i18n.i18n_description}:)>
			  \r{__replaceRN(data.doc)}
			)>>
		>>>

		var text = #lx:render<<<
			{lx.data.i18n.i18n_class}: <<on data.isAbstract:abstract >><b=({data.name})>
			<<on data.parentClass:
				\\lx.data.i18n.i18n_parent_class: <span.parentClass=({data.parentClass})>
			>>
			<<on data.doc:
				\\<b=({lx.data.i18n.i18n_description}:)>
				\\{__replaceRN(data.doc)}
			>>
		>>>
		*/

		var text = #lx:i18n(class) + ': ';
		if (data.isAbstract) text += 'abstract ';
		text += '<b>' + data.name + '</b>';
		if (data.parentClass) text += '<br>' + #lx:i18n(parent_class) + ': ' + #lx:<span.parentClass=({data.parentClass})>;
		if (data.doc) {
			text += '<br><b>' + #lx:i18n(description) + ':</b>';
			text += '<br>' + __replaceRN(data.doc);
		}

		e.text(text);
		e->text.style('padding', '10px');
		e->text.style('line-height', 1.5);
		e.height( e->text.height('px') + 'px' );

		var parentClass = ?>.parentClass;
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

		?>propBox.call('click', function() {
			var el = ?>#{'prop_doc_' + this.i};
			if (!el) return;
			el.style('display', this.isClosed ? 'block' : 'none');
			this.isClosed = !this.isClosed;
			checkHeight();
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

function __renderProperties(type, list) {
	var text = '';

	var iterator = 0;
	for (var name in list) {
		var desc = list[name];
		var fullName = '';
		var doc = desc.doc ? desc.doc : null;

		if (desc.isStatic) fullName += #lx:<span.keyWord=(static )>;
		//todo TYPE
		fullName += name;
		if (desc['default'] !== undefined) fullName += ' = ' + desc['default'];
		var css = iterator % 2 ? 'propName1' : 'propName0';
		text += #lx:<div.{css}:propBox[i:{type+iterator},isClosed:true]=({fullName})>;

		if (doc) {
			var css = iterator % 2 ? 'propDoc1' : 'propDoc0';
			text += #lx:<div.{css}"display:none"#{'prop_doc_'+type+iterator}=({__replaceRN(doc)})>;
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

		?>methodBox.call('click', function() {
			var el = ?>#{'method_doc_' + this.i};
			if (!el) return;
			el.style('display', this.isClosed ? 'block' : 'none');
			this.isClosed = !this.isClosed;
			checkHeight();
		});

		?>.docBut.forEach(a=>{
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
		if (desc.isStatic) fullName += #lx:<span.keyWord=(static )>;
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
		text += doc
			? #lx:<div:methodBox.{css}.pointed[i:{type+iterator},isClosed:true]
				    <span=({fullName})>
				    <div.docBut[class:{data.name},method:{name}]=(Doc)>
			      >
			: #lx:<div.{css}:methodBox[i:{type+iterator},isClosed:true]
				    <span=({fullName})>
			      >

		if (doc) {
			var css = iterator % 2 ? 'propDoc1' : 'propDoc0';
			text += #lx:<div#{'method_doc_'+type+iterator}.{css}"display:none"=({__replaceRN(doc)})>;
		}

		iterator++;
	}

	return text;
}

function __replaceRN(text) {
	var reg = new RegExp(String.fromCharCode(13) + '|' + String.fromCharCode(10) + '|' + String.fromCharCode(13) + String.fromCharCode(10), 'g');
	return text.replace(reg, '<br>');
}
