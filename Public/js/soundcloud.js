// SC.initialize({
// 	client_id: '96089e67110795b69a95705f38952d8f',
// 	redirect_uri: 'http://sclibrary.testing.com:3000/callback.html',
// });

// SC.connect(function() {
// 	console.log("Connected!");
// })
// // SC.get('/resolve', {url: 'https://soundcloud.com/iamganz/snakehips-x-tory-lanez-dimelo-ganz-flip-free-dl'}).then(function(track) {
// // 	console.log(track);
// // });

  $(document).ready(function() {
      SC.initialize({
          client_id: '96089e67110795b69a95705f38952d8f',
          redirect_uri: 'http://sclibrary.testing.com:3000/callback.html'
      });


      SC.connect(function() {
          SC.get('/me', function(data) {
              $('#main').text(data.username);
          });
      });
  });