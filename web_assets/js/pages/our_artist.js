$(document).ready(function () {
    console.log("Artist Page");

    var TotalPageLength = 1;

    function getArtistDataAjax(page_no){
        $.ajax({
            type: 'GET',
            url: $("#GetArtistDataURL").data('url')+"?filter=true&page="+page_no,
            success: (data) => {
                console.log("Artist Data = ", data['artist_data']);
                displayArtists(data['artist_data']);
                displayPagination(data['total_artist'])
                
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

    getArtistDataAjax(1);


    function displayArtists(data) {

        $("#artists_view").empty();
        var $container = "";

        for (var i = 0; i < data.length; i++) {
            // $container += "<div class='col-md-3' style='margin-top:70px'>\
            //                 <div class='artist_author text-center' style='margin-bottom:35px'>\
            //                     <h4>"+ data[i].name + "</h4>\
            //                 </div>\
            //                 <div class='product text-center'>\
            //                     <div class='product-image position-r lc_position' style='height:300px'>\
            //                         <a href='javascript:void(0)'>\
            //                             <img data-id="+data[i].id+" style='border:none;border-radius:50%' src='../../../media/"+ data[i].img + "' alt='' class='img-responsive lc_img'>\
            //                         </a>\
            //                     </div>\
            //                 </div>\
            //             </div>"


            $container += "<div class='col-md-4 col-sm-4 col-xs-6' style='margin-top:70px'>\
                                <div data-id="+data[i].id+" class='position-r lc_position'>\
                                    <img src='../../../media/"+ data[i].img + "' alt='' class='img-responsive center-block lc_img'>\
                                    <div class='team-title'>\
                                        <h4 class='margin-bottom-10'>"+ data[i].name + "</h4>\
                                    </div>\
                                </div>\
                            </div>"


        }

        $("#artists_view").append($container);
    }

    
    function displayPagination(count){
        if(count > 0){
            var paginationLength = Math.ceil(count/9);
            TotalPageLength = paginationLength;
            $("#paginationView").empty();
            var container = "";

            for(var i=1;i<=paginationLength;i++){
                if(i==parseInt($("#CurrentPage").val())){
                    container += "<li style='cursor:auto;pointer-events:none' class='active font-bold lc_pagination' data-id='lc_pagination_"+i+"'  id='lc_pagination_"+i+"' data-val="+i+"><span>"+i+"</span></li>"
                }
                else{
                    container += "<li class='lc_pagination' data-id='lc_pagination_"+i+"' id='lc_pagination_"+i+"' data-val="+i+"><a href='javascript:void(0)'>"+i+"</a></li>"
                }
            }

            $("#paginationView").append("<li><a href='javascript:void(0)' class='prev-page'><i class='fa fa-caret-left'></i></a></li>\
                                            "+container+"\
                                         <li><a href='javascript:void(0)' class='next-page'><i class='fa fa-caret-right'></i></a></li>")

        }
    }


    $("#artists_view").on("click", ".lc_position" , function(){
        var thisId = $(this).data('id');
        var url = "/artist_detail?artist_id=";
        window.location.href = url + thisId;
    })



    $("#paginationView").on("click" , ".lc_pagination" , function(){
        var thisData = $(this).data('val');
        $("#paginationView .lc_pagination").removeClass("active").css({"cursor":"pointer","pointer-events": "auto"});
        $(this).addClass("active").css({"cursor":"auto","pointer-events": "none"});
        $("#CurrentPage").val(thisData);
        getArtistDataAjax(thisData);
    });

    $("#paginationView").on("click" , ".prev-page" , function(){
        var currentPage = parseInt($("#CurrentPage").val());
        if(currentPage > 1){
            setCurrentPage(currentPage , "prev")            
        }
    });

    $("#paginationView").on("click" , ".next-page" , function(){
        var currentPage = parseInt($("#CurrentPage").val());
        if(currentPage < TotalPageLength){
            setCurrentPage(currentPage , "next")
        }
    });

    function setCurrentPage(cp , action){
        var curr_page = action == "prev" ? cp -1 : cp + 1;
        $("#paginationView .lc_pagination").removeClass("active").css({"cursor":"pointer","pointer-events": "auto"});
        $("#paginationView #lc_pagination_"+(curr_page)).addClass("active").css({"cursor":"auto","pointer-events": "none"});
        $("#CurrentPage").val(curr_page);
        getArtistDataAjax(curr_page);
    }




})