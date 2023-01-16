<?php

namespace lx\doc\plugin\docParser\server;

use lx\doc\plugin\docParser\server\classes\DocParser;
use lx\doc\plugin\docParser\server\classes\Translater;
use lx\HttpResponseInterface;

class Respondent extends \lx\Respondent
{
	public function getPackageInfo($packageName): HttpResponseInterface
    {
		$parser = new DocParser($packageName);
		$parser->run();
		return $this->prepareResponse($parser->packData());
	}




	public function changeLang($lang)
    {
		$translater = new Translater($lang);
		return $translater->getLangMap();
	}
}
