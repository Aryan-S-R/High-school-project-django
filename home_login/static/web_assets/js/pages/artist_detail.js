$(document).ready(function () {
    console.log("Web Artist Page");

    var ArtistData = $("#ArtistData").data('val');

    console.log("Artist Data = ", ArtistData);

    $(".artist_image").attr("src", "../../../media/" + ArtistData.img)

    $(".artist_name").text(ArtistData.name);
    $(".artist_biography").html(decodeURI(ArtistData.biography));

    var SubImages = ArtistData.related_images;

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
                                        <div class="container" id="artist_container_'+(p_id)+'"></div>\
                                    </div>\
                                    <div class="product-container"></div>\
                                </div>'

                $("#collections_view").append($finalOutput)
            }

            $container = "<div class='col-sm-4 col-md-4 col-xs-12 lc_img_padding'>\
                            <div class='product text-center'>\
                                <div class='product-image position-r lc_position'>\
                                    <a href='javascript:void(0)'>\
                                        <img data-id="+data[i].id+" src='../../../media/"+ data[i].image + "' alt='' class='img-responsive lc_img'>\
                                    </a>\
                                </div>\
                            </div>\
                        </div>"

            $("#artist_container_"+(p_id)).append($container);
            
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


    $("#collections_view").on("click" , ".lc_img" , function(){
        var thisId = $(this).data('id');
        console.log("THIS ID === ",thisId);
        var url = "/web_product?product_id=";
        window.location.href = url + thisId;
    })



})