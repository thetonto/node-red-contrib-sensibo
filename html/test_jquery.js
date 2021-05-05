/* eslint-disable no-undef */

// eslint-disable-next-line no-undef
$(document).ready(function () {
  $('#node-input-getConfig').change(function () {
    if (this.checked) {
      $('.setstate').hide()
      $('#node-input-getACState').prop('checked', false)
      $('#node-input-polltime').val('0')
    } else { $('.setstate').show() }
  })
  $('#node-input-getACState').change(function () {
    if (this.checked) {
      // alert("that worked")
      $('.setpoll').hide()
    } else { $('.setpoll').show() }
  })
})
