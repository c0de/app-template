filters.filter('split', function () {
  return function (input, delimiter) {
    delimiter = delimiter || '\n';
    return input.split(delimiter)
      .filter(function(v){ return v !== undefined; })
      .filter(function(v){ return v.length > 0; });
  };
});
