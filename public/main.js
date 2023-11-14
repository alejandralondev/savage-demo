var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var trash = document.getElementsByClassName("fa-trash");
var thumbDown = document.getElementsByClassName("fa-thumbs-down");

// browser opens html, css, js
// hears a click
// have to look at client side js to see what happens when that click occurs
// click for thumbs up
// click for trash can
// no click for submit - this defaults to the default for a form - automagically, sumbit buttons and the forms predate client side javascript
// form submit by itsself client side, makes post request from the server

// 
Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('messages', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'msg': msg,
            'thumbUp':thumbUp,
            'subtract' : false
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(thumbDown).forEach(function(element) {
  element.addEventListener('click', function(){
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    fetch('messages', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'name': name,
        'msg': msg,
        'thumbUp':thumbUp,
        'subtract': true
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});

// click event on trash can
//  grabb
Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        // grabbing name
        const name = this.parentNode.parentNode.childNodes[1].innerText
        // grabbing msg next to trash can
        // reason why it's parentNode.parentNode is because trash in our ejs is in a span, and its parent is an li, and the child is at 1 index, -dom is connected series of nodes so starts at index 1 because the "enters" or carrot returns count that's why it goes 1,3,5 when counting the indexes-
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        // fetch sends request to server
        // we have a delete in our server
        fetch('messages', { // all 3 of those are just arguements of what we're sending to the server ( method, headers, body)
          method: 'delete', // delete request
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name, // sending name
            'msg': msg // and msg next to trash can so we know which docyment to delete from our collection 
          })
        }).then(function (response) {
          window.location.reload() // now refresh the page which starts get request again :))))
        })
      });
});
