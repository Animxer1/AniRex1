document.addEventListener('keydown', function(event) {
    if (event.key === '/') {
      event.preventDefault();
      document.getElementById('query').focus(); 
    }
  });