<?php
use cbednarski\FileUtils\FileUtils;

$spark->on('afterbuild', function ($event) {
	$compiler = $event->getCompiler();
	$config = $compiler->getConfig();

	FileUtils::recursiveDelete($config->getTargetPath() . '/en_US/sections/');
});
