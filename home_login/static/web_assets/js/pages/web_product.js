$(document).ready(function () {
    console.log("Web Product Page");

    var ProductData = $("#ProductData").data('val');

    console.log("Product Data = ", ProductData);

    $(".product_image").attr("src", "../../../media/" + ProductData.primary_image)

    $(".product_name").text(ProductData.name);
    $(".product_price").text(ProductData.price > 0 ? "₹ " + ProductData.price : '');
    $(".product_description").html(ProductData.description);
    $("#artist_id").val(ProductData.artist_id);
    $(".artist_name").text(ProductData.artist_name);
    $(".artist_biography").html(decodeURI(ProductData.artist_biography));

    var SubImages = ProductData.sub_images;

    displayCollections(SubImages)

    function displayCollections(data) {

        console.log("DATA _+++++ ==== ",data);

        $("#collections_view").empty();

        var $finalOutput = "";
        var $container = ""
        var count = 1;
        var p_id = 1

        for (var i = 0; i < data.length; i++) { 

            if (count == 1) {
                $finalOutput += '<div class="margin-bottom-40 margin-top-40">\
                                    <div class="row">\
                                        <div class="container" id="product_container_'+(p_id)+'"></div>\
                                    </div>\
                                    <div class="product-container"></div>\
                                </div>'

                $("#collections_view").append($finalOutput)
            }

            $container = "<div class='col-sm-4 col-md-4 col-xs-12' style='padding-left:30px;padding-right:30px'>\
                            <div class='product text-center'>\
                                <div class='product-image position-r lc_position'>\
                                    <a href='javascript:void(0)'>\
                                        <img src='../../../media/"+ data[i].image + "' alt='' class='img-responsive lc_img'>\
                                    </a>\
                                </div>\
                            </div>\
                        </div>"

            $("#product_container_"+(p_id)).append($container);
            
            if(count == 3){                
                $finalOutput="";
                $container = "";
                p_id++;
                count = 1
            }else{
                count++
            }
           
        }

        
    }

    $(".artist_name").click(function(){
        var url = "/artist_detail?artist_id=";
        window.location.href = url + $("#artist_id").val();
    })



})