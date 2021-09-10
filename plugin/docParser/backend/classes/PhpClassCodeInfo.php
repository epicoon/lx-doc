<?php

namespace lx\doc\plugin\docParser\backend\classes;

class PhpClassCodeInfo extends ClassCodeInfo {
	public $classDoc;

	protected $isAbstract;
	protected $interfaces;
	protected $traits;

	public static function create($className, $filePath) {
		$re = new \ReflectionClass($className);
		$doc = new Doc($re->getDocComment());

		// Если класс скрыт для документации
		if ($doc->has('hidden')) {
			return false;
		}

		return new self($className, $filePath, $re, $doc);
	}

	protected function __construct($className, $filePath, $re, $doc) {
		parent::__construct();

		$this->properties = [
			'public' => [],
			'protected' => [],
			'private' => []
		];
		$this->methods = [
			'public' => [],
			'protected' => [],
			'private' => []
		];

		$this->classDoc = $doc;
		$this->doc = $doc->getText();

		$this->interfaces = [];
		$this->traits = [];

		$this->filePath = $filePath;
		$this->className = $className;


		$this->namespace = $re->getNamespaceName();
		$this->isAbstract = $re->isAbstract();

		$parentClass = $re->getParentClass();
		$this->parentClass = $parentClass ? $parentClass->name : false;

		$interfaces = $re->getInterfaces();
		foreach ($interfaces as $name => $interface) {
			$this->interfaces[] = $name;
		}

		$traits = $re->getTraits();
		foreach ($traits as $name => $trait) {
			$this->traits[] = $name;
		}

		$constants = $re->getReflectionConstants();
		foreach ($constants as $constant) {
			$this->constants[$constant->name] = [
				'doc' => Doc::clear($constant->getDocComment()),
				'value' => $constant->getValue(),
			];
		}

		$properties = $re->getProperties();
		$defaultProperties = $re->getDefaultProperties();
		foreach ($properties as $property) {
			$name = $property->name;
			$info = [
				'doc' => Doc::clear($property->getDocComment()),
				'isStatic' => $property->isStatic(),
			];
			if (array_key_exists($name, $defaultProperties) && $defaultProperties[$name] !== null) {
				$info['default'] = $defaultProperties[$name];
			}
			if ($property->isPublic()) {
				$this->properties['public'][$name] = $info;
			} elseif ($property->isProtected()) {
				$this->properties['protected'][$name] = $info;
			} elseif ($property->isPrivate()) {
				$this->properties['private'][$name] = $info;
			}
		}

		$methods = $re->getMethods();
		foreach ($methods as $method) {
			if ($this->checkMethodFromParent($re, $method)) {
				continue;
			}

			$name = $method->name;			
			$info = [
				'doc' => Doc::clear($method->getDocComment()),
				'isAbstract' => $method->isAbstract(),
				'isStatic' => $method->isStatic(),
				'isVariadic' => $method->isVariadic(),  // переменное число аргументов
				'returnType' => $method->getReturnType(),
			];

			$parameters = $method->getParameters();
			$parametersInfo = [];
			foreach ($parameters as $parameter) {
				$parameterInfo = [
					'type' => $parameter->getType(),
					'isReference' => $parameter->isPassedByReference(),
				];
				if ($parameter->isDefaultValueAvailable()) {
					if ($parameter->isDefaultValueConstant()) {
						$parameterInfo['default_constant'] = $parameter->getDefaultValueConstantName();
					} else {
						$parameterInfo['default'] = $parameter->getDefaultValue();
					}
				}
				$parametersInfo[$parameter->name] = $parameterInfo;
			}

			if (!empty($parametersInfo)) {
				$info['parameters'] = $parametersInfo;
			}

			if ($method->isPublic()) {
				$this->methods['public'][$name] = $info;
			} elseif ($method->isProtected()) {
				$this->methods['protected'][$name] = $info;
			} elseif ($method->isPrivate()) {
				$this->methods['private'][$name] = $info;
			}
		}
	}

	public function packData() {
		/*
		protected $className;
		protected $namespace;
		protected $parentClass;
		protected $doc;

		protected $isAbstract;
		protected $interfaces;
		protected $traits;

		protected $constants;
		protected $properties;
		protected $methods;
		*/
		$data = [
			'name' => $this->className,
			'namespace' => $this->namespace,
			'parentClass' => $this->parentClass,
			'isAbstract' => $this->isAbstract,

			'interfaces' => $this->interfaces,
			'traits' => $this->traits,
			'constants' => $this->constants,
			'properties' => $this->properties,
			'methods' => $this->methods,

			'doc' => $this->doc,
		];

		if ($this->classDoc->has('group')) {
			$data['group'] = $this->classDoc->get('group');
		}

		return $data;
	}




	/**
	 * //todo так же проверять свойства, методы и свойства из трейтов
	 * */
	private function checkMethodFromParent($re, $method) {
		$parentClass = $re->getParentClass();
		if (!$parentClass || !$parentClass->hasMethod($method->name)) {
			return false;
		}

		$parentMethod = $parentClass->getMethod($method->name);

		if ($method->getFileName() != $parentMethod->getFileName()) {
			return false;
		}

		if ($method->getStartLine() != $parentMethod->getStartLine()) {
			return false;
		}

		return true;
	}



	private function parseCode() {
		/*
		//todo - понадобится для работы с js-кодом
		!!! Убрать пробел между ? >
		*/
		// $code = preg_replace('/(?<!http:|https:)\/\/.*?(\\\n|\n|$)/', '', $this->innerCode);
		// preg_match_all('/(\/\*\*[\w\W]*?\*\/\s*|)((?:public|protected|private|static).*?)function\s+(\b.+?\b)\s*([^{]*?)\s*(?P<code>{((? >[^{}]+)|(?P>code))*})/', $code, $matches);



	}
}
