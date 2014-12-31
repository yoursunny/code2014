<?php
header('Cache-Control: max-age=0');
header('Content-Type: text/javascript');

readfile('start.js');//must load first
readfile('popup.js');
readfile('alg.js');
readfile('alg-old.js');
readfile('alg-predefined.js');//dependency: alg.js alg-old.js
readfile('alg-my.js');
readfile('menu.js');
readfile('import.js');
readfile('import-file.js');
readfile('import-csv.js');
readfile('import-json.js');
readfile('import-sjtujwb.js');
readfile('save.js');
readfile('save-file.js');
readfile('save-json.js');
readfile('inputui.js');
readfile('resultui.js');
readfile('calc.js');
readfile('tools.js');
readfile('help.js');
readfile('util.js');
readfile('storage.js');
readfile('autosave.js');

//readfile('jquery.cookie.js');
//readfile('jquery.json-2.2.js');

?>