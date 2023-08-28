$(document).ready(function(){
    console.log("Home Page");

    $.ajax({
        type : 'GET',
        url : $("#GetSliderDataURL").data('url'),
        success : (data) =>{
            console.log("data['slider_data'] === ",data['slider_data']);
            displayCarousel(data['slider_data'])
            $(".carousel-indicators-total").text((data['slider_data']).length)
        },
        error : (err) =>{
            console.log(err);
        }
    });


    function displayCarousel(data){

        $("#carouselView").empty();
        $("#carouselCountView").empty();

        var container = "";

        var slider = "";

        for(var i=0;i<data.length;i++){

            var active = i == 0 ? 'active' : '';
            var link_text = data[i].has_link ? "<a href='"+data[i].link_url+"' target='_blank' class='btn btn-primary btn-lg paira-animation' data-paira-animation='fadeInUp' data-paira-animation-delay='0.8s'>Visit</a>" : ""

            container += "<div class='item "+active+" lc_carousel_item' >\
                            <img class='lc_img' alt='First slide' src='../../../static/web_assets/images/slider/slider-1.jpg'>\
                            <div class='container'>\
                                <div class='carousel-caption carousel-caption1'>\
                                    <h1 class='text-capitalize margin-bottom-20 paira-animation' data-paira-animation='fadeInLeft' data-paira-animation-delay='0.2s'>"+data[i].tagline+"</h1>\
                                    "+link_text+"\
                                </div>\
                            </div>\
                        </div>"

            slider += "<li data-target='#Carousel' data-slide-to='"+i+"' class='"+active+"'>0"+(i+1)+"</li>"

        }

        // $("#carouselView").append("<div id='Carousel' class='carousel slide' data-ride='carousel'>\
        //                             <div class='carousel-inner'>"+container+"</div>\
        //                             <a class='left carousel-control paira-animation' href='#Carousel' data-slide='prev' data-paira-animation='fadeIn' data-paira-animation-delay='0.0ms'><span>PR<br>EV</span></a>\
        //                             <a class='right carousel-control paira-animation' href='#Carousel' data-slide='next' data-paira-animation='fadeIn' data-paira-animation-delay='0.10ms'><span>NE<br>XT</span></a>\
        //                             <ol class='carousel-indicators'>\
        //                                 "+slider+"    \
        //                             </ol>\
        //                             <span class='carousel-indicators-total'></span>\
        //                         </div>"
        // );

        $("#carouselView").append(container);
        $("#carouselCountView").append(slider);
    }


    $.ajax({
        type: 'GET',
        url: $("#GetLatestProductURL").data('url'),
        success: (data) => {
            console.log("LAtest Collection Data = ", data['product_data']);            
            displayLatest(data['product_data'])
        },
        error: (err) => {
            console.log(err);
        }
    });


    function displayLatest(data){

        $("#latestCollection").empty();

        var container = "";

        for(var i=0;i<data.length;i++){
            container += "<div class='col-sm-6 col-md-6 col-xs-12 margin-top-30'>\
                            <div class='product text-center'>\
                                <div class='product-image position-r'>\
                                    <a href='javascript:void(0)'>\
                                        <div class='background-overlay'></div>\
                                        <img src='../../../media/"+data[i].primary_image+"' alt='' class='img-responsive'>\
                                    </a>\
                                </div>\
                                <div class='product-hover'>\
                                    <h2 class='margin-clear'>"+data[i].name+"</h2>\
                                </div>\
                            </div>\
                        </div>"
        }

        $("#latestCollection").append(container)


        

    }


})