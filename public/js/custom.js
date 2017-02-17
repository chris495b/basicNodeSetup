
$(function(){
  $('.close').each(function(){
    $(this).on('click', function () {
      console.log($(this).data('id'));
      fetch('quotes', {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
         '_id': $(this).data('id')
       })
     }).then(res => {
      if (res.ok) return res.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
    });
  });
})
