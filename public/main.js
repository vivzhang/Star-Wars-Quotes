// excute the PUT request when the button is clicked

var update = document.getElementById('update');

update.addEventListener('click', function() {
  // when the button is clicked, browser will send a PUT request thru fetch(fetch returns a Promise object) to our Express server, then the server responds by sending the changed quoted back to fetch(use .then method),

  // The proper way to check if fetch resolved successfully is to use the ok method on the response object. You can then return res.json() if you want to read the data that was sent from the server:

  // fetch({ /* request */ })
  // .then(res => {
  //   if (res.ok) return res.json();
  // })
  // .then(data => {
  //   console.log(data);
  // })

  // window.fetch method to fetch recourses(a more powerful version of XMLHttpRequest)
  // first para is the path
  fetch('quotes', {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    // convert body's content into JSON
    body: JSON.stringify({
      'name': 'Darth Vadar',
      'quote': 'I find you lack of faith disturbing.'
    })
  })
  .then(res => {
    if (res.ok) return res.json();
  })
  .then(data => {
    console.log(data);
    // update the DOM so the user can see the change immediately
    window.location.reload(true);
  })
})

var del = document.getElementById('delete');
del.addEventListener('click', function() {
  fetch('quotes', {
    method: 'delete',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'name': 'Elmer'
    })
  })
  .then(res => {
    if (res.ok) return res.json();
  })
  .then(data => {
    console.log(data);
    window.location.reload(true);
  })
})

