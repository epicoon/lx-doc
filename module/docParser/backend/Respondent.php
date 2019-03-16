<?php

namespace lx\doc\module\docParser\backend;

use lx\doc\module\docParser\backend\classes\DocParser;
use lx\doc\module\docParser\backend\classes\Translater;

class Respondent extends \lx\Respondent {
	public function getPackageInfo($packageName) {
		$parser = new DocParser($packageName);
		$parser->run();
		return $parser->packData();
	}

	public function changeLang($lang) {
		$translater = new Translater($lang);
		return $translater->getLangMap();
	}

}
