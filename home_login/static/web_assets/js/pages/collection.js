$(document).ready(function () {
    console.log("Collection Page");

    var TotalPageLength = 1;

    function getProductDataAjax(page_no){
        $.ajax({
            type: 'GET',
            url: $("#GetProductURL").data('url')+"?filter=true&page="+page_no,
            success: (data) => {
                console.log("Collection Data = ", data['product_data']);
                displayCollections(data['product_data']);
                displayPagination(data['total_products'])
                
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

    getProductDataAjax(1);


    function displayCollections(data) {

        $("#collections_view").empty();

        var $finalOutput = "";
        var $container = ""
        var count = 1;
        var p_id = 1

        for (var i = 0; i < data.length; i++) {

            var price = parseInt(data[i].price) > 0 ? "₹ " + data[i].price : "";
            var soldHtml = data[i].is_sold ? "<div class=product-stock-out><span>Sold</span></div>" : "";

            if (count == 1) {
                $finalOutput += '<div class="margin-bottom-40 margin-top-40">\
                                    <div class="row">\
                                        <div class="container" id="product_container_'+ (p_id) + '"></div>\
                                    </div>\
                                    <div class="product-container"></div>\
                                </div>'

                $("#collections_view").append($finalOutput)
            }

            $container = "<div class='col-sm-4 col-md-4 col-xs-12'>\
                            <div class='collection_author text-center'>\
                                <h4>"+ data[i].name + "</h4>\
                            </div>\
                            <div class='product text-center'>\
                                <div class='product-image position-r lc_position'>\
                                    <a href='javascript:void(0)'>\
                                        <div class='background-overlay'></div>\
                                        <img src='../../../media/"+ data[i].primary_image + "' alt='' class='img-responsive lc_img'>\
                                    </a>\
                                </div>\
                                "+ soldHtml + "\
                                <div class='product-hover'>\
                                    <h4 class='margin-clear'><a style='cursor:auto' href='javascript:void(0)'>"+ data[i].artist_name + "</a></h4>\
                                    <div class='text-center prices'>\
                                        <h3 class='pull-left margin-left-5'><span class='money'>"+ price + "</span></h3>\
                                    </div>\
                                    <div class='paira-wish-compare-con wish-compare-view-cart'>\
                                        <a href='javascript:void(0)' class='paira-quick-view quick-view  productQuickView  btn btn-default' data-val='" + JSON.stringify(data[i]) + "'><i class='fa fa-search-plus'></i></a>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>"

            $("#product_container_" + (p_id)).append($container);

            if (count == 3) {
                $finalOutput = "";
                $container = "";
                p_id++;
                count = 1
            } else {
                count++
            }

        }
    }

    function displayPagination(count){
        console.log("Total Product = ",count);
        if(count > 0){
            var paginationLength = Math.ceil(count/9);
            TotalPageLength = paginationLength
            console.log("Pagination Length = ",paginationLength);

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

    $("#paginationView").on("click" , ".lc_pagination" , function(){
        var thisData = $(this).data('val');
        $("#paginationView .lc_pagination").removeClass("active").css({"cursor":"pointer","pointer-events": "auto"});
        $(this).addClass("active").css({"cursor":"auto","pointer-events": "none"});
        $("#CurrentPage").val(thisData);
        getProductDataAjax(thisData);
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
        getProductDataAjax(curr_page);
    }

    $("#collections_view").on("click", ".productQuickView", function () {
        var thisData = $(this).data('val');
        var SubImages = thisData.sub_images;
        $("#ProductId").val(thisData.id);
        $("#thisProductName").text(thisData.name);
        $("#thisProductArtist").text("Artist : "+thisData.artist_name);
        $("#thisProductPrice").text(parseInt(thisData.price) > 0 ? "Price : ₹ " + thisData.price : "");
        $("#thisProductImage").attr('src', "../../../media/" + thisData.primary_image);
        $("#productSubImageContainer").empty();

        var subImgContainer = "";
        for (var i = 0; i < SubImages.length; i++) {
            subImgContainer += "<div style='width:150px;height:150px'>\
                                    <a href='{% url 'web_product' %}?product_id="+ thisData.id + "' data-image='../../../media/" + SubImages[i].image + "'>\
                                        <img style='width:100%;height:100%;object-fit:cover' src='../../../media/"+ SubImages[i].image + "' alt='" + SubImages[i].image + "' class='img-responsive center-block'/>\
                                    </a>\
                                </div>"
        }

        $("#productSubImageContainer").append("<div class='bx-carousel-fix'>\
                                                <div class='quick-product-image-list paira-quick-product-image-list'>\
                                                "+ subImgContainer + "\
                                                </div>\
                                            </div>\
                                            <div class='single-product-container-small'></div>"
        );

    });


    $("#viewDetailsBtn").click(function () {
        var url = "/web_product?product_id=";
        window.location.href = url + $("#ProductId").val();
    });


})