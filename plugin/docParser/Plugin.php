<?php

namespace lx\doc\plugin\docParser;

//use lx\doc\plugin\docParser\backend\classes\DocParser;

use lx\PackageBrowser;

class Plugin extends \lx\Plugin {
	public function init() {
		$packages = PackageBrowser::getPackagePathesList();
		$this->attributes->packagesName = array_keys($packages);
	}
}
