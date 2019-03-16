<?php

namespace lx\doc\module\docParser\backend\classes;

class ClassCodeInfo {
	protected $filePath;

	protected $className;
	protected $namespace;
	protected $parentClass;
	protected $doc;

	protected $constants;
	protected $properties;
	protected $methods;

	protected function __construct() {
		$this->constants = [];
		$this->properties = [];
		$this->methods = [];
	}
}
