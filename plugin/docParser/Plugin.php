<?php

namespace lx\doc\plugin\docParser;

//use lx\doc\plugin\docParser\backend\classes\DocParser;

use lx\PackageBrowser;

class Plugin extends \lx\Plugin {
	public function beforeCompile() {
		$packages = PackageBrowser::getPackagesList();
		$this->renderParams->packagesName = array_keys($packages);
	}
}