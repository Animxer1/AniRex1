document.addEventListener('keydown', function(event) {
    if (event.key === '/') {
      event.preventDefault();
      document.getElementById('query').focus(); 
    }
  });

  console.log('%c Code: %c Key.js ', 'background-color:#0396ff ; border-radius: 5px; color: white;', '');