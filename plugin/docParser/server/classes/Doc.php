<?php

namespace lx\doc\plugin\docParser\server\classes;

class Doc {
	private $params;
	private $clearText;

	public function __construct($doc) {
		$doc = self::clear($doc);

		preg_match_all('/@([\w_]*)(?: *)(.*)(?:$|\r\n|\r|\n)/', $doc, $matches);
		$params = [];
		foreach ($matches[1] as $i => $value) {
			if (array_key_exists($value, $params)) {
				if (is_array($params[$value])) {
					$params[$value][] = $matches[2][$i];
				} else {
					$params[$value] = [$params[$value], $matches[2][$i]];
				}
			} else {
				$params[$value] = $matches[2][$i];
			}
		}

		$this->params = $params;
		$this->clearText = preg_replace('/@([\w_]*)(?: *)(.*)(?:$|\r\n|\r|\n)/', '', $doc);
	}

	public function has($name) {
		return array_key_exists($name, $this->params);
	}

	public function get($name) {
		return $this->params[$name];
	}

	public function getText() {
		return $this->clearText;
	}

	/**
	 * Очистить текст документации от элементов комментария
	 * */ 
	public static function clear($doc) {
		$result = $doc;
		$result = preg_replace('/(^|\r\n|\r|\n)[*\/ \t]*?($|\r\n|\r|\n)/', '$1$2', $result);
		$result = preg_replace('/(^|\r\n|\r|\n)[ \t]*?\*[ \t]*?/', '$1', $result);
		$result = preg_replace('/(^\s*|\s*$)/', '', $result);
		if ($result == '') return null;
		return $result;
	}
}
