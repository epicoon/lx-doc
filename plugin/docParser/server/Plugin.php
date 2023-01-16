<?php

namespace lx\doc\plugin\docParser\server;

use lx\ServiceBrowser;

class Plugin extends \lx\Plugin
{
	public function init(): void
    {
        parent::init();
        
		$services = ServiceBrowser::getServicePathesList();
		$this->attributes->servicesName = array_keys($services);
	}
}
