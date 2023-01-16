/**
 * @const {lx.Application} App
 * @const {lx.Plugin} Plugin
 * @const {lx.Snippet} Snippet
 */

#lx:tpl-begin;
	<lx.Box:._spread>.gridProportional(indent:'10px')
		<lx.Box:.lxdoc-box (width:12)>.gridProportional(indent:'10px')
			<lx.Box:@packageDocumentation.lxdoc-title (width:3)>.align(lx.CENTER, lx.MIDDLE)
				#lx:i18n(package_documentation)
			<lx.Dropbox:@servicesName (width:3)>
		<lx.Box:@classesBox.lxdoc-box (width:3, height:12)>.gridProportional(indent:'10px')
			<lx.Box:@find (width:3)>.align(lx.CENTER, lx.MIDDLE)
				#lx:i18n(find)
			<lx.Input:@findClass (width:9)>
			<lx.TreeBox:@classesTree (size:[12, 18])>
		<lx.Box:@classBox.lxdoc-box (width:9, height:12)>
#lx:tpl-end;
