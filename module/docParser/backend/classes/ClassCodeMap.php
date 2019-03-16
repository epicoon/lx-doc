<?php

namespace lx\doc\module\docParser\backend\classes;

class ClassCodeMap {
	private $map = [];

	public function get($key) {
		if (!array_key_exists($key, $this->map)) {
			return false;
		}

		return $this->map[$key];
	}

	public function addPhpClass($className, $filePath) {
		$instance = PhpClassCodeInfo::create($className, $filePath);
		if (!$instance) {
			return;
		}

		$this->map[$className] = $instance;
	}

	public function packData() {
		$data = [];
		foreach ($this->map as $className => $classInfo) {
			$data[$className] = $classInfo->packData();
		}
		return $data;
	}
}
