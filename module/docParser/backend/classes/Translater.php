<?php

namespace lx\doc\module\docParser\backend\classes;

/**
 * @group Eee
 * */
class Translater {
	public static function map() {
		return [
			'en' => [
				'i18n_package_documentation' => 'Package documentation: ',
				'i18n_find' => 'Find:',
				'i18n_languages' => 'Languages',
				'i18n_php_classes' => 'PHP classes',

				'i18n_interfaces' => 'Interfaces',
				'i18n_traits' => 'Traits',
				'i18n_constants' => 'Constants',
				'i18n_properties' => 'Properties',
				'i18n_methods' => 'Methods',

				'i18n_class' => 'Class',
				'i18n_parent_class' => 'Parent class',
				'i18n_description' => 'Description',
				'i18n_none' => 'none',
			],
			'ru' => [
				'i18n_package_documentation' => 'Документация пакета: ',
				'i18n_find' => 'Найти:',
				'i18n_languages' => 'Языки',
				'i18n_php_classes' => 'PHP классы',

				'i18n_interfaces' => 'Интерфейсы',
				'i18n_traits' => 'Трейты',
				'i18n_constants' => 'Константы',
				'i18n_properties' => 'Свойства',
				'i18n_methods' => 'Методы',

				'i18n_class' => 'Класс',
				'i18n_parent_class' => 'Родительский класс',
				'i18n_description' => 'Описание',
				'i18n_none' => 'нет',
			],
		];
	}

	public function __construct($lang = 'en') {
		$this->lang = $lang;
	}

	public function getAvailableLangs() {
		return array_keys(self::map());
	}

	public function currentLanguage() {
		return $this->lang;
	}

	public function getLangMap() {
		$lang = $this->currentLanguage();
		return self::map()[$lang];
	}
}
