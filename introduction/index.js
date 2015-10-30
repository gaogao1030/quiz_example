$(function(){
  var i = window.location.hash
  i=i.slice(1,2)
  $.get("./introduction.json",function(intro,state,response){
      (function(intro){
        var temp = $("#introductionTemplate").html();
        var compiled_template = _.template(temp)(intro);
        $("#app").append(compiled_template);
      })(intro)
  })
})
