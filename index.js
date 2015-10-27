$(function(){
  setAnswer = function(obj){
    console.log(obj);
  }
  $.get('/question.json',function(quiz,state,response){
    if(quiz.question_type_id == 1){
      (function(quiz){
        var temp = $("#singleAnswerTemplate").html();
        var compiled_template = _.template(temp)(quiz);
        $("#app").append(compiled_template);
        $('input').on("ifChecked",function(event){
          var index = $(this).data("index");
          var index = [index];
          var question_id = $(this).data("question")
          setAnswer({question_id:question_id,answer_index: index});
        });
        if(quiz.your_answers.length !== 0){
          var index = quiz.your_answers[0];
          $($("input")[index]).iCheck('check');
        }
      })(quiz)
    }
  })
})
