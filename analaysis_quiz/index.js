$(function(){
  setAnswer = function(obj){
    console.log(JSON.stringify(obj))
    console.log(obj);
  }
  jsGetQuestion = function(obj){
    if(obj.question_type_id == 1 || obj.question_type_id== 2) {
      obj.your_answers =_.map(obj.your_answers,function(i){
        return i-1;
      })
      obj.right_answers =_.map(obj.right_answers,function(i){
        return i-1;
      })
    }
    return obj;
  }
  urls=['/singleQuestion.json','/multipleQuestion.json','/fillQuestion.json','/judgementQuestion.json']
  var i = window.location.hash
  i=i.slice(1,2)
  $.get("./"+urls[i],function(quiz,state,response){
    quiz=jsGetQuestion(quiz);
    if(quiz.question_type_id == 1){ //处理单选题
      (function(quiz){
        var temp = $("#singleAnswerTemplate").html();
        var compiled_template = _.template(temp)(quiz);
        var answer
        $("#app").append(compiled_template);
        var your_answer_index= quiz.your_answers[0];
        var right_answer_index= quiz.right_answers[0];
        $("input").iCheck("disable");
        var $your_answer = $($("input")[your_answer_index]);
        $your_answer.iCheck('check');
        $right_answer = $($("input")[right_answer_index]);
        $right_answer.parents("li").append("<div class='right single'><img src='../images/right1.png'></img></div>")
      })(quiz)
    }
    else if(quiz.question_type_id == 2){ //处理多选题
      (function(quiz){
        var temp = $("#multipleAnswerTemplate").html();
        var compiled_template = _.template(temp)(quiz);
        $("#app").append(compiled_template);
        var answers = [];
        var your_answers_index= quiz.your_answers;
        var right_answers_index= quiz.right_answers;
        $("input").iCheck("disable");
        var your_answers = _.map(your_answers_index,function(answer_index){
          return $("input")[answer_index];
        });
        var right_answers = _.each(right_answers_index,function(answer_index){
          $($("input")[answer_index]).parents("li").append("<div class='right' style='margin-top:6px;'><img src='../images/right1.png'></img></div>");
        });
        $(your_answers).iCheck("check");
      })(quiz)
    }
    else if(quiz.question_type_id == 3){ //处理填空题
      //your_answer确定有多少空需要填写
      (function(quiz){
        var temp = $("#fillAnswerTemplate").html();
        var compiled_template = _.template(temp)(quiz);
        var your_answers_content = quiz.your_answers;
        var right_answers_content = quiz.right_answers;
        $("#app").append(compiled_template);
        $("input").attr("disabled",true);
        var right_answers = _.map(your_answers_content,function(content,index){
          if(_.isEqual(content,right_answers_content[index])){
            return $("input")[index];
          }
        })
        var wrong_answers = _.map(your_answers_content,function(content,index){
          if(!(_.isEqual(content,right_answers_content[index]))){
            return $("input")[index];
          }
        })
        right_answers = _.compact(right_answers);
        wrong_answers = _.compact(wrong_answers);
        debugger
        _.each(right_answers,function(elem){
          $(elem).parents("li").append("<div class='right fill'><img src='../images/right1.png'></img></div>");
        })
        _.each(wrong_answers,function(elem){
          $(elem).parents("li").append("<div class='right fill'><img src='../images/wrong1.png'></img></div>");
        })
      })(quiz)
    }
    else if(quiz.question_type_id == 6){ //处理判断题
      (function(quiz){
        var temp = $("#judgementAnswerTemplate").html();
        var compiled_template = _.template(temp)(quiz);
        $("#app").append(compiled_template);
        $("input").attr("disabled",true);
        var your_answer = quiz.your_answers[0];
        var right_answer = quiz.right_answers[0];
        $T = $("input[data-answer='T']");
        $F = $("input[data-answer='F']");
        if(your_answer=="T"){
          $T.iCheck('check');
        } else if(your_answer=="F") {
          $F.iCheck('check');
        }
        if(right_answer=="T"){
          $T.parents("li").append("<div class='right'><img src='../images/right1.png'></img></div>");
        } else if(right_answer=="F") {
          $F.parents("li").append("<div class='right'><img src='../images/right1.png'></img></div>");
        }
      })(quiz)
    }
    else
      console.log("没有该类型对应的模板")
  })
})
