var db = null;
var var_no = null;
var position = null;

function openDB() {
  db = window.openDatabase("mingpianDB", "1.0", "밍피엔DB", 5 * 1024 * 1024);
  //console.log("1_DB 생성...");
}


//테이블 생성 트랜잭션 실행
function createTable() {
  db.transaction(
    function (ps) {
      var createSQL =
        "create table if not exists card(cardid integer primary key autoincrement, name text, company text, position text, mobile text, email text, tel text, addr text, memo text)";
      ps.executeSql(createSQL,[],function () {
          //console.log("2_1_테이블생성_sql 실행 성공...");
        },function () {
          //console.log("2_1_테이블생성_sql 실행 실패...");
        }
      );
    },function () {
      //console.log("2_2_테이블 생성 트랜잭션 실패... 롤백은 자동");
    },function () {
      //console.log("2_2_테이블 생성 트랜잭션 성공");
    }
  );
}

function createTable_cs() {
  db.transaction(
    function (ps) {
      var createSQL =
        "create table if not exists cs(csid integer autoincrement, name text, mobile text, content text)";
      ps.executeSql(createSQL,[],function () {
          //console.log("2_1_1_cs테이블생성_sql 실행 성공...");
        },function () {
          //console.log("2_1_1_cs테이블생성_sql 실행 실패...");
        }
      );
    },function () {
      //console.log("2_2_1_cs테이블 생성 트랜잭션 실패... 롤백은 자동");
    },function () {
      //console.log("2_2__1_cs테이블 생성 트랜잭션 성공");
    }
  );
}

//데이터 입력 트랜잭션 실행
function insertCard() {
  db.transaction(function (ps) {
    var name = $('#name').val();
    var company = $('#company').val();
    var position = $('#position').val();
    var mobile = $('#mobile').val();
    var email = $('#email').val();
    var tel = $('#tel').val();
    var addr = $('#addr').val();
    var memo = $('#memo').val();

    var insertSQL = "insert into card(name, company, position, mobile, email, tel, addr, memo) values(?,?,?,?,?,?,?,?)";
    ps.executeSql(insertSQL,[name, company, position, mobile, email, tel, addr, memo], function(ps, rs){
      if(name==""||company==""||mobile==""){
        alert('작성이 완료되지 않았습니다.')
      }else{  
        alert(name + "님이 입력되었습니다.");
        $('#name').val(""); $('#company').val(""); $('#position').val(""); 
        $('#mobile').val(""); $('#email').val(""); $('#tel').val(""); 
        $('#addr').val(""); $('#memo').val(""); $('#cardid').val("");
      }
      },function (ps, err) {
        alert("일시적 오류. 다시 시도해주세요.");
      }
    );
  });
}

function inquiry() {
  db.transaction(function (ps) {
    var name = $('#name8').val();
    var mobile = $('#mobile8').val();
    var contents = $('#contents8').val();
    //console.log(contents);
    var insertSQL = "insert into cs(name, mobile, contents) values(?,?,?)";
    ps.executeSql(insertSQL,[name, mobile, contents], function(ps, rs){
      if(name==""||mobile==""||contents==""){
        alert('작성이 완료되지 않았습니다.')
      }else{
        alert("작성이 완료되었습니다.");
        $('#name8').val("");
        $('#mobile8').val("");
        $('#content8').val(""); 
      }
      },function (ps, err) {
        alert("일시적 오류. 다시 시도해주세요.");
      }
    );
  });
}


//데이터 수정 위한 데이터 검색 트랜잭션 실행
function selectCard2(name) {
  db.transaction(function (ps) { 
    var selectSQL="select cardid,name,company,position,mobile,email,tel,addr,memo from card where name like '%'||?||'%'";
    ps.executeSql(selectSQL, [name], function (ps, rs) {
      // console.log(rs);
      $('#name2').val(rs.rows.item(0).name); 	
      $('#company2').val(rs.rows.item(0).company);
      $('#position2').val(rs.rows.item(0).position);
      $('#mobile2').val(rs.rows.item(0).mobile);
      $('#email2').val(rs.rows.item(0).email);
      $('#tel2').val(rs.rows.item(0).tel);
      $('#addr2').val(rs.rows.item(0).addr);
      $('#memo2').val(rs.rows.item(0).memo);
      $('#cardid2').val(rs.rows.item(0).cardid);
    });
  });
}

//데이터 수정 트랜잭션 실행
function updateCard() {
  db.transaction(function (ps) {
    var new_name = $('#name2').val();
    var company = $('#company2').val();
    var position = $('#position2').val();
    var mobile = $('#mobile2').val();
    var email = $('#email2').val();
    var tel = $('#tel2').val();
    var addr = $('#addr2').val();
    var memo = $('#memo2').val();
    var cardid2= $('#cardid2').val();
    var updateSQL = "update card set name=?,company=?,position=?,mobile=?,email=?,tel=?,addr=?,memo=? where cardid=?";
    ps.executeSql(updateSQL,[new_name,company,position,mobile,email,tel,addr,memo,cardid2],function (ps, rs) {
        //console.log("5_명함 수정......");
        alert(new_name + "님이 수정되었습니다.");
        $('#name2').val(""); $('#company2').val(""); $('#position2').val(""); 
        $('#mobile2').val(""); $('#email2').val(""); $('#tel2').val(""); 
        $('#addr2').val(""); $('#memo2').val(""); $('#cardid2').val("");
      },function (ps, err) {
        alert("db 오류 " + err.message + err.code);
      }
    );
  });
}

//데이터 삭제 위한 데이터 검색 트랜잭션 실행
function selectCard3(name) {
  db.transaction(function (ps) {
    var selectCntSQL = "select count(*) from card where name like '%'||?||'%'";
    let cnt = 0;
    ps.executeSql(selectCntSQL, [name], function (ps, rs) {
      //console.log(rs);
      cnt = rs.rows.item(0).cnt;
      //console.log("전체 목록 개수: ");
      //console.log(cnt);
      if (cnt==0) {alert("목록에 없습니다.");} 
      else {
        var selectSQL="select name,company,position,mobile,cardid from card where name like '%'||?||'%'";
        ps.executeSql(selectSQL,[name],function (ps, rs) {
          $('#name3').val(rs.rows.item(0).name); 	
          $('#company3').val(rs.rows.item(0).company);
          $('#position3').val(rs.rows.item(0).position);
          $('#mobile3').val(rs.rows.item(0).mobile);
          $('#cardid3').val(rs.rows.item(0).cardid);
          },function (ps, err) {
            alert("db 오류 " + err.message + err.code);
          }
        )
      }
    });
  });
}


//데이터 삭제 트랜잭션 실행
function deleteCard() {
  db.transaction(function (ps) {
    var cardid = $("#cardid3").val();
    var deleteSQL = "delete from card where cardid=?";
    ps.executeSql(deleteSQL,[cardid],function (ps, rs) {
        alert($("#name3").val()+"님을 삭제하시겠습니까?");
        //console.log("6_명함 삭제...");
        alert($("#name3").val() + "님이 삭제되었습니다.");
        $("#sName3").val("");$("#name3").val("");
        $("#company3").val("");$("#position3").val("");
        $("#mobile3").val("");
      },function (ps, err) {
        alert("db 오류 " + err.message + err.code);
      }
    );
  });
}

//전체 데이터 검색 트랜잭션 실행
let index = 0;
function listCard(position) {
  db.transaction(function (ps) {
    var selectCntSQL = "select count(*) as cnt from card";
    let cnt = 0;
    ps.executeSql(selectCntSQL, [], function (ps, rs) {
      cnt = rs.rows.item(0).cnt;
      if (cnt==0) {
        alert("목록에 없습니다.");
      } else {
        var selectSQL = "select * from card";
        ps.executeSql(selectSQL, [], function (ps, rs) {
          if(position == "first") {
            if (index == 0) alert("처음 목록입니다.");
            else index = 0;
          }else if(position == "prev") {
            if (index == 0) alert("처음 목록입니다.");
            else index = --index;
          }else if(position == "next") {
            if (index == rs.rows.length-1) alert("마지막 목록입니다.");
            else index = ++index;
          }else{
            if (index == rs.rows.length - 1) alert("마지막 목록입니다.");
            else index = rs.rows.length - 1;
          }
          $('#sName4').val(rs.rows.item(index).name); 	
          $('#company4').val(rs.rows.item(index).company);
          $('#position4').val(rs.rows.item(index).position);
          $('#mobile4').val(rs.rows.item(index).mobile);
          $('#cardid4').val(rs.rows.item(index).cardid);
        });
      }
    });
  });
}

//데이터 조건 검색 트랜잭션 실행
function selectCard4(name) {
  db.transaction(function (ps) {
    // var selectSQL='select type,name from book where name=?';
    var selectSQL = "select cardid, name, company, position, mobile from card where name like '%'||?||'%'";
    ps.executeSql(selectSQL,[name],function (ps, rs) {
      if(rs.rows.length==0){
        alert('일치하는 정보가 없습니다.')
      }else{
        //console.log('데이터 조건 검색 트랜잭션');
        //console.log(rs);
        $("#sName4").val(rs.rows.item(0).name);
        $("#company4").val(rs.rows.item(0).company);
        $("#position4").val(rs.rows.item(0).position);
        $("#mobile4").val(rs.rows.item(0).mobile);
        $('#cardid4').val(rs.rows.item(0).cardid);
      }
    },function (ps, err) {
      alert("db 오류 " + err.message + err.code);
    });
  });
}


//전체목록 실행
function totalList(){
  db.transaction(function(ps){
		let cnt = 0;
    var selectCntSQL = 'select count(*) as cnt from card';    
		$('#listTC').empty();
		ps.executeSql(selectCntSQL, [], function(ps, rs){ 
      //console.log(rs);
      cnt = rs.rows.item(0).cnt;
      //console.log("cnt");
      //console.log(cnt);
			if(cnt==0){
				$('#listTC').append("<li>목록이 없습니다. </li>"); 
			}else{
        var selectSQL = 'select * from card order by cardid desc';    
				ps.executeSql(selectSQL, [], function(ps, rs){ 
					var len = rs.rows.length; 
          //console.log(len);
          $('#cardid4').val(rs.rows.item(len-1).cardid);
          $('#sName4').val(rs.rows.item(len-1).name); 	
          $('#company4').val(rs.rows.item(len-1).company);
          $('#position4').val(rs.rows.item(len-1).position);
          $('#mobile4').val(rs.rows.item(len-1).mobile);
          for (i=0;i<len;i++) { 
						$('#listTC').append("<div class='list"+i+"'><input type='hidden' class='list_cardid' name='cardid4' value='"+rs.rows.item(i).cardid+"' />"+"<h3 class='list_name'>"+rs.rows.item(i).name+"</h3><p class='list_company'>"+rs.rows.item(i).company+"</p><p class='list_position'>" +rs.rows.item(i).position+"</p><p class='list_mobile'>"+rs.rows.item(i).mobile+"</p></div>"); 
					}
				});
			}
		});
	});
}

//명함 상세보기
function detail(mobile,cardid){
	db.transaction(function(ps){
    //console.log("detail");
    //console.log("mobile:"+mobile+"cardid:"+cardid);
    var selectDetailSQL = "select * from card where mobile=? and cardid=?";
		ps.executeSql(selectDetailSQL, [mobile,cardid], function(ps, rs){ 
      //console.log(rs);
      $('#name5').val(rs.rows.item(0).name); 	
      $('#company5').val(rs.rows.item(0).company);
      $('#position5').val(rs.rows.item(0).position);
      $('#mobile5').val(rs.rows.item(0).mobile);
      $('#email5').val(rs.rows.item(0).email);
      $('#tel5').val(rs.rows.item(0).tel);
      $('#addr5').val(rs.rows.item(0).addr);
      $('#memo5').val(rs.rows.item(0).memo);
      $('#cardid5').val(rs.rows.item(0).cardid);
		});
	});
}

//데이터 수정 트랜잭션 실행(상세페이지에서)
function updateCard_detail() {
  db.transaction(function (ps) {
    var new_name = $('#name5').val();
    var company = $('#company5').val();
    var position = $('#position5').val();
    var mobile = $('#mobile5').val();
    var email = $('#email5').val();
    var tel = $('#tel5').val();
    var addr = $('#addr5').val();
    var memo = $('#memo5').val();
    var cardid2= $('#cardid5').val();
    var updateSQL = "update card set name=?,company=?,position=?,mobile=?,email=?,tel=?,addr=?,memo=? where cardid=?";
    ps.executeSql(updateSQL,[new_name,company,position,mobile,email,tel,addr,memo,cardid2],function (ps, rs) {
        //console.log("5_명함 수정......");
        alert(new_name + "님이 수정되었습니다.");
        $('#name5').val(""); $('#company5').val(""); $('#position5').val(""); 
        $('#mobile5').val(""); $('#email5').val(""); $('#tel5').val(""); 
        $('#addr5').val(""); $('#memo5').val(""); $('#cardid5').val("");
      },function (ps, err) {
        alert("db 오류 " + err.message + err.code);
      }
    );
  });
}

//데이터 삭제 트랜잭션 실행(상세페이지에서)
function deleteCard_detail() {
  db.transaction(function (ps) {
    var cardid = $("#cardid5").val();
    var deleteSQL = "delete from card where cardid=?";
    ps.executeSql(deleteSQL,[cardid],function (ps, rs) {
      if(confirm($("#name5").val()+"님을 삭제하시겠습니까?")==true){
        //console.log("6_명함 삭제...");
        alert($("#name5").val() + "님이 삭제되었습니다.");
        $('#name5').val(""); $('#company5').val(""); $('#position5').val(""); 
        $('#mobile5').val(""); $('#email5').val(""); $('#tel5').val(""); 
        $('#addr5').val(""); $('#memo5').val(""); $('#cardid5').val("");
        totalList()
        location.href="#page4";
      }else{
        return;
      }
      },function (ps, err) {
        alert("db 오류 " + err.message + err.code);
      }
    );
  });
}