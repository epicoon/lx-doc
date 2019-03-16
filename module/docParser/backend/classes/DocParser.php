<?php

namespace lx\doc\module\docParser\backend\classes;

class DocParser {
	private $packageName;
	private $phpClassCodeMap;

	public function __construct($packageName) {
		$this->packageName = $packageName;
		$this->packagePath = \lx::getPackagePath($this->packageName);

		$this->phpClassCodeMap = new ClassCodeMap();
	}

	public function run() {
		$dir = new \lx\Directory($this->packagePath);
		$allPhp = $dir->getAllFiles('*.php');

		$allPhp->each(function($file) {
			//!!!!!!!!!!!!!!!!!!!
			// if ($file->getName() != 'Dialog.php') return;

			$code = $file->get();
			preg_match_all('/class (\b.+?\b)[^{]*?{/', $code, $matches);
			if (empty($matches[1])) return;

			preg_match_all('/namespace\s+([^;]+?);/', $code, $namespace);
			$namespace = empty($namespace[1]) ? '' : $namespace[1][0];

			foreach ($matches[1] as $className) {
				$fullClassName = $namespace . '\\' . $className;
				if (\lx\ClassHelper::exists($fullClassName)) {
					$this->phpClassCodeMap->addPhpClass($fullClassName, $file->getPath());
				}
			}

			/*
			//todo - понадобится для работы с js-кодом
			!!! Убрать пробел между ? >
			*/
			// preg_match_all('/(\/\*\*[\w\W]*?\*\/\s*|)class (\b.+?\b)([^{]*?)(?P<code>{((? >[^{}]+)|(?P>code))*})/', $code, $matches);
			// if (empty($matches[0])) return;

		});
	}

	public function packData() {
		$data = [
			'name' => $this->packageName,
			'phpClasses' => $this->phpClassCodeMap->packData(),
		];

		return $data;
	}
}
