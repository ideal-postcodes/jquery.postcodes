(function() {
  var live = location.search.match(/[?&]live=(.*?)(?=&|$)/);
  // If live is specified, use the live API
  if (!live) {
    document.write('<script src="../libs/fake/jquery.ajax.fake.js"></script>');
    document.write('<script src="../libs/fake/webservices.fake.js"></script>');
  }
}());
