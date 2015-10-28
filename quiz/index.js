$(function(){
  setAnswer = function(obj){
    console.log(JSON.stringify(obj))
    console.log(obj);
  }
  urls=['/multiple_question.json','/question.json','/fill_question.json','/table.json']
  var i = window.location.hash
  i=i.slice(1,2)
  $.get("./"+urls[i],function(quiz,state,response){
    if(quiz.question_type_id == 1){ //处理单选题
      (function(quiz){
        var temp = $("#singleAnswerTemplate").html();
        var compiled_template = _.template(temp)(quiz);
        var answer
        $("#app").append(compiled_template);
        $('input').on("ifChecked",function(event){
          var index = $(this).data("index");
          var answer = [index];
          var question_id = $(this).data("question")
          setAnswer({question_id:question_id,answer_index: answer});
        });
        if(quiz.your_answers.length !== 0){
          var index = quiz.your_answers[0];
          $($("input")[index]).iCheck('check');
        }
      })(quiz)
    }
    else if(quiz.question_type_id == 2){ //处理单选题
      (function(quiz){
        var temp = $("#multipleAnswerTemplate").html();
        var compiled_template = _.template(temp)(quiz);
        $("#app").append(compiled_template);
        var answers = []
        $('input').on("ifChecked",function(event){
          var index = $(this).data("index");
          answers.push(index);
          var question_id = $(this).data("question");
          setAnswer({question_id:question_id,answer_index: answers});
        });
        $('input').on("ifUnchecked",function(event){
          var index = $(this).data("index");
          var question_id = $(this).data("question")
          answers = _.without(answers,index)
          setAnswer({question_id:question_id,answer_index: answers});
        });
        if(quiz.your_answers.length !== 0){
          var index = quiz.your_answers[0];
          $($("input")[index]).iCheck('check');
        }
      })(quiz)
    }
    else if(quiz.question_type_id == 3){ //处理单选题
      //your_answer确定有多少空需要填写
      (function(quiz){
        var temp = $("#fillAnswerTemplate").html();
        var compiled_template = _.template(temp)(quiz);
        $("#app").append(compiled_template);
        $("input").on("change",function(e){
          var index = $(this).data("index");
          var question_id = $(this).data("question")
          var answers = quiz.your_answers
          answers[index] = this.value
          setAnswer({question_id:question_id,answer_index: answers});
        })
      })(quiz)
    }
    else
      console.log("没有该类型对应的模板")

  })
})
