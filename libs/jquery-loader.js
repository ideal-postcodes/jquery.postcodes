(function() {
  // Default to the local version.
  var path = '../libs/jquery/jquery.js';

  // Get any jquery=___ param from the query string.
  var jqversion = location.search.match(/[?&]jquery=(.*?)(?=&|$)/);

  // Quick hack to see if IE8 or below
  var ltIE9 = !document.addEventListener;

  // If a version was specified, use that version from code.jquery.com.
  if (ltIE9) {
    if (jqversion && jqversion[1].split(".")[0] === "1") {
      path = '../libs/jquery/jquery-' + jqversion[1] + '.min.js';
    }
  } else {
    if (jqversion) {
      path = '../libs/jquery/jquery-' + jqversion[1] + '.min.js';
    }  
  }

  //  Add in jQuery
  document.write('<script src="' + path + '"></script>');
}());
