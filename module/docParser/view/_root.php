<?php
/**
 * @var lx\Module Module
 * @var lx\Block Block
 * */

use lx\doc\module\docParser\backend\classes\DocParser;
use lx\doc\module\docParser\backend\classes\Translater;


$translater = new Translater();
lx::$data->i18n = $translater->getLangMap();



// $packageName = lx::$dialog->params('package');
$packages = lx\PackageBrowser::getPackagesList();
$packageNames = array_keys($packages);



$headerHeight = '50px';
$classesWidth = '320px';
$header = new lx\Box([
	'height' => $headerHeight,
]);
$header->fill('lightgray');

new lx\TextBox([
	'parent' => $header,
	'key' => 'i18n_package_documentation',
]);

$dropbox = new lx\Dropbox([
	'parent' => $header,	
	'key' => 'packageNames',
	'size' => ['30%', '60%'],
	'options' => $packageNames,
]);

$header->align([
	'subject' => ['i18n_package_documentation', 'packageNames'],
	'horizontal' => lx::LEFT,
	'vertical' => lx::MIDDLE,
	'paddingLeft' => '20px',
]);

$langs = new lx\Button([
	'parent' => $header,
	'key' => 'i18n_languages',
	'size' => ['15%', '60%'],
]);
$langs = new lx\Dropbox([
	'parent' => $header,
	'key' => 'lang',
	'size' => ['10%', '60%'],
	'options' => $translater->getAvailableLangs(),
	'value' => 0,
]);
$header->align([
	'subject' => ['i18n_languages', 'lang'],
	'horizontal' => lx::RIGHT,
	'vertical' => lx::MIDDLE,
	'paddingRight' => '20px',
	'step' => '10px',
]);







$classes = new lx\ActiveBox([
	'key' => 'classesBox',
	'top' => $headerHeight,
	'width' => $classesWidth,
	'resize' => false,
	'adhesive' => true,
]);
$classes->border(['color' => 'gray']);

$classes->get('body')->gridProportional(['indent' => '10px']);
$classes->get('body')->begin();
	(new lx\Box([ 'size' => [3, 1], 'key' => 'i18n_find' ]))->align(lx::CENTER, lx::MIDDLE);
	new lx\Input([ 'size' => [9, 1], 'key' => 'findClass' ]);
	new lx\TreeBox(['height' => 18, 'key' => 'classesTree']);
$classes->get('body')->end();




$classBox = new lx\ActiveBox([
	'key' => 'classBox',
	'top' => $headerHeight,
	'left' => $classesWidth,
	'resize' => false,
	'adhesive' => true,
]);
$classBox->border(['color' => 'gray']);

